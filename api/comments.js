// プレビュー用コメント機能のサーバー側（Vercel Functions）。
// コメントは GitHub の Issues（storm-site リポジトリ）に保存する。
//
// Vercel の「Settings → Environment Variables」に設定するもの：
//   REVIEW_GITHUB_TOKEN  GitHub の鍵（storm-site の Issues だけ読み書きできるもの）
//   REVIEW_REPO          省略可。既定は makimakinic/storm-site
// 本番公開（DNS切り替え）のときは、これを Vercel から削除する。

const MARK = 'review-meta';
const MAX_TEXT = 3000;

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  if (req.body !== undefined) {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const s = Buffer.concat(chunks).toString('utf8');
  return s ? JSON.parse(s) : {};
}

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v) => (Number.isFinite(v) ? Math.round(v * 10000) / 10000 : null);

// Issue の本文：人が読める部分 ＋ 機械が読む部分（HTMLコメントの中のJSON）
function issueBody(c) {
  const where = `${c.page}（${c.lang === 'ja' ? '日本語' : '英語'}、画面幅 ${c.width}px）`;
  return [
    c.text,
    '',
    '---',
    `**${c.name}** さん ／ ${where}`,
    c.snippet ? `場所の近くの文字：「${c.snippet}」` : '',
    '',
    `<!-- ${MARK} ${JSON.stringify(c).replace(/--/g, '\\u002d\\u002d')} -->`,
  ].filter((l) => l !== null).join('\n');
}

function parseIssue(issue) {
  const m = (issue.body || '').match(new RegExp(`<!-- ${MARK} (\\{[\\s\\S]*\\}) -->`));
  if (!m) return null;
  try {
    const c = JSON.parse(m[1]);
    return { ...c, id: issue.number, created: issue.created_at, url: issue.html_url };
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const token = process.env.REVIEW_GITHUB_TOKEN;
  const repo = process.env.REVIEW_REPO || 'makimakinic/storm-site';
  const apiBase = process.env.REVIEW_GITHUB_API || 'https://api.github.com';
  if (!token) return send(res, 503, { error: 'not-configured' });

  // 合言葉なし。ほかのサイトから書き込まれないよう、送信元がこのサイトかだけ確かめる
  if (req.method === 'POST') {
    const origin = req.headers.origin;
    if (!origin || new URL(origin).host !== req.headers.host) return send(res, 403, { error: 'origin' });
  }

  const gh = (path, init = {}) =>
    fetch(`${apiBase}/repos/${repo}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'storm-site-review',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });

  try {
    if (req.method === 'GET') {
      const all = [];
      for (let page = 1; page <= 10; page++) {
        const r = await gh(`/issues?state=open&per_page=100&page=${page}`);
        if (!r.ok) return send(res, 502, { error: 'github', status: r.status });
        const list = await r.json();
        for (const i of list) {
          if (i.pull_request) continue;
          const c = parseIssue(i);
          if (c) all.push(c);
        }
        if (list.length < 100) break;
      }
      all.sort((a, b) => a.id - b.id);
      return send(res, 200, { comments: all });
    }

    if (req.method === 'POST') {
      const b = await readBody(req);

      if (b.action === 'delete') {
        // 削除：本文を消して閉じる（GitHub の仕組み上、Issue そのものは消せない）
        const id = Number(b.id);
        if (!Number.isInteger(id) || id < 1) return send(res, 400, { error: 'bad-id' });
        const g = await gh(`/issues/${id}`);
        if (!g.ok || !parseIssue(await g.json())) return send(res, 404, { error: 'not-found' });
        const by = str(b.name, 60);
        const r = await gh(`/issues/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: '💬 （削除されたコメント）',
            body: `このコメントは${by ? ` ${by} さんが` : ''}削除しました。`,
            state: 'closed',
            state_reason: 'not_planned',
          }),
        });
        if (!r.ok) return send(res, 502, { error: 'github', status: r.status });
        return send(res, 200, { ok: true });
      }

      if (b.action === 'resolve') {
        const id = Number(b.id);
        if (!Number.isInteger(id) || id < 1) return send(res, 400, { error: 'bad-id' });
        // 本当にコメント用の Issue かを確かめてから閉じる
        const g = await gh(`/issues/${id}`);
        if (!g.ok || !parseIssue(await g.json())) return send(res, 404, { error: 'not-found' });
        const by = str(b.name, 60);
        if (by) {
          await gh(`/issues/${id}/comments`, {
            method: 'POST',
            body: JSON.stringify({ body: `${by} さんが「解決」にしました。` }),
          });
        }
        const r = await gh(`/issues/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ state: 'closed', state_reason: 'completed' }),
        });
        if (!r.ok) return send(res, 502, { error: 'github', status: r.status });
        return send(res, 200, { ok: true });
      }

      const a = b.anchor || {};
      const c = {
        name: str(b.name, 60),
        text: str(b.text, MAX_TEXT),
        page: str(b.page, 200),
        lang: b.lang === 'ja' ? 'ja' : 'en',
        width: Number.isFinite(b.width) ? Math.round(b.width) : 0,
        snippet: str(b.snippet, 80),
        anchor: {
          selector: str(a.selector, 800),
          x: num(a.x),
          y: num(a.y),
          docX: num(a.docX),
          docY: num(a.docY),
        },
      };
      if (!c.name || !c.text || !c.page.startsWith('/')) return send(res, 400, { error: 'missing' });

      const title = `💬 ${c.page} ${c.text.replace(/\s+/g, ' ').slice(0, 50)}`;
      const r = await gh('/issues', { method: 'POST', body: JSON.stringify({ title, body: issueBody(c) }) });
      if (!r.ok) return send(res, 502, { error: 'github', status: r.status });
      return send(res, 200, { comment: parseIssue(await r.json()) });
    }

    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'method' });
  } catch (e) {
    return send(res, 500, { error: 'server', message: String(e && e.message) });
  }
}

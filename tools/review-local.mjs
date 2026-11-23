// コメント機能を手元で試すためのサーバー。
// dist/ を表示し、/api/comments は api/comments.js を動かす。
// GitHub の代わりに、このPCのメモリ上の仮の保存先を使う（止めると消える）。
// 使い方: npm run build のあと node tools/review-local.mjs → http://localhost:4400
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const PORT = Number(process.env.PORT || 4400);
const MOCK = PORT + 1;

// ---- 仮の GitHub Issues ----
const issues = [];
const mock = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
  const u = new URL(req.url, 'http://x');
  const json = (s, d) => { res.writeHead(s, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(d)); };
  const m = u.pathname.match(/^\/repos\/[^/]+\/[^/]+\/issues(?:\/(\d+))?(\/comments)?$/);
  if (!m) return json(404, {});
  if (!m[1] && req.method === 'GET') {
    const per = Number(u.searchParams.get('per_page') || 30), page = Number(u.searchParams.get('page') || 1);
    const open = issues.filter((i) => i.state === 'open').reverse();
    return json(200, open.slice((page - 1) * per, page * per));
  }
  if (!m[1] && req.method === 'POST') {
    const i = { number: issues.length + 1, state: 'open', title: body.title, body: body.body, created_at: new Date().toISOString(), html_url: '#' };
    issues.push(i);
    return json(201, i);
  }
  const i = issues.find((x) => x.number === Number(m[1]));
  if (!i) return json(404, {});
  if (m[2]) return json(201, {});
  if (req.method === 'PATCH') { Object.assign(i, body); return json(200, i); }
  return json(200, i);
});
mock.listen(MOCK);

process.env.REVIEW_GITHUB_TOKEN = 'local';
process.env.REVIEW_GITHUB_API = `http://localhost:${MOCK}`;
const { default: handler } = await import('../api/comments.js');

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api/comments') return handler(req, res);
  let f = path.join(dist, decodeURIComponent(u.pathname));
  if (!f.startsWith(dist)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404, { 'Content-Type': 'text/html' }); const nf = path.join(dist, '404.html'); return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found'); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));

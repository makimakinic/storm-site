// 画面幅320〜1920pxで、横はみ出し・文字の重なりがないかを自動チェックするツール。
// （試作の prototype/resp.py をこのサイト用に移したもの。チェック内容は同じ）
// 使い方: npm run build → npm run preview（別ウィンドウ） → npm run check:layout
import { chromium } from 'playwright-core';
import { findChrome } from './chrome.mjs';

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const WIDTHS = [320, 375, 414, 600, 768, 900, 1024, 1180, 1280, 1440, 1920];
const PAGES = ['', 'research/', 'corporate/', 'coverage/', 'coverage/#coverage-research', 'about/', 'careers/', 'contact/'];

const CHECK = () => {
  const vw = innerWidth, out = { overflow: document.documentElement.scrollWidth - vw, wide: [], overlaps: [] };
  const vis = (el) => { const r = el.getBoundingClientRect(); const st = getComputedStyle(el); return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none' && el.offsetParent !== null; };
  document.querySelectorAll('.view.on *, header *, footer *').forEach((el) => {
    if (!vis(el)) return;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && !el.closest('.kanji') && !el.closest('.covgroup')) out.wide.push((el.className || el.tagName) + ' ' + Math.round(r.right));
  });
  const leaves = [...document.querySelectorAll('.view.on h1, .view.on h2, .view.on h3, .view.on p, .view.on a.btn, .view.on li, header a, header button, header img, .view.on .node, .view.on label, .view.on b')].filter((e) => vis(e) && !e.closest('details:not([open])'));
  const rects = leaves.map((e) => [e, e.getBoundingClientRect()]);
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const [a, ra] = rects[i], [b, rb] = rects[j];
    if (a.contains(b) || b.contains(a)) continue;
    const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
    if (ox > 4 && oy > 4) out.overlaps.push((a.className || a.tagName) + ':' + a.textContent.trim().slice(0, 18) + ' X ' + (b.className || b.tagName) + ':' + b.textContent.trim().slice(0, 18));
  }
  out.wide = [...new Set(out.wide)].slice(0, 8); out.overlaps = [...new Set(out.overlaps)].slice(0, 8);
  return out;
};

const browser = await chromium.launch({ executablePath: findChrome() });
let problems = 0;
for (const w of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  for (const lang of ['en', 'ja']) {
    for (const p of PAGES) {
      await page.goto(`${BASE}/${lang === 'ja' ? 'ja/' : ''}${p}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(p === '' ? 1700 : 150);
      const r = await page.evaluate(CHECK);
      if (r.overflow > 0 || r.wide.length || r.overlaps.length) {
        problems++;
        console.log(w, lang, p || '/', JSON.stringify(r));
      }
    }
  }
  await page.close();
}
await browser.close();
console.log(problems ? `${problems} problem(s) found.` : 'No overflow or overlapping text at any width (320–1920px).');
process.exitCode = problems ? 1 : 0;

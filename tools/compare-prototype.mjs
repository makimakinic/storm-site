// 試作（prototype/index.html）と本番サイト（dist/）の見た目を画面写真で比べるツール。
// 使い方: npm run build → npm run preview（別ウィンドウ） → npm run compare
// 差があったページは tools/out/compare/ に「試作・本番・差分」の画像を保存します。
// デザインを変え始めたら、このツールは役目を終えます（試作と違って当然になるため）。
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { findChrome } from './chrome.mjs';

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const WIDTHS = (process.env.WIDTHS || '320,390,768,1024,1280,1440,1920').split(',').map(Number);
const OUT = 'tools/out/compare';
const PAGES = [
  ['home', '', ''],
  ['research', 'research', 'research/'],
  ['corporate', 'corporate', 'corporate/'],
  ['coverage', 'coverage', 'coverage/'],
  ['coverage-research', 'coverage-research', 'coverage/#coverage-research'],
  ['about', 'about', 'about/'],
  ['careers', 'careers', 'careers/'],
  ['contact', 'contact', 'contact/'],
];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const protoUrl = pathToFileURL(path.resolve('prototype/index.html')).href;

const browser = await chromium.launch({ executablePath: findChrome() });
const settle = async (page) => {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800); // トップの登場アニメーションが終わるまで
};
let problems = 0;
for (const w of WIDTHS) {
  for (const lang of ['en', 'ja']) {
    for (const [name, hash, p] of PAGES) {
      // ページごとに履歴の無いブラウザで開く（訪問済みリンクの色の違いを避けるため）
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
      await ctx.addInitScript((l) => { try { localStorage.setItem('storm-lang', l); } catch {} }, lang);
      const a = await ctx.newPage();
      const b = await ctx.newPage();
      await a.goto(`${protoUrl}#${hash}`);
      await settle(a);
      await b.goto(`${BASE}/${lang === 'ja' ? 'ja/' : ''}${p}`);
      await settle(b);
      const tag = `${w}-${lang}-${name}`;
      const height = (pg) => pg.evaluate(() => document.documentElement.scrollHeight);
      const [ha, hb] = [await height(a), await height(b)];
      if (ha !== hb) {
        problems++;
        console.log(`SIZE  ${tag}: prototype height ${ha}px, site ${hb}px`);
        fs.writeFileSync(`${OUT}/${tag}-prototype.png`, await a.screenshot());
        fs.writeFileSync(`${OUT}/${tag}-site.png`, await b.screenshot());
        await ctx.close();
        continue;
      }
      // 長いページは4000pxずつに分けて比べる（ブラウザの画面写真の高さに上限があるため）
      let n = 0;
      for (let y = 0; y < ha; y += 4000) {
        const clip = { x: 0, y, width: w, height: Math.min(4000, ha - y) };
        const ia = PNG.sync.read(await a.screenshot({ fullPage: true, clip }));
        const ib = PNG.sync.read(await b.screenshot({ fullPage: true, clip }));
        const diff = new PNG({ width: ia.width, height: ia.height });
        const k = pixelmatch(ia.data, ib.data, diff.data, ia.width, ia.height, { threshold: 0.1 });
        if (k > 0) {
          fs.writeFileSync(`${OUT}/${tag}-y${y}-prototype.png`, PNG.sync.write(ia));
          fs.writeFileSync(`${OUT}/${tag}-y${y}-site.png`, PNG.sync.write(ib));
          fs.writeFileSync(`${OUT}/${tag}-y${y}-diff.png`, PNG.sync.write(diff));
        }
        n += k;
      }
      if (n > 0) {
        problems++;
        console.log(`PIXEL ${tag}: ${n} pixels differ`);
      }
      await ctx.close();
    }
  }
  console.log(`width ${w} done`);
}
await browser.close();
console.log(problems ? `${problems} page(s) differ — see ${OUT}/` : 'All pages match the prototype pixel for pixel.');
process.exitCode = problems ? 1 : 0;

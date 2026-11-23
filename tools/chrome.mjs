// 確認ツールで使うブラウザ（PCに入っている Chrome か Edge）を探す。
import fs from 'fs';

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

export function findChrome() {
  const found = CANDIDATES.find((p) => p && fs.existsSync(p));
  if (!found) throw new Error('Chrome / Edge が見つかりません。CHROME_PATH にブラウザの場所を指定してください。');
  return found;
}

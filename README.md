# Storm Research ウェブサイト（stormresearch.co.uk）

Astro で作った静的サイトです。GitHub に保存すると Vercel が自動で公開します。
レポートサイト（storm-research-site）と同じ仕組みです。

## ページ

| 英語 | 日本語 | 本文のファイル |
|---|---|---|
| `/` | `/ja/` | `src/views/Home.astro` |
| `/research/` | `/ja/research/` | `src/views/Research.astro` |
| `/corporate/` | `/ja/corporate/` | `src/views/Corporate.astro` |
| `/coverage/` | `/ja/coverage/` | `src/views/Coverage.astro` |
| `/about/` | `/ja/about/` | `src/views/About.astro` |
| `/careers/` | `/ja/careers/` | `src/views/Careers.astro` |
| `/contact/` | `/ja/contact/` | `src/views/Contact.astro` |

## よくある作業

- **文言を直す**：`src/views/` の各ファイルで、英語と日本語を並べて書いています。
  `<span class="en">英語</span><span class="ja">日本語</span>` の形です。
  英語ページには英語だけ、日本語ページには日本語だけが書き出されます。
- **ページの題名・説明文（検索結果に出る文）**：`src/lib/pages.ts`
- **ヘッダー・フッター**：`src/components/Header.astro`、`src/components/Footer.astro`
- **色・余白などのデザイン**：`src/styles/global.css`
- **導入企業を足す**：`data/corporate-clients.json` に1社分を足し、ロゴを `public/assets/logos/` に置く
- **ロードショー都市を足す**：`data/roadshow-cities.json` の該当地域に1行足す（地図の点・都市数・一覧が自動で変わる）
- **カバレッジ一覧**：`data/research-coverage.json`
- **画像**：`public/assets/`

## 設定（src/site.ts）

- `indexable`：検索エンジンに載せるか。プレビュー中は `false`。公開のときに `true` にする
- `reportsSite`：レポートサイトのURL
- `hubspot.trackingCode`／`hubspot.forms`：HubSpotの埋め込みコードを貼る場所。
  フォームが空のあいだは試作と同じ見本のフォームが表示されます（送信はされません）。
  `indexable` を `true` にしたときに未設定のものがあると、ビルドが止まって知らせます。

## 手元で動かす

Node.js 22.12以上が必要です。

```bash
npm install
npm run dev        # http://localhost:4321 で確認（編集するとすぐ反映）
npm run build      # dist/ に本番用HTMLを出力
npm run preview    # 出力したものを http://localhost:4321 で確認
```

## 確認ツール（PCの Chrome か Edge を使います）

`npm run build` と `npm run preview` のあとで実行します。

- `npm run check:layout`：画面幅320〜1920pxで、横はみ出し・文字の重なりがないかを調べる
- `npm run compare`：試作（`prototype/index.html`）と画面写真を比べる。デザインを変え始めたら使わない

## フォルダ

```
data/            導入企業・カバレッジ・ロードショー都市（JSON）
public/assets/   画像
src/views/       各ページの本文（英日並記）
src/components/  ヘッダー、フッター、企業カード、地図、HubSpotフォームの置き場所
src/layouts/     全ページ共通の <head>、言語の切り分け、ページの動き（JS）
src/lib/         ページ一覧、言語の切り分け処理、構造化データ
src/site.ts      サイトの設定
prototype/       claude.ai で作った試作（見比べ用に残している）
tools/           確認ツール
```

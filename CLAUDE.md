# Storm Research ウェブサイト リニューアル

HubSpot上の stormresearch.co.uk を、自前のコードで作り直すプロジェクト。
claude.ai で作った試作（`prototype/index.html`）を、Astro の静的サイトに作り直した（見た目・文言は試作と同じ）。構成と作業方法は `README.md`。

## 進め方（2026-11-23 に担当者と合意）
1. 公開の土台：Astro化（試作と同じ見た目）＋ GitHub（makimakinic/storm-site）＋ Vercel のプレビューURL https://storm-site-one.vercel.app/ （noindex）← 完了
2. プレビューURLを見ながらデザインを編集する ← 今ここ
3. 切り替えの準備：旧URL→新URLの301リダイレクト表、HubSpotのフォームとトラッキングコード、規約などの本文、電話番号の確定、FCAの文言チェック
4. DNS切り替え：サイト用のA／CNAMEレコードだけを Vercel に向ける。MX と HubSpot のメール用レコード（DKIM・SPF）には触らない。事前にTTLを短くし、旧レコードの値を控えておく。Vercel の REVIEW_GITHUB_TOKEN と REVIEW_PASSWORD（コメント機能）を削除する。HubSpot上に同じドメインのランディングページ・ブログ・ファイルが無いか事前に確認する

- **トップのURL https://stormresearch.co.uk/ は変えない**（多くの外部サイトにリンクが載っているため）

## 会社と2つの事業
- 会社名は **Storm Research Ltd**（英国、FCA認可・規制、2009年創業、所在地 Burton upon Trent、会社番号 06952562）
- **Storm Research**：海外機関投資家向けの日本中小型株リサーチ。タグライン **"All about ideas."**、キーワードは「アイデア」。色は紺 `#1E4B6C`、淡い青 `#83B6DD`
- **Storm Corporate**：日本の上場企業向けの海外IR支援。タグライン **"All about engagement."**。色はワインレッド `#932E3C`
- 連絡先：info@stormresearch.co.uk、LinkedIn https://www.linkedin.com/company/storm-research-ltd/ 、X https://twitter.com/Storm_Research

## 本番の作り方（決定事項）
- 静的サイト（Astro推奨）＋ GitHub ＋ Vercel。既存のレポートサイト（storm-research-site、Vercel上。正式URLは research.stormresearch.co.uk 予定）と同じ仕組みにそろえ、できれば同じプロジェクトに統合する
- ページごとに別URL：`/` `/research` `/corporate` `/coverage` `/about` `/careers` `/contact`。日本語版は `/ja/...`、hreflang を付ける
- 試作は1ファイル内で表示を切り替えているが、本番ではJS無しで本文が読めるように各ページを静的に出力する（AEO/SEOのため）
- データは `data/` のJSONから生成する（導入企業、Researchカバレッジ、ロードショー都市）。企業を足すときはJSONに1行足すだけにする
- フォームは HubSpot の埋め込みフォームを使う（お問い合わせ／無料登録／採用応募）。**採用フォームは今のHubSpotのフォームを質問内容そのままで埋め込む**
- HubSpotのトラッキングコードとCookie同意バナーを入れる
- 旧HubSpotサイトのURLから新URLへの301リダイレクト表を作る
- 構造化データ（Organization、FAQPage）、meta description、OGP、sitemap、robots を入れる
- 公開前は検索エンジンに載らないプレビューURLで確認する
- DNS切り替えのときはMXレコード（メール）に触らない

## デザインの決まり
- フォント：見出し Shippori Mincho、本文 Zen Kaku Gothic New（日英共通）
- トップは紺（Research）とワインレッド（Corporate）の左右2分割。背景の大きな漢字は「閃」と「繋」
- ヘッダー：左にStorm Researchのロゴ、右に「カバレッジ」だけ淡い青の枠付きボタン、言語切り替えは「EN / JP」
- 各ページ冒頭の写真：Researchは竹の手水鉢（`bamboo.jpg`）、Corporateは五重塔と紅葉（`pagoda.jpg`）。2つは同じ高さ・文字サイズ・かぶせ色の濃さでそろえる
- 人物写真は白背景、黄みを抑えて彩度を少し落とす（全員同じ処理）
- 導入企業のロゴは、縦横比から「見た目の面積」がそろうように計算した大きさで表示（`logo_display_px` を参照）。Bitcoin Japanとメタプラネットだけ少し大きく、8px上にずらしている。1行4社
- フッターの2つのロゴは同じ見た目の大きさにそろえる（Research 190px / Corporate 188px）、あいだに余白
- **改行**：日本語は文節の途中で切らない（`word-break:auto-phrase`）。担当者がコメントで指定した改行位置は試作の `<br class="pc">` と `.lines .ln` に入っている。英語も同じ区切りにそろえている。1行指定は幅1200px以上だけで効かせ、狭い画面では自然に折り返す
- 画面幅320〜1920pxで、はみ出し・文字の重なりがないことを確認する（`npm run check:layout` が自動チェック）

## 文言の決まり（担当者から指示済み）
- 日本語では「機関投資家」ではなく **「海外機関投資家」**、「IR」ではなく **「海外IR」** を使う（役職名「IR責任者」、サービス名「ストームIRインサイト」、利用対象の規制上の説明は除く）。ただし無料登録の見出しは「機関投資家の方は無料でご利用いただけます」
- **「プッシュ」「push」は使わない**（投資家側の印象が悪いため）。「配信」「届ける」「積極的に」「highlight」「bring」などに言い換える
- **サンプルレポートの請求は載せない**
- **購読プラン（Subscriptions）のセクションは載せない**
- 数字：カバレッジ **800社以上**、Corporateの支援企業 **50社以上**、登録海外機関投資家 **1,600名以上**、海外ロードショー年8〜10本、1on1年100件以上
- 企業ミーティングの開催場所は「ロンドン」ではなく **「世界各地」**
- 日本語レポートは **株探（かぶたん）** に掲載
- 1on1ミーティングと海外ロードショーは **年間契約なし**（1on1は成功報酬型）
- FAQの日本語対応は「日本語ネイティブまたは日本語が堪能なメンバー」

## 載せないと決めたもの（理由：機密・FCA・競合比較）
- 閲覧ダッシュボードの実データ（載せるならぼかしたイメージのみ）
- 保有につながった投資家名（Baillie Gifford など）
- 「株価+20%」と導入実績の表（Company A〜C）
- 投資家ネットワークの地域別・投資スタイル別の内訳（合計1,600名以上だけ載せる）
- お客様の声のセクション（掲載許可はあるが、担当者の指示で削除）
- 推奨銘柄の個別名とテーゼ、購読料金
- チームは創業者2名（Rhiannon、Rowan）＋ Rogerio、Francesca、Sho の5名のみ。出身大学は載せない

## 未確定・確認待ち
- 電話番号：表示は +44 (0)121 815 9426、今のサイトの発信リンクは +44 121 288 3402。どちらが正しいか
- Sho Murai さんの写真（今はイニシャル表示）
- ディスクロージャー／利用規約／プライバシーポリシーの本文（今のサイトから移す）
- HubSpotフォームの埋め込みコード3つとトラッキングコード
- FCA観点での文言チェック（コンプライアンス担当）
- 「1社1ページ、ページ内のタブで過去のレポート」というレポートサイト側の構成。導入企業カードはその企業ページ（`/companies/{code}/`）にリンクする。今ページがあるのは QUICK（4318）だけ

## ファイル
- 本番サイトの構成は `README.md` を参照（`src/views/` に英日並記の本文、`src/site.ts` に設定）
- 本文は試作と同じく `<span class="en">…</span><span class="ja">…</span>` で並記し、`src/lib/localize.ts` がページの言語だけを残す。日本語ページでは内部リンクに `/ja` を付ける
- `prototype/index.html`：画像を埋め込んだ試作（見比べ用）。`prototype/src.html` が元で、`prototype/build.py` で生成（画像は `public/assets/` から）
- `prototype/map.mjs`：世界地図を作ったスクリプト。陸地の形は `src/data/world-land-path.txt` に保存し、都市の点は `src/components/RoadshowMap.astro` が同じ投影法で計算する
- `public/assets/`：ロゴ、人物写真、背景写真、企業ロゴ（`logos/{証券コード}.png|svg`、日英で違うものは `-en` / `-ja`）
- `data/corporate-clients.json`：Storm Corporate導入企業32社。`report_page` は true/false（リンク先は `src/site.ts` の `reportsSite` から作る）。日英でロゴが違う企業は `logo` と `logo_display_px` を `{ "en": …, "ja": … }` にする
- `data/research-coverage.json`：Storm Researchのカバレッジ（旧サイトから取得、重複・旧社名あり。要整理。例：5857・9090・6086 が2社ずつ）
- `data/roadshow-cities.json`：ロードショー都市（地域ごと、英日名と経度・緯度）
- プレビュー用コメント機能：`src/components/ReviewComments.astro`（画面）＋ `api/comments.js`（GitHub Issues に保存）。チームのデザイン要望はここに集まる。Issue本文の `review-meta` にページ・画面幅・場所が入っている
- `tools/`：`check-layout.mjs`（320〜1920pxのはみ出し・重なりチェック）、`compare-prototype.mjs`（試作との画面写真比較）

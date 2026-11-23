// サイト全体の設定。公開作業で触るのはこのファイルだけです。

export const SITE = {
  name: 'Storm Research',
  // 本番のURL（変えない）
  url: 'https://stormresearch.co.uk',

  // 検索エンジンに載せるかどうか。
  // プレビュー中は false（どのページにも noindex が付く）。
  // DNSを切り替えて公開するときに true にする。
  indexable: false,

  // レポートサイトのURL。導入企業カードと「レポートを読む」のリンク先。
  // research.stormresearch.co.uk が使えるようになったら書き換える。
  reportsSite: 'https://storm-research-site.vercel.app',

  hubspot: {
    // HubSpotの「トラッキングコード」をそのまま貼る（Cookie同意バナーもこれで表示されます）。
    // HubSpot → 設定 → トラッキングとアナリティクス → トラッキングコード
    trackingCode: ``,

    // HubSpotのフォームの「埋め込みコード」をそのまま貼る。
    // 空のあいだは試作と同じ見本のフォームが表示されます（送信はされません）。
    forms: {
      research: ``, // 無料登録（/research/ の下部）
      corporate: ``, // 無料相談（/corporate/ の下部）
      contact: ``, // お問い合わせ（/contact/）
      careers: ``, // 採用応募（/careers/ の下部）。今のHubSpotのフォームをそのまま
    },
  },
};

export type Lang = 'en' | 'ja';
export type FormName = keyof typeof SITE.hubspot.forms;

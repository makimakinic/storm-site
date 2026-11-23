// 構造化データ（検索エンジン・AI向けの会社情報）。試作の内容をそのまま使っています。
// FAQPage は各ページに表示されている質問から自動で作られます（src/lib/localize.ts）。
export const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Storm Research Ltd",
  "alternateName": [
    "Storm Research",
    "ストーム・リサーチ"
  ],
  "url": "https://stormresearch.co.uk/",
  "email": "info@stormresearch.co.uk",
  "telephone": "+44 121 815 9426",
  "foundingDate": "2009-07",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Burton upon Trent",
    "addressCountry": "GB"
  },
  "sameAs": [
    "https://www.linkedin.com/company/storm-research-ltd/",
    "https://twitter.com/Storm_Research"
  ],
  "identifier": "UK Companies House 06952562",
  "slogan": "All about ideas",
  "description": "UK-based, FCA-regulated specialist in Japanese equities: independent research on Japanese small and mid caps for institutional investors (Storm Research) and overseas investor relations support for Japanese listed companies (Storm Corporate).",
  "founder": [
    {
      "@type": "Person",
      "name": "Rhiannon Ewart-White",
      "jobTitle": "Managing Director / Senior Analyst"
    }
  ],
  "brand": [
    {
      "@type": "Brand",
      "name": "Storm Research",
      "slogan": "All about ideas"
    },
    {
      "@type": "Brand",
      "name": "Storm Corporate",
      "slogan": "All about engagement"
    }
  ],
  "areaServed": "Worldwide",
  "knowsAbout": [
    "Japanese equities",
    "Japanese small and mid cap stocks",
    "Equity research",
    "Investor relations",
    "Sponsored research",
    "Investor roadshows"
  ]
};

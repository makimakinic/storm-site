// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 本番URL。プレビュー中もこのままでよい（検索エンジン対策は src/site.ts の indexable で切り替え）
export default defineConfig({
  site: 'https://stormresearch.co.uk',
  trailingSlash: 'always',
  // 改行・空白を試作と同じに保つ（詰めると、文字のあいだのすき間が変わることがある）
  compressHTML: false,
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', ja: 'ja' } },
    }),
  ],
});

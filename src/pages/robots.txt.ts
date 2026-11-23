// robots.txt。プレビュー中（indexable: false）は各ページの noindex で検索結果に出ないようにしているので、
// クロール自体は許可しておく（noindex を読んでもらうため）。公開後は sitemap も知らせる。
import type { APIRoute } from 'astro';
import { SITE } from '../site';

export const GET: APIRoute = () => {
  const lines = ['User-agent: *', 'Allow: /'];
  if (SITE.indexable) lines.push('', `Sitemap: ${SITE.url}/sitemap-index.xml`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

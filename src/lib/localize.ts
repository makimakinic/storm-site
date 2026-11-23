// Page text is written side by side in both languages, as in the prototype:
//   <span class="en">…</span><span class="ja">…</span>
// This turns that bilingual markup into a single-language page:
//  - removes every element marked with the other language (class "en" or "ja")
//  - on Japanese pages, adds /ja to internal links (/research/ -> /ja/research/)
//    Links that carry an hreflang attribute (the EN / JP switch) are left alone.
//  - collects the FAQ (.faq details) so the layout can output FAQPage structured data
//    that matches the visible questions exactly.
import { load } from 'cheerio';
import type { Lang } from '../site';

export interface FaqItem {
  q: string;
  a: string;
}

export function localize(html: string, lang: Lang): { html: string; faq: FaqItem[] } {
  const $ = load(html, null, false);
  const other = lang === 'en' ? 'ja' : 'en';
  $('.' + other).remove();

  if (lang === 'ja') {
    $('a[href^="/"]').each((_, el) => {
      const a = $(el);
      if (a.attr('hreflang')) return;
      const href = a.attr('href')!;
      if (href.startsWith('/ja/') || href.startsWith('/assets/')) return;
      a.attr('href', '/ja' + href);
    });
  }

  const clean = (t: string) => t.replace(/\s+/g, ' ').trim();
  const faq = $('.faq details')
    .map((_, d) => ({
      q: clean($(d).children('summary').text()),
      a: clean($(d).children(':not(summary)').text()),
    }))
    .get();

  return { html: $.html(), faq };
}

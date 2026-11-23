// ページの一覧と、ページごとの <title>・説明文（検索結果やSNSで表示される文）。
// 本文は src/views/ の各ファイルにあります。
import Home from '../views/Home.astro';
import Research from '../views/Research.astro';
import Corporate from '../views/Corporate.astro';
import Coverage from '../views/Coverage.astro';
import About from '../views/About.astro';
import Careers from '../views/Careers.astro';
import Contact from '../views/Contact.astro';

type Text = { en: string; ja: string };

export interface PageDef {
  key: string;
  slug: string; // URL（英語版）。'' はトップページ
  view: any;
  title: Text;
  description: Text;
  ogImage: string;
}

export const PAGES: PageDef[] = [
  {
    key: 'home',
    slug: '',
    view: Home,
    title: {
      en: 'Storm Research | Japanese equity research and overseas IR',
      ja: 'ストーム・リサーチ｜日本株リサーチと海外IR支援',
    },
    description: {
      en: 'Storm Research is a UK-based, FCA-regulated specialist in Japanese small and mid cap equities: independent research for institutional investors, and overseas IR support for Japanese listed companies through Storm Corporate.',
      ja: 'ストーム・リサーチは、英国金融行為規制機構（FCA）の認可・規制を受ける日本中小型株の専門会社です。海外機関投資家向けの独自リサーチと、ストーム・コーポレートによる日本の上場企業向けの海外IR支援を提供しています。',
    },
    ogImage: '/assets/bamboo.jpg',
  },
  {
    key: 'research',
    slug: 'research',
    view: Research,
    title: {
      en: 'Storm Research | High-conviction ideas in Japanese small and mid caps',
      ja: 'ストーム・リサーチ｜海外機関投資家向け日本中小型株リサーチ',
    },
    description: {
      en: 'High-conviction ideas in under-researched Japanese equities. Since 2009 we have served institutional investors worldwide with detailed research on Japanese small and mid caps, and the access to act on it.',
      ja: 'カバレッジの薄い日本株から、確信度の高いアイデアを。2009年以来、海外機関投資家の皆様に、日本の中小型株に関する詳細なリサーチと、それを投資判断に活かすための企業アクセスを提供してきました。',
    },
    ogImage: '/assets/bamboo.jpg',
  },
  {
    key: 'corporate',
    slug: 'corporate',
    view: Corporate,
    title: {
      en: 'Storm Corporate | Overseas IR for Japanese listed companies',
      ja: 'ストーム・コーポレート｜日本の上場企業向け海外IR支援',
    },
    description: {
      en: "Don't wait to be found. Storm Corporate brings Japanese listed companies' stories to overseas investors through English research distribution, 1-on-1 meetings and roadshows.",
      ja: '待つIRから、届けるIRへ。英文レポートの配信、1on1ミーティング、海外ロードショーを通じて、日本の上場企業のストーリーを海外機関投資家へ届けます。',
    },
    ogImage: '/assets/pagoda.jpg',
  },
  {
    key: 'coverage',
    slug: 'coverage',
    view: Coverage,
    title: {
      en: 'Coverage | Storm Research',
      ja: 'カバレッジ｜ストーム・リサーチ',
    },
    description: {
      en: 'Two kinds of coverage: sponsored research on Storm Corporate clients, free to read, and the independent research Storm Research has published since 2009.',
      ja: '誰でも読めるストーム・コーポレートのスポンサードレポートと、2009年以来ストーム・リサーチが発行してきた独自リサーチの企業一覧です。',
    },
    ogImage: '/assets/bamboo.jpg',
  },
  {
    key: 'about',
    slug: 'about',
    view: About,
    title: {
      en: 'About us | Storm Research',
      ja: '会社紹介｜ストーム・リサーチ',
    },
    description: {
      en: 'Storm Research Ltd is a UK-based, FCA-regulated specialist in Japanese equities, founded in 2009, running Storm Research and Storm Corporate.',
      ja: 'Storm Research Ltd（ストーム・リサーチ）は、2009年に英国で設立された、英国金融行為規制機構（FCA）の認可を受けた日本株の専門会社です。',
    },
    ogImage: '/assets/bamboo.jpg',
  },
  {
    key: 'careers',
    slug: 'careers',
    view: Careers,
    title: {
      en: 'Careers | Storm Research',
      ja: '採用情報｜ストーム・リサーチ',
    },
    description: {
      en: 'Storm Research is looking for capable, hardworking bilingual Japanese and English speakers to join our team in Burton upon Trent.',
      ja: 'ストーム・リサーチは、日本語と英語のバイリンガルで、意欲を持って取り組める方を募集しています。勤務地はバートン・アポン・トレントです。',
    },
    ogImage: '/assets/bamboo.jpg',
  },
  {
    key: 'contact',
    slug: 'contact',
    view: Contact,
    title: {
      en: 'Contact us | Storm Research',
      ja: 'お問い合わせ｜ストーム・リサーチ',
    },
    description: {
      en: 'Contact Storm Research. Investors and companies are both welcome.',
      ja: 'ストーム・リサーチへのお問い合わせ。投資家の方も企業の方もお気軽にどうぞ。',
    },
    ogImage: '/assets/bamboo.jpg',
  },
];

export const pathFor = (slug: string, lang: 'en' | 'ja') =>
  (lang === 'ja' ? '/ja' : '') + (slug ? `/${slug}/` : '/');

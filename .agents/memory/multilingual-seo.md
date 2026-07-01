---
name: Multilingual SEO Structure
description: LulDown 10-language × 5-page SEO setup — routes, translation keys, hreflang, sitemap.
---

## What was built
- **51 total pages**: 10 langs × 5 page types (home/mp3/story/thumbnail/viewer) + `/ssstik-alternative`
- All translations in `src/i18n/translations.ts` (T object, 10 langs × 5 pages)
- Lang config/helpers in `src/i18n/langMeta.ts` (LANG_META, buildPageUrl, buildHreflangUrls, getLangFromPath, getPageKeyFromSlug)
- Generic page template: `src/components/LangPage.tsx`
- Thin wrappers: Mp3Page / StoryPage / ThumbnailPage / ViewerPage / LangHomePage (all in src/pages/)
- `src/pages/SsstikAltPage.tsx` — English-only comparison table (LulDown vs ssstik)

## URL structure
- English: `/`, `/mp3`, `/story`, `/thumbnail`, `/viewer`
- Other langs: `/{lang}`, `/{lang}/mp3`, etc. (prefix pattern)
- Routes in App.tsx: specific lang/page routes before `/:lang` catch-all

## Key decisions
- RTL support: `dir={meta.dir}` on LangPage wrapper div — Arabic + Urdu are RTL
- hreflang injected via useEffect DOM manipulation (no SSR), cleaned up on unmount
- CSS class `.features-grid-4` in index.css: 4-col → 2-col at 700px → 1-col at 380px
- LangPage imports DownloaderBox directly (real functionality on every page)
- Navbar language switcher preserves page type when switching language

**Why:** SEO requires unique meta/canonical/hreflang per page; DOM injection works for SPA.

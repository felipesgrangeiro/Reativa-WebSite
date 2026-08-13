---
name: seo
description: >-
  Audits and implements on-page SEO for landing pages (titles, meta, headings,
  OG/Twitter, semantic HTML, internal links, performance signals). Use when the
  user asks for SEO, meta tags, Open Graph, headings hierarchy, or to improve
  search visibility of the LP/site.
---

# SEO (Landing Page)

## When to apply

User mentions SEO, meta, title, description, Open Graph, ranking, or “otimizar para busca”.

## Workflow

1. Inspect current `metadata` / `<head>` in `app/layout.tsx` and page-level exports.
2. Audit the page against the checklist below.
3. Implement only the gaps (do not invent fake reviews, ratings, or keywords stuffing).
4. Prefer Next.js App Router `metadata` / `generateMetadata` over raw `<head>` tags.
5. Keep brand voice; never overpower the brand name in the title.

## Checklist

- [ ] Unique `<title>` (~50–60 chars) with brand + primary intent
- [ ] Meta description (~140–160 chars), benefit-led, no keyword spam
- [ ] One clear `h1`; logical `h2`/`h3` outline matching visible sections
- [ ] Canonical URL for the public domain (LP: `https://lp.reativamais.com` when that is the public URL)
- [ ] Open Graph + Twitter cards (title, description, image absolute HTTPS URL)
- [ ] Meaningful `alt` on content images; decorative images `alt=""`
- [ ] Internal links use descriptive anchors (not “clique aqui”)
- [ ] Account/legal links point to production app URLs when LP is a separate host
- [ ] No duplicate thin pages; 404/not-found is sensible
- [ ] `lang` on `<html>` matches content (`pt-BR` for Reativa)

## Output format

When auditing, report:

```markdown
## SEO audit
- Critical: ...
- Should fix: ...
- Nice to have: ...

## Changes made / proposed
- file → what
```

## Out of scope

- Google Search Console verification and sitemap XML → use skill `seo-google-sitemaps`
- Legal copyright notices → use skill `copyright`
- Headers / XSS / CSP → use skill `lp-security`

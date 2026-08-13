---
name: seo-google-sitemaps
description: >-
  Implements Google-oriented SEO plumbing for Next.js: robots.txt, XML sitemap,
  canonical domain, Search Console readiness, and indexation hygiene. Use when
  the user asks for sitemap, robots.txt, Google Search Console, indexação,
  Google SEO, or to submit URLs to Google.
---

# SEO Google + Sitemaps

## When to apply

User asks for sitemap, `robots.txt`, Search Console, indexação no Google, or “SEO Google”.

## Defaults for this project

- Public LP URL: `https://lp.reativamais.com`
- App/account URLs stay on `https://www.reativamais.com` (do not put app-only routes in the LP sitemap unless they are public marketing pages)
- Stack: Next.js App Router

## Workflow

1. Confirm the **canonical public host** with the user if unclear (LP vs www).
2. Add App Router sitemap + robots using Next conventions:
   - `app/sitemap.ts` → serves `/sitemap.xml`
   - `app/robots.ts` → serves `/robots.txt`
3. Include only indexable public URLs (home + public marketing routes that exist).
4. Point `robots.txt` `Sitemap:` to the absolute sitemap URL on the same host.
5. After deploy, verify:
   - `https://lp.reativamais.com/sitemap.xml`
   - `https://lp.reativamais.com/robots.txt`
6. Tell the user the Search Console steps (agent cannot complete GSC login for them unless credentials/browser access are provided).

## Implementation pattern (Next.js)

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE = "https://lp.reativamais.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

const BASE = "https://lp.reativamais.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Disallow previews / private paths if they exist on this host
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
```

## Google checklist

- [ ] Canonical host consistent (avoid indexing both `www` and `lp` for the same page unless intentional)
- [ ] Sitemap lists only 200 URLs that should be indexed
- [ ] No `noindex` on pages meant to rank
- [ ] OG image absolute URL works over HTTPS
- [ ] After deploy: submit sitemap in Google Search Console → Sitemaps
- [ ] Optional: request indexing for the homepage URL inspection

## Do not

- Stuff the sitemap with anchors (`#section`) — Google ignores fragment URLs as separate pages
- Add `/login`, `/cadastro`, or authenticated app routes to the LP sitemap
- Block CSS/JS in `robots.txt`

## Output format

```markdown
## Google SEO / sitemap
- Host canônico: ...
- Arquivos: app/sitemap.ts, app/robots.ts
- URLs no sitemap: ...
- Próximo passo humano: Search Console → adicionar propriedade → enviar sitemap
```

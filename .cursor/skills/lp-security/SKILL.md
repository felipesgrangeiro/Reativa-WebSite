---
name: lp-security
description: >-
  Hardens landing-page security for Next.js on Vercel/Cloudflare: headers, XSS,
  open redirects, dependency hygiene, secrets, and form/link safety. Use when
  the user asks for segurança da LP, security headers, CSP, XSS, or to harden
  the marketing site.
---

# Segurança na LP

## When to apply

User asks for segurança da LP, harden, headers, CSP, XSS, or security review of the landing page.

## Scope

Public marketing LP (mostly static/SSR). Not a substitute for full app auth security on `www.reativamais.com`.

## Workflow

1. Inventory surfaces: external links, forms, scripts, env vars, headers (`next.config`, middleware, Vercel/Cloudflare).
2. Apply the checklist; fix critical issues first.
3. Prefer platform headers (Next `headers()` in `next.config` / middleware) over ad-hoc meta tags.
4. Do not weaken HTTPS or re-enable Cloudflare “Flexible” SSL for domains in front of Vercel.

## Checklist

### Transport & hosting
- [ ] HTTPS only; HSTS present (Vercel often sets `strict-transport-security`)
- [ ] Custom domain DNS for Vercel: Cloudflare record **DNS only** (grey cloud) unless proxy is intentionally configured with Full/Strict
- [ ] No secrets in client bundles or public repo (`.env*` gitignored)

### Headers (add via Next config when missing)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` (or stricter)
- [ ] `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'` (clickjacking)
- [ ] `Permissions-Policy` locking camera/mic/geolocation if unused
- [ ] CSP: start report-only if unsure; avoid `unsafe-inline` when possible

### Content / XSS
- [ ] No `dangerouslySetInnerHTML` with unsanitized user/CMS input
- [ ] External links `rel="noopener noreferrer"` when `target="_blank"`
- [ ] User-controlled URLs never used as open redirects

### Dependencies & supply chain
- [ ] Avoid adding analytics/pixels without reviewing third-party scripts
- [ ] Run `npm audit` for high issues when changing deps; don’t force-break the app blindly

### Privacy / compliance adjacent
- [ ] Cookie/marketing scripts only with a clear consent path if non-essential
- [ ] Legal links to live Termos/Privacidade on the app domain

## Next.js headers sketch

```ts
// next.config.ts — headers()
{
  source: "/:path*",
  headers: [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
  ],
}
```

## Output format

```markdown
## LP security
- Critical: ...
- Should fix: ...
- Hardening applied: ...
- Residual risk / needs human (Cloudflare/Vercel dashboard): ...
```

## Out of scope

- Full penetration test / exploit PoCs
- App auth, RLS, or backend secrets on the main product (unless the user expands scope)

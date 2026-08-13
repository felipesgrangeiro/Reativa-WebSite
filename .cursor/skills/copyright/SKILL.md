---
name: copyright
description: >-
  Handles copyright notices, content ownership, attribution, and legal footer
  links for the Reativa landing page. Use for direitos autorais, atribuição, or
  legal notices — NOT for sales copy (use skill copywriting).
---

# Copyright

## When to apply

User mentions copyright, direitos autorais, atribuição, notice legal, or footer legal text.

## Project defaults

- Brand: **Reativa+** / Reativa Mais
- Prefer linking legal pages on the production app host:
  - Termos: `https://www.reativamais.com/termos`
  - Privacidade: `https://www.reativamais.com/privacidade`
- Constants live in `components/site/site-links.ts` (`TERMOS_URL`, `PRIVACIDADE_URL`)

## Workflow

1. Find existing notice (footer year, “Todos os direitos reservados”, terms links).
2. Keep a single source of truth for legal URLs (`site-links.ts`).
3. Update year dynamically when adding/editing footer copy (`new Date().getFullYear()` already used where applicable).
4. Do not invent legal text that contradicts the live Termos/Privacidade pages.
5. For third-party assets (fonts, photos, icons): note license requirements; do not claim ownership of third-party work.

## Checklist

- [ ] Footer has copyright line with brand + year
- [ ] Termos and Privacidade links are absolute production URLs when LP ≠ app host
- [ ] No copied competitor copy presented as original
- [ ] Stock/AI imagery: confirm project may use it; add attribution only if license requires
- [ ] Do not paste full contract text into the LP if canonical pages already exist on www

## Safe default footer line (PT)

`© {year} Reativa+. Todos os direitos reservados.`

## Agent limits

- This skill guides implementation and consistency; it is **not** legal advice.
- For material contract changes, flag that a lawyer should review.

## Output format

```markdown
## Copyright
- Notices updated: ...
- Legal links: ...
- Open questions / legal review needed: ...
```

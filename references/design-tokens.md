# Design tokens: what each one does in the browser

This page explains the effect of every `designSystem` key on a Template Design System v2 store. The list of allowed keys and values is `contract/design-system.schema.json`; `SKILL.md` Phase 2 has the same list as a table. If this page and the contract disagree, the contract is right.

Source in `budstack-saas/nextjs_space`: `lib/theme/tenant-theme-vars-v2.ts` (the CSS variables), `lib/theme/tenant-scoped-css-v2.ts` (the rules that use them), `lib/theme/tenant-tokens.ts` (colour maths).

## How a token reaches the page

1. `defaults.json` → `designSystem` is copied into the store when a store is created from the template.
2. On every page the platform turns it into CSS variables (`--tenant-*`) set inline on the theme container, `.tenant-theme-container[data-ds="2"]`.
3. A fixed platform stylesheet applies those variables to elements by role. Sections mark their elements with `data-ui`: `section`, `header`, `eyebrow`, `heading`, `subtitle`, `card`, `media`, `button`.

A template never writes these rules. It sets tokens. An operator can change every token later in the Store Editor, and the page follows.

## Colours

`colors.*` are raw HSL channels: `"178 48% 21%"`. The platform wraps them itself: `hsl(var(--tenant-color-primary))`, and with alpha `hsl(var(--tenant-color-primary) / 0.08)`.

| Token | Becomes | Used for |
|---|---|---|
| `primary` | `--tenant-color-primary` | Primary buttons, links, icon tints, brand-filled bands |
| `secondary` | `--tenant-color-secondary` | The far end of brand gradients, secondary accents |
| `accent` | `--tenant-color-accent` | Small highlights; the eyebrow, when it is readable |
| `background` | `--tenant-color-background` | The page |
| `surface` | `--tenant-color-surface` | Cards and alternate sections. Unset: white on a light page, a slightly lifted shade on a dark one |
| `text` | `--tenant-color-text` | Body text |
| `heading` | `--tenant-color-heading` | Headings; also the shadow colour when `shadows.tint` is `brand` |
| `border` | `--tenant-color-border` | Card and divider lines. Unset: derived from surface and text |

Colours the platform computes, which you do not set:

| Variable | What it is |
|---|---|
| `--tenant-on-primary`, `--tenant-on-secondary`, `--tenant-on-accent` | Black or white, whichever reads on that colour. A primary button's label uses it, so a light brand colour gets a dark label |
| `--tenant-color-muted-foreground`, `--tenant-color-legal` | Secondary text and small print, softened from `text` but never below 4.5:1 |
| `--tenant-color-eyebrow` | The accent colour if it reaches 4.5:1 on the background, else the primary, else the text colour |

The storefront also corrects a palette that cannot be read: text or headings below 3:1 against the background are replaced by black or white. The validator is stricter (4.5:1) so that correction never has to happen.

### Per-section colours

`colorOverrides` on a section (or in `navigationConfig` / `footerConfig`) sets any of the eight colours above for that block only. The computed colours are recalculated for the block, so a white label on a dark band and a readable disclaimer on a dark footer come for free. FooterBrand and FooterFull are dark by default (`220 15% 10%`, white text) unless overridden.

A section whose own background is the primary colour or a primary gradient (CTABanner, Stats, StatsCounter, Newsletter, AboutFacilities) takes its text colour from `--tenant-on-primary`.

## Typography

| Token | Effect |
|---|---|
| `typography.fontFamily.body` | `--tenant-font-body` and `--tenant-font-base`: all body text, on the home page and on every store page |
| `typography.fontFamily.heading` | `--tenant-font-heading`: every `h1`–`h6` |
| `typography.fontFamily.accent` | `--tenant-font-accent`: available to `styles.css` for a few words; nothing uses it by default |
| `typography.fontSize.base` | Body size in px |
| `typography.fontSize.hero` | The `h1` size at 1280px and wider. Below that it shrinks in a straight line to 60% at 375px |
| `typography.fontSize.section` | The `h2` size at 1280px and wider, shrinking to 70% at 375px |
| `typography.fontWeight.body`, `.heading` | Body and heading weights |
| `typography.letterSpacing` | Body letter-spacing: tight −0.025em, normal 0, wide 0.025em, wider 0.05em |
| `typography.heading.letterSpacing` | `h1`–`h3`: tight −0.02em, normal 0, wide 0.04em. Unset: each section keeps its own |
| `typography.heading.transform` | `h1`–`h3`: `uppercase` or `none`. Unset: each section keeps its own |
| `typography.heading.lineHeight` | `h1` and `h2`: tight 1.05, snug 1.15, normal 1.3. Unset: 1.05 for `h1`, 1.12 for `h2` |

With the defaults (60 and 40) an `h1` is 36px on a phone and 60px on a desktop; an `h2` is 28px and 40px. `h3`–`h6` are sized by each section. `h1`–`h3` wrap with balanced lines.

Fonts are not loaded by naming them. Either put every family in `layout.settings.googleFontsUrl`, or use the platform's catalogue font ids (listed in `contract/section-schemas.json` → `fontCatalog`) and set no URL, in which case the platform loads them.

## Shape and depth

`borderRadius.container` selects three radii:

| Value | Small | Cards | Framed images |
|---|---|---|---|
| `none` | 0 | 0 | 0 |
| `small` | 2px | 4px | 8px |
| `medium` | 6px | 10px | 16px |
| `large` | 10px | 16px | 24px |

`borderRadius.button`: `rounded` 0.5rem, `square` 0.25rem, `pill` fully round. It applies to every call-to-action button, in sections, nav and footer. Circular icon buttons stay circular.

`shadows.card` selects three elevations: a resting card, a hovered card, and a framed image. `none` removes all three; `soft`, `medium` and `bold` deepen them together. `shadows.tint: "brand"` colours the shadows with the heading colour instead of black, which suits a palette with a strong dark hue.

`button.size`: padding and font size of every call-to-action button (small 0.5rem × 1rem at 0.875rem; medium 0.75rem × 1.5rem at 1rem; large 1rem × 2rem at 1.125rem).

`buttonHoverEffect`: `lift` raises the button with a shadow, `glow` adds a primary-coloured halo, `scale` enlarges it, `pulse` fades it in and out.

`glassEffect`: `light` or `heavy` makes cards translucent with a backdrop blur, using the store's own surface colour, so it works on dark palettes too. Use it only when something interesting sits behind the cards.

## Spacing

A section's vertical padding is: base × `spacing.scale` × the section's density.

| | Phone | From 640px | From 1024px |
|---|---|---|---|
| Base | 4rem | 5.5rem | 7rem |

`spacing.scale`: compact 0.75, normal 1, comfortable 1.5. Density (`config.density` on a section): compact 0.6, normal 1, spacious 1.35. LogoMarquee, SocialProof, Stats and StatsCounter are compact unless told otherwise. Heroes, TextMarquee and ImageShowcase keep their own padding and take no density.

`layout.settings.sectionPadding` replaces the base for the whole page: one value (`"3rem"`) or three (`"3rem/4rem/5rem"` for phone, 640px, 1024px). Most templates should leave it out.

Section headers share one rhythm: an eyebrow sits 0.75rem above the heading, the subtitle 0.75rem below it, and the content 3rem below the header (4rem from 1024px). The subtitle is held to 60 characters per line.

## Motion

`animationType`: how each section enters as it scrolls into view (`fade-up`, `slide-right`, `zoom-in`, or `none`). `dividerStyle`: a shape drawn between sections (`wave`, `slant`, `curve`, or `none`). Both are store-wide; there are no per-section keys.

A visitor who has asked their system for reduced motion gets fades only: nothing slides, scales or scrolls by itself.

## What no longer needs CSS

A v1 template had to write CSS for most of the following. In v2 they are tokens, and a template that still writes this CSS is fighting the platform.

| You want | Set |
|---|---|
| Bigger or smaller headings | `typography.fontSize.hero` / `.section` |
| Uppercase or tightly tracked headings | `typography.heading.transform` / `.letterSpacing` |
| Rounder or squarer cards and images | `borderRadius.container` |
| Flat or deep shadows | `shadows.card`, `shadows.tint` |
| A tighter or airier section | `config.density` on the section |
| A dark or tinted section | `colorOverrides` on the section |
| A small label over a heading | `config.eyebrow` |
| Outlined or unboxed cards | `config.variant` (ValueProps, Features, Testimonials) |
| The fonts on product and checkout pages | Nothing: they follow `typography.fontFamily` |

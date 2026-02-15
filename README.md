# BudStack Template Creator

A Claude Code skill that generates unique, production-ready storefront templates for the BudStack cannabis SaaS platform.

Give it a brand name and vibe — it interviews you, designs a complete template, and outputs 4 data files ready to upload.

## Install

```bash
git clone https://github.com/Gerard161-Site/budstack-template-skill.git
cd budstack-template-skill
chmod +x install.sh
./install.sh
```

## Usage

In any Claude Code session:

```
/create-template GreenLeaf
```

The skill will:
1. **Interview you** — brand vibe, audience, colors, content density, special needs
2. **Design the template** — picks layout archetype, nav, footer, typography, color system
3. **Present the design brief** — you approve before any files are written
4. **Generate 4 files** — layout.json, defaults.json, styles.css, template.config.json
5. **Set up assets** — copies your brand images into the template's `assets/` directory
6. **Compare against existing templates** — ensures structural uniqueness

## What It Produces

```
your-brand/
  layout.json           # Section composition (which components, what order, configs)
  defaults.json         # Design system (colors, fonts, spacing) + default content
  styles.css            # Scoped CSS with variables, animations, dark/light treatments
  template.config.json  # Marketplace metadata
  assets/               # Hero images, section backgrounds, gallery photos
    hero.jpg
    lab-scene.jpg
    ...
```

**No React code.** Templates are pure data. The BudStack platform renders them using 22 pre-built section components.

## Available Components

| Heroes | Content | CTAs | Navigation | Footers |
|--------|---------|------|------------|---------|
| HeroFullScreen | ValueProps | CTABanner | NavDark | FooterBrand |
| HeroSplit | ProductShowcase | CTAWithImage | NavTransparent | FooterFull |
| HeroVideo | Testimonials | CTASplit | NavFull | FooterSimple |
| HeroMinimal | About | | NavMinimal | |
| | Features | | | |
| | Stats | | | |
| | FAQ | | | |
| | Gallery | | | |
| | BlogFeed | | | |
| | ImageShowcase | | | |

## 12 Layout Archetypes

The skill knows 12 distinct page compositions and mixes them for variety:

1. **The Authority** — Medical/professional (HeroSplit + About + Features + CTASplit)
2. **The Cinematic** — Premium/luxury (HeroVideo + ImageShowcase + BlogFeed)
3. **The Minimalist** — Clean/editorial (HeroMinimal + ValueProps + CTABanner)
4. **The Storyteller** — Brand-forward (HeroFullScreen + About + Testimonials + CTAWithImage)
5. **The Marketplace** — E-commerce (HeroFullScreen + ProductShowcase + Stats + Testimonials)
6. **The Rebel** — Street culture/bold (HeroFullScreen + Stats + Features + Gallery)
7. **The Wellness Retreat** — Organic/natural (HeroFullScreen + ValueProps + About + FAQ)
8. **The Tech Forward** — Modern/digital (HeroSplit + Features + Stats + BlogFeed)
9. **The Gallery First** — Visual/lifestyle (HeroFullScreen + Gallery + About)
10. **The Converter** — Consultation funnel (HeroFullScreen + CTASplit + ValueProps + FAQ)
11. **The Magazine** — Content-rich (HeroMinimal + BlogFeed + Features)
12. **The Showcase** — Product/facility (HeroVideo + ImageShowcase + Stats + ProductShowcase)

## Key Rules

- All colors in raw HSL format: `"155 70% 35%"` (never hex, never `hsl()` wrapper)
- CSS scoped under `.template-{slug}` class
- Google Fonts URL in both layout.json and styles.css
- Dark sections need CSS variable overrides for heading/text colors
- Templates must include images in `assets/` — no blank placeholders
- Each template must be structurally different from existing ones

## Reference Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Complete skill instructions (the brain) |
| `references/component-catalog.md` | All 22 section components with config tables |
| `references/layout-archetypes.md` | 12 page composition patterns |
| `references/typography.md` | 20 curated Google Font pairings |
| `references/color-theory.md` | HSL color system, mood palettes, scale generation |
| `scripts/helpers.ts` | Color conversion utilities (HEX/HSL/RGB) |

## After Generating

1. Init git repo in the template directory
2. Push to GitHub
3. Upload via BudStack super admin → Templates → Upload from GitHub
4. Preview at `/store/preview/{slug}`
5. Tenants can clone and customize via their admin panel

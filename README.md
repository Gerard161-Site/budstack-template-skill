# BudStack Template Creator

Generate production-ready BudStack store templates using the data-driven section system. Templates are pure data (JSON + CSS) — the platform's section registry handles all rendering.

## What This Skill Does

A designer describes a vibe → the agent interviews them → generates 4 data files → pushes to a GitHub repo → template is uploaded to BudStack → tenants can clone and customize.

**No React code is generated.** Templates are entirely data-driven.

## Contents

```
budstack-template-skill/
├── SKILL.md              # Complete agent instructions (the main doc)
├── helpers.ts            # Color conversion and generation utilities
├── README.md             # This file
└── base-template/        # Reference starter files
    ├── layout.json       # Section composition template
    ├── defaults.json     # Design system + content template
    ├── template.config.json  # Marketplace metadata template
    └── styles.css        # CSS template with variables
```

## Quick Start

### For Claude / AI Agents

When a user asks to create a template:

1. Read `SKILL.md` — it contains the complete 10-step workflow
2. Interview the designer (name, mood, colors, sections)
3. Generate all 4 files using the base-template as structural reference
4. Use `helpers.ts` functions for color conversion (HEX → HSL → RGB)
5. Output to `/Users/gkavanagh/Development/HealingBuds/templates/{slug}-template/`
6. Initialize git repo and push to GitHub

### For Humans

Read `SKILL.md` for the full process. The TL;DR:

1. Pick sections from the registry (21 available components)
2. Define colors in raw HSL format (e.g., `"275 70% 55%"`)
3. Write `layout.json` (section order), `defaults.json` (design system + content), `template.config.json` (metadata), `styles.css` (custom styling)
4. Push to GitHub, upload via Super Admin

## Template Architecture

Templates use BudStack's **data-driven rendering pipeline**:

```
layout.json → TemplateRenderer → Section Registry → React Components
defaults.json → Design tokens + content fallbacks
styles.css → Scoped CSS with :root variables
```

The platform provides 21 pre-built section components (heroes, content blocks, CTAs, navigation, footers). Templates simply compose them via `layout.json` and style them via CSS variables.

## Key Rules

1. **All colors must be raw HSL**: `"275 70% 55%"` (never hex, never `hsl()` wrapped)
2. **No React code**: Templates are data files only
3. **Section types are case-sensitive**: `HeroFullScreen` not `herofullscreen`
4. **CSS scoping**: All styles under `.template-{slug}` class
5. **Google Fonts URL**: Must appear in both `layout.json` and `styles.css`

## Available Sections

| Heroes | Content | CTAs | Nav | Footers |
|--------|---------|------|-----|---------|
| HeroFullScreen | ValueProps | CTABanner | NavMinimal | FooterSimple |
| HeroSplit | ProductShowcase | CTAWithImage | NavFull | FooterFull |
| HeroVideo | Testimonials | CTASplit | NavTransparent | |
| HeroMinimal | About, Gallery | | | |
| | Stats, FAQ | | | |
| | BlogFeed, Features | | | |

## Output Structure

```
{slug}-template/
├── layout.json
├── defaults.json
├── template.config.json
├── styles.css
├── hero.jpg          (optional default hero image)
└── README.md
```

## Reference

- **Full documentation**: `SKILL.md`
- **Helper functions**: `helpers.ts`
- **Production example**: `../cannabizz-template/` (first template built on this system)
- **Platform codebase**: `../../budstack-saas/nextjs_space/`

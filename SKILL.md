# BudStack Template Creator — Agent Skill

Generate production-ready BudStack store templates using the **data-driven section system**. Templates are pure data (JSON + CSS) — NO React code. The platform's section registry renders everything.

## How It Works

```
Designer describes a vibe
  → Agent asks questions (name, colors, mood, sections)
  → Agent generates 4 data files + optional hero image
  → Files pushed to GitHub repo
  → Super Admin uploads via Template Management
  → Tenants clone, customize via /tenant-admin/branding
```

**Output**: A Git repo containing exactly these files:

```
{slug}-template/
├── layout.json              # Section composition (what renders, in what order)
├── defaults.json            # Design system + content (colors, fonts, copy, nav, footer)
├── template.config.json     # Marketplace metadata (name, tags, description)
├── styles.css               # Custom CSS (:root vars, scoped styles, animations)
├── hero.jpg                 # (optional) Default hero image
└── README.md                # Template documentation
```

**NO index.tsx. NO components/. NO React.** The platform renders sections from its own registry.

---

## Architecture: Data-Driven Templates

### The Rendering Pipeline

```
layout.json (S3)
  → TemplateRenderer reads sections[]
  → Each section.type → getSectionComponent() from section-registry
  → Component receives unified SectionProps (tenant, designSystem, pageContent, etc.)
  → styles.css injected as scoped CSS
  → defaults.json provides fallback content + design tokens
  → TenantThemeProvider applies designSystem as CSS variables
```

### Available Section Components

Pick from these in `layout.json → sections[]`. Each renders a full responsive section.

| Category | Component Name | Description |
|----------|---------------|-------------|
| **Heroes** | `HeroFullScreen` | Full-viewport hero with background image, gradient overlay, title/subtitle/CTA |
| | `HeroSplit` | Side-by-side hero — image left, content right (or vice versa) |
| | `HeroVideo` | Video background hero with overlay content |
| | `HeroMinimal` | Clean, text-focused hero with subtle accent |
| **Content** | `ValueProps` | 4-card grid of value propositions (icon + title + description) |
| | `ProductShowcase` | Featured products grid pulled from tenant's catalog |
| | `Testimonials` | Customer testimonial cards with ratings |
| | `About` | Brand story section with mission statement |
| | `Gallery` | Image gallery grid |
| | `Stats` | Animated stat counters (e.g., "500+ Products", "10K+ Customers") |
| | `FAQ` | Accordion-style FAQ section |
| | `BlogFeed` | Latest 3 blog posts from tenant's blog |
| | `Features` | Multi-item feature grid with icons |
| **CTAs** | `CTABanner` | Full-width call-to-action banner |
| | `CTAWithImage` | CTA section with side image |
| | `CTASplit` | Split-layout CTA |
| **Navigation** | `NavMinimal` | Clean, minimal nav bar |
| | `NavFull` | Full navigation with logo, links, and CTA button |
| | `NavTransparent` | Transparent nav that overlays hero |
| **Footers** | `FooterSimple` | Minimal footer with copyright |
| | `FooterFull` | Multi-column footer with link sections and disclaimer |

### Section Props (What Every Section Receives)

Every section component receives the same `SectionProps` object:

```typescript
{
  tenant: {
    businessName: string;
    subdomain: string;
    tagline?: string;
    industry?: string;
    // ... all tenant fields
  };
  consultationUrl: string;   // "/store/{subdomain}/consultation"
  productsUrl: string;        // "/store/{subdomain}/products"
  contactUrl: string;         // "/store/{subdomain}/contact"
  aboutUrl: string;           // "/store/{subdomain}/about"
  heroImageUrl?: string;      // Signed S3 URL (from hero.jpg or user upload)
  logoUrl?: string;           // Signed S3 URL
  designSystem?: object;      // From defaults.json → merged with tenant overrides
  pageContent?: object;       // From defaults.json → merged with tenant overrides
  navigation?: object;        // Nav links and CTA
  footer?: object;            // Footer links, copyright, disclaimer
  valueProps?: Array<{title, description, icon}>;
  posts?: Array;              // Latest blog posts (for BlogFeed)
  sectionConfig?: object;     // Per-section config from layout.json
}
```

---

## Step-by-Step Workflow

### Step 1: Interview the Designer

Ask these questions (present as choices where possible):

1. **Template name** — What should this template be called?
   - Example: "Zen Garden", "Urban Leaf", "Cloud Nine"
   - Will generate slug automatically: "zen-garden", "urban-leaf", "cloud-nine"

2. **Mood & Style** — Pick one or describe your own:
   - Clean & Professional (light backgrounds, crisp typography)
   - Bold & Energetic (saturated colors, strong contrast)
   - Organic & Natural (earth tones, soft curves)
   - Luxurious & Premium (dark backgrounds, gold/metallic accents)
   - Playful & Young (neon colors, dark theme, fun copy)
   - Dark & Moody (deep backgrounds, dramatic lighting)
   - Custom (describe freely)

3. **Target audience** — Who is this store for?
   - Medical patients (professional, trustworthy)
   - Recreational consumers (fun, accessible)
   - Wellness seekers (calming, natural)
   - Premium buyers (luxury, exclusive)
   - Young adults (trendy, social)

4. **Primary brand color** — Provide a HEX color or describe (e.g., "forest green", "electric purple")

5. **Content density** — How many sections on the home page?
   - Minimal (3-4 sections): Hero + About + CTA
   - Standard (5-6 sections): Hero + ValueProps + About + Features + CTA
   - Rich (7+ sections): Hero + ValueProps + About + Features + Stats + FAQ + CTA

6. **Section picks** — Based on density, confirm:
   - Hero style: `HeroFullScreen` / `HeroSplit` / `HeroVideo` / `HeroMinimal`
   - Body sections: Select from content list above
   - CTA style: `CTABanner` / `CTAWithImage` / `CTASplit`
   - Navigation: `NavFull` / `NavMinimal` / `NavTransparent`
   - Footer: `FooterFull` / `FooterSimple`

7. **Cultural feel** (optional) — Any specific vibe?
   - Street/urban, clinical/medical, spa/wellness, farm-to-table, tech/modern

### Step 2: Generate Colors

Convert the primary brand color to HSL and build a full palette.

**CRITICAL COLOR FORMAT**: All colors MUST be raw HSL channels. NO wrappers.
```
CORRECT:  "275 70% 55%"
WRONG:    "hsl(275, 70%, 55%)"
WRONG:    "#A333E6"
```

**Color Generation Rules**:

From the primary color (HEX → HSL):

```
Primary:    {H} {S}% {L}%              (the brand color)
Secondary:  {H+30} {S-15}% {L}%        (complementary shift)
Accent:     {H-20} {S+10}% {L+10}%     (pop color)
```

For light themes:
```
Background: {H} 5% 97%
Surface:    {H} 8% 99%
Text:       {H} 15% 12%
Heading:    {H} 20% 8%
Border:     {H} 10% 90%
```

For dark themes:
```
Background: {H} 15% 8%
Surface:    {H} 12% 12%
Text:       {H} 10% 80%
Heading:    0 0% 100%
Border:     {H} 15% 22%
```

Generate full color scales (50-900) for the primary color:
```
50:  {H} {S}% 97%
100: {H} {S}% 92%
200: {H} {S}% 82%
300: {H} {S}% 72%
400: {H} {S}% 66%
500: {H} {S}% {L}%    ← base
600: {H} {S}% {L-10}%
700: {H} {S}% {L-20}%
800: {H} {S}% {L-30}%
900: {H} {S}% {L-40}%
```

Generate shadows using RGB conversion of primary:
```
theme-sm:  0 2px 8px rgba(R, G, B, 0.08)
theme-md:  0 4px 16px rgba(R, G, B, 0.12)
theme-lg:  0 8px 32px rgba(R, G, B, 0.16)
theme-xl:  0 12px 48px rgba(R, G, B, 0.20)
theme-2xl: 0 20px 64px rgba(R, G, B, 0.24)
```

### Step 3: Choose Fonts

Pick a Google Fonts pairing that matches the mood. Load via `googleFontsUrl` in layout.json settings.

**Recommended Pairings**:

| Mood | Heading Font | Body Font | Google Fonts URL |
|------|-------------|-----------|-----------------|
| Clean/Professional | Inter | Inter | `...family=Inter:wght@400;500;600;700;800&display=swap` |
| Bold/Modern | Space Grotesk | DM Sans | `...family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap` |
| Organic/Natural | Lora | Source Serif 4 | `...family=Lora:wght@400;500;600;700&family=Source+Serif+4:wght@400;600&display=swap` |
| Luxury/Premium | Cormorant Garamond | Lato | `...family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@400;700&display=swap` |
| Playful/Young | Outfit | Nunito | `...family=Outfit:wght@400;500;600;700;800&family=Nunito:wght@400;600;700&display=swap` |
| Dark/Moody | Bebas Neue | Inter | `...family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap` |
| Modern/Geometric | Sora | Inter | `...family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap` |
| Elegant/Serif | Playfair Display | Roboto | `...family=Playfair+Display:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap` |

**IMPORTANT**: The branding form dropdown supports these font IDs: `inter`, `roboto`, `lato`, `montserrat`, `poppins`, `playfair`, `outfit`, `nunito`. If your heading or body font isn't in this list, the branding form will still work — it maps CSS font-family strings to IDs automatically. But sticking to these fonts gives the best user experience.

### Step 4: Write layout.json

This defines WHAT renders and in WHAT ORDER.

```json
{
  "version": "1.0.0",
  "navigation": "NavFull",
  "sections": [
    { "type": "HeroFullScreen", "id": "hero" },
    { "type": "ValueProps", "id": "value-props" },
    { "type": "About", "id": "about" },
    { "type": "Features", "id": "features" },
    { "type": "Stats", "id": "stats" },
    { "type": "FAQ", "id": "faq" },
    { "type": "CTABanner", "id": "cta" }
  ],
  "footer": "FooterFull",
  "settings": {
    "wrapperClass": "template-{slug}",
    "googleFontsUrl": "https://fonts.googleapis.com/css2?family=..."
  }
}
```

**Rules**:
- `navigation`: One of `NavFull`, `NavMinimal`, `NavTransparent`
- `sections[].type`: Must exactly match a key from the section registry (case-sensitive)
- `sections[].id`: Unique identifier for each section (used for config lookup)
- `sections[].visible`: Optional, set `false` to hide without removing
- `footer`: One of `FooterFull`, `FooterSimple`
- `settings.wrapperClass`: MUST be `template-{slug}` — used for CSS scoping
- `settings.googleFontsUrl`: Full Google Fonts URL with all needed weights

### Step 5: Write defaults.json

This is the big one. It provides the complete design system and all default content.

```json
{
  "template": "{slug}",
  "slug": "{slug}",
  "logoPath": null,
  "heroImagePath": "hero.jpg",
  "heroVideoPath": null,
  "primaryColor": "275 70% 55%",
  "fontFamily": "'Nunito', sans-serif",

  "designSystem": {
    "colors": {
      "{brand-name}": {
        "50": "...", "100": "...", "200": "...", "300": "...", "400": "...",
        "500": "...", "600": "...", "700": "...", "800": "...", "900": "..."
      },
      "primary": "H S% L%",
      "secondary": "H S% L%",
      "accent": "H S% L%",
      "background": "H S% L%",
      "surface": "H S% L%",
      "text": "H S% L%",
      "heading": "H S% L%",
      "border": "H S% L%",
      "success": "142 76% 36%",
      "warning": "38 92% 50%",
      "error": "0 72% 51%",
      "info": "199 89% 48%"
    },
    "typography": {
      "fontFamily": {
        "base": "'BodyFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        "heading": "'HeadingFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        "mono": "'Roboto Mono', 'Courier New', monospace"
      },
      "fontSize": {
        "xs": "0.75rem", "sm": "0.875rem", "base": "1rem", "lg": "1.125rem",
        "xl": "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem",
        "5xl": "3rem", "6xl": "3.75rem", "7xl": "4.5rem", "8xl": "6rem"
      },
      "lineHeight": {
        "tight": "1.25", "snug": "1.375", "normal": "1.5",
        "relaxed": "1.625", "loose": "2"
      },
      "letterSpacing": {
        "tighter": "-0.05em", "tight": "-0.025em", "normal": "0",
        "wide": "0.025em", "wider": "0.05em", "widest": "0.1em"
      },
      "fontWeight": {
        "normal": "400", "medium": "500", "semibold": "600",
        "bold": "700", "extrabold": "800"
      }
    },
    "shadows": {
      "theme-sm": "0 2px 8px rgba(R, G, B, 0.08)",
      "theme-md": "0 4px 16px rgba(R, G, B, 0.12)",
      "theme-lg": "0 8px 32px rgba(R, G, B, 0.16)",
      "theme-xl": "0 12px 48px rgba(R, G, B, 0.20)",
      "theme-2xl": "0 20px 64px rgba(R, G, B, 0.24)"
    },
    "gradients": {
      "primary": "linear-gradient(135deg, hsl(H S% L%) 0%, hsl(H S% L-20%) 100%)",
      "secondary": "linear-gradient(135deg, hsl(H S% L%) 0%, hsl(H S% L-20%) 100%)",
      "hero-overlay": "linear-gradient(180deg, rgba(R, G, B, 0.6) 0%, rgba(R, G, B, 0.8) 100%)",
      "card-hover": "linear-gradient(135deg, rgba(R, G, B, 0.1) 0%, rgba(R, G, B, 0.05) 100%)"
    },
    "spacing": {
      "section": "5rem",
      "container": "1.5rem",
      "card": "2rem"
    },
    "borderRadius": {
      "none": "0", "sm": "0.25rem", "md": "0.5rem", "lg": "0.75rem",
      "xl": "1rem", "2xl": "1.5rem", "full": "9999px"
    }
  },

  "valueProps": [
    { "title": "...", "description": "...", "icon": "Sparkles" },
    { "title": "...", "description": "...", "icon": "Shield" },
    { "title": "...", "description": "...", "icon": "Zap" },
    { "title": "...", "description": "...", "icon": "Truck" }
  ],

  "pageContent": {
    "homeHeroTitle": "Your Main Headline",
    "homeHeroSubtitle": "Supporting tagline",
    "homeHeroDescription": "A longer description of the value proposition.",
    "aboutMission": "The brand's mission statement and story."
  },

  "navigation": {
    "links": [
      { "label": "Products", "href": "/products" },
      { "label": "About", "href": "/about" },
      { "label": "FAQ", "href": "/faq" },
      { "label": "Contact", "href": "/contact" }
    ],
    "cta": { "label": "Get Started", "href": "/consultation" }
  },

  "footer": {
    "copyright": "\u00a9 {year} {businessName}. All rights reserved.",
    "disclaimer": "Cannabis should only be used under the guidance of a licensed healthcare professional.",
    "sections": [
      {
        "title": "Shop",
        "links": [
          { "label": "All Products", "href": "/products" },
          { "label": "Popular", "href": "/products?filter=popular" }
        ]
      },
      {
        "title": "Company",
        "links": [
          { "label": "About Us", "href": "/about" },
          { "label": "FAQ", "href": "/faq" }
        ]
      },
      {
        "title": "Legal",
        "links": [
          { "label": "Privacy Policy", "href": "/privacy" },
          { "label": "Terms", "href": "/terms" },
          { "label": "Compliance", "href": "/regulatory" }
        ]
      }
    ]
  }
}
```

**Content Guidelines**:
- `homeHeroTitle`: 3-8 words, punchy, matches the mood
- `homeHeroSubtitle`: 3-6 words, supporting the headline
- `homeHeroDescription`: 1-2 sentences, explains the value
- `aboutMission`: 2-3 sentences, brand story
- `valueProps`: 4 items, each with Lucide icon name (e.g., "Shield", "Sparkles", "Zap", "Heart", "Star", "Check", "Truck", "Clock", "Leaf")
- Navigation links: Products, About, FAQ, Contact are standard. Add blog link if template uses BlogFeed
- Footer disclaimer: ALWAYS include cannabis compliance language

**heroImagePath**: Set to `"hero.jpg"` if you include a default hero. Otherwise `null`. When a tenant clones, this seeds the hero image so the store isn't blank.

### Step 6: Write template.config.json

Marketplace metadata. This is what Super Admin sees when browsing templates.

```json
{
  "id": "{slug}",
  "slug": "{slug}",
  "name": "Template Display Name",
  "description": "2-3 sentence description of style, audience, and vibe.",
  "version": "1.0.0",
  "author": "BudStack Platform",
  "category": "modern",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "features": [
    "Feature description 1",
    "Feature description 2"
  ],
  "previewUrl": "/templates/{slug}/hero.jpg",
  "thumbnailUrl": "/templates/{slug}/hero.jpg",
  "screenshots": [],
  "demoUrl": null,
  "price": 0,
  "isPremium": false,
  "isActive": true,
  "components": [],
  "customization": {
    "colors": { "primary": "#HEX", "secondary": "#HEX", "accent": "#HEX" },
    "fonts": { "base": "'BodyFont', sans-serif", "heading": "'HeadingFont', sans-serif" }
  },
  "dependencies": ["framer-motion", "lucide-react"],
  "accessibility": { "wcag_level": "AA", "screen_reader_tested": true }
}
```

**Category options**: `modern`, `medical`, `wellness`, `professional`, `minimal`
**Tags**: 4-8 descriptive tags for marketplace search

### Step 7: Write styles.css

Custom CSS that scopes all styling to this template. Uses `:root` for CSS variables and `.template-{slug}` for scoped overrides.

```css
@import url('https://fonts.googleapis.com/css2?family=...&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== {Template Name} Styles ===== */

:root {
  /* Core Colors — RAW HSL, NO hsl() wrapper */
  --tenant-color-primary: H S% L%;
  --tenant-color-secondary: H S% L%;
  --tenant-color-accent: H S% L%;
  --tenant-color-background: H S% L%;
  --tenant-color-surface: H S% L%;
  --tenant-color-text: H S% L%;
  --tenant-color-heading: H S% L%;
  --tenant-color-border: H S% L%;

  /* Fonts */
  --tenant-font-base: 'BodyFont', sans-serif;
  --tenant-font-heading: 'HeadingFont', sans-serif;
}

/* Scoped Template Styles */
.template-{slug} {
  font-family: var(--tenant-font-base);
  background-color: hsl(var(--tenant-color-background));
  color: hsl(var(--tenant-color-text));
}

.template-{slug} h1,
.template-{slug} h2,
.template-{slug} h3,
.template-{slug} h4 {
  font-family: var(--tenant-font-heading);
  color: hsl(var(--tenant-color-heading));
}

/* Button Styles */
.template-{slug} .btn-primary {
  background-color: hsl(var(--tenant-color-primary));
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 700;
  transition: all 0.2s;
}

.template-{slug} .btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px hsl(var(--tenant-color-primary) / 0.4);
}

/* Section Spacing */
.template-{slug} .section-padding {
  padding: 5rem 0;
}

/* Custom Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**CSS Rules**:
1. `:root` vars are RAW HSL channels: `--tenant-color-primary: 275 70% 55%;`
2. Components reference them wrapped: `hsl(var(--tenant-color-primary))`
3. Opacity: `hsl(var(--tenant-color-primary) / 0.5)`
4. ALL template-specific styles scoped under `.template-{slug}`
5. The `@import url(...)` for Google Fonts MUST match `googleFontsUrl` in layout.json
6. Include `@tailwind base; @tailwind components; @tailwind utilities;`
7. Add unique utility classes, animations, or effects that make this template special

### Step 8: Create Git Repo

Output location: `/Users/gkavanagh/Development/HealingBuds/templates/{slug}-template/`

```bash
mkdir -p /Users/gkavanagh/Development/HealingBuds/templates/{slug}-template
# Write all files there
cd /Users/gkavanagh/Development/HealingBuds/templates/{slug}-template
git init
git add .
git commit -m "Initial commit: {Template Name} template"
gh repo create AutomatosAI/{slug}-template --public --source=. --remote=origin --push
```

### Step 9: Validate

Run through this checklist before declaring done:

**File Completeness**:
- [ ] `layout.json` exists with valid section types
- [ ] `defaults.json` exists with full designSystem + pageContent
- [ ] `template.config.json` exists with metadata
- [ ] `styles.css` exists with :root vars and scoped styles
- [ ] `README.md` exists

**Color Validation**:
- [ ] ALL colors in raw HSL format (no hex, no rgb, no `hsl()` wrapper)
- [ ] Primary color scale complete (50-900)
- [ ] Shadow RGB values match primary color
- [ ] Gradient HSL values match color scheme
- [ ] Light/dark theme colors are internally consistent

**Font Validation**:
- [ ] Google Fonts URL in both layout.json AND styles.css @import
- [ ] Font family strings in defaults.json include fallback stack
- [ ] `--tenant-font-base` and `--tenant-font-heading` set in styles.css :root

**Content Validation**:
- [ ] No placeholder text remaining
- [ ] All valueProps have valid Lucide icon names
- [ ] Navigation links use relative paths (e.g., `/products` not full URLs)
- [ ] Footer includes compliance disclaimer
- [ ] `wrapperClass` in layout.json matches CSS scoping class

**Section Validation**:
- [ ] Every `sections[].type` in layout.json exists in section registry
- [ ] Navigation and footer types exist in section registry
- [ ] Section IDs are unique

### Step 10: Upload to BudStack

After pushing to GitHub:

1. Go to **Super Admin → Store Templates** (`/super-admin/templates`)
2. Click **"Upload New Template"**
3. Enter the GitHub URL: `https://github.com/AutomatosAI/{slug}-template.git`
4. Structure type: **"Default (BudStack)"**
5. Click **Upload**

The upload process:
- Downloads ZIP from GitHub
- Validates `template.config.json`
- Uploads ALL files to S3 at `templates/{slug}/`
- Creates database record
- Template appears in marketplace

After upload:
- Go to **Template Management** → verify the card shows
- Upload a preview image via the edit button (screenshot of the rendered store)
- Tenants can now clone the template

---

## What Happens When a Tenant Clones

Understanding this helps you write better defaults:

1. Clone API copies S3 files: `templates/{slug}/` → `tenants/{id}/templates/{timestamp}/`
2. Reads `defaults.json` from source
3. Seeds `tenant_templates` DB record with:
   - `designSystem` → from defaults.json
   - `pageContent` → from defaults.json
   - `navigation` → from defaults.json
   - `footer` → from defaults.json
   - `heroImageUrl` → resolved from `heroImagePath` in defaults.json
4. The branding form (`/tenant-admin/branding`) reads these seeded values
5. Colors are converted HSL → hex for the color picker display
6. Tenant edits are saved back (deep-merged over template defaults)

**This means**: Whatever you put in defaults.json is what the tenant sees in their branding form on first load. Make it complete and polished — it's the first impression.

---

## Branding Form Fields (What Tenants Can Customize)

The branding form at `/tenant-admin/branding` has 6 tabs:

### Design Tab
- Business name, tagline
- Template style selector
- Logo upload, hero image upload, favicon upload

### Colors Tab
- Primary color (color picker)
- Secondary color
- Accent color
- Background color
- Text color
- Heading color

### Typography Tab
- Body font (dropdown): inter, roboto, lato, montserrat, poppins, playfair, outfit, nunito
- Heading font (same dropdown)
- Font size: small, medium, large

### Layout Tab
- Button style: rounded, square, pill
- Border radius: none, small, medium, large
- Spacing: compact, normal, comfortable
- Shadow style: none, soft, medium, bold

### Content Tab
- Home hero title, subtitle, description, CTA text
- About mission, vision, story
- Contact phone, email, address, hours

### Advanced Tab
- Custom CSS textarea
- Live preview link

---

## CSS Variable System (How Theming Works)

The `TenantThemeProvider` applies design tokens as CSS variables on a scoped container:

```
defaults.json designSystem.colors.primary = "275 70% 55%"
  → TenantThemeProvider reads this
  → Sets --tenant-color-primary: 275 70% 55% on .tenant-theme-container
  → Your styles.css uses: hsl(var(--tenant-color-primary))
  → When tenant changes to "#FF0000" via branding form
  → formatColorValue() converts to raw HSL
  → Override applies via inline style
```

**Variables applied by TenantThemeProvider**:
```css
/* Colors */
--tenant-color-primary
--tenant-color-secondary
--tenant-color-accent
--tenant-color-background
--tenant-color-surface
--tenant-color-text
--tenant-color-heading
--tenant-color-border

/* Tailwind integration */
--primary, --secondary, --accent, --background, --foreground

/* Typography */
--tenant-font-body
--tenant-font-heading
--tenant-font-size-base

/* Layout */
--tenant-border-radius
--tenant-button-radius
--tenant-spacing-scale
--tenant-shadow
--tenant-button-padding
--tenant-button-font-size
```

**Key insight**: Your `:root` CSS vars in styles.css are the BASE defaults. TenantThemeProvider OVERRIDES them via inline styles on a container div. So your styles.css provides the "out of the box" look, and tenant customization layers on top.

---

## Store URL Pattern

All links in navigation and footer use relative paths. The platform automatically prefixes them with `/store/{subdomain}/`:

```
In defaults.json: { "href": "/products" }
Rendered as:      /store/my-store/products
```

Standard pages available:
- `/products` — Product catalog
- `/consultation` — Book consultation
- `/about` — About page
- `/contact` — Contact page
- `/faq` — FAQ page
- `/privacy` — Privacy policy
- `/terms` — Terms of service
- `/regulatory` — Compliance/regulatory info

---

## Common Pitfalls

1. **Using hex colors in defaults.json** → Must be raw HSL: `"275 70% 55%"`
2. **Adding hsl() wrapper** → WRONG: `"hsl(275 70% 55%)"`, RIGHT: `"275 70% 55%"`
3. **Writing React components** → Templates are DATA ONLY. The platform renders.
4. **Forgetting heroImagePath** → Without it, fresh clones show no hero image
5. **Mismatching wrapperClass** → `layout.json settings.wrapperClass` MUST match CSS scoping class
6. **Wrong section type names** → Case-sensitive, must match registry exactly (e.g., `HeroFullScreen` not `heroFullScreen`)
7. **Missing Google Fonts URL** → Must be in BOTH layout.json settings AND styles.css @import
8. **Hardcoding tenant names** → Use `{businessName}` and `{year}` placeholders in footer
9. **Using full URLs in nav** → Use relative: `/products` not `https://example.com/products`
10. **Forgetting compliance disclaimer** → Every cannabis template needs one in the footer

---

## Helper Functions

Available in `./helpers.ts` for programmatic generation:

```typescript
hexToHSL("#A333E6")              // → "275 70% 55%"
hslToRGB("275 70% 55%")          // → { r: 163, g: 51, b: 230 }
hslToRGBString("275 70% 55%")    // → "163, 51, 230"
generateColorScale("275 70% 55%") // → { "50": "275 70% 97%", ..., "900": "275 70% 15%" }
generateShadows("275 70% 55%")    // → { "theme-sm": "0 2px 8px rgba(163, 51, 230, 0.08)", ... }
generateGradients("275 70% 55%")  // → { "primary": "linear-gradient(...)", ... }
validateHSL("275 70% 55%")        // → true
validateSlug("zen-garden")        // → true
findAndReplace(content, { old: new })
findPlaceholders(content)         // → ["template-slug", ...] if any remain
```

---

## Reference: CannaBizz Template

The CannaBizz template is the first production template built on this system. Use it as a reference for structure and completeness, but NEVER copy its content or brand identity.

**What CannaBizz does well** (emulate these patterns):
- Full color scale for the primary brand color
- Dark theme with proper contrast (light text on dark background)
- Custom animations (fadeInUp, neonPulse)
- Scoped CSS under `.template-cannabizz`
- Hero image bundled as `hero.jpg`
- Rich section composition (7 sections)
- Fun, audience-appropriate copy
- Complete footer with 3 link sections

**CannaBizz specs** (for reference, don't copy):
- Slug: `cannabizz`
- Style: Playful neon dark theme
- Colors: Purple primary (275 70% 55%), Green secondary (145 80% 55%), Blue accent (210 100% 65%)
- Fonts: Outfit (headings) / Nunito (body)
- Sections: HeroFullScreen, ValueProps, About, Features, Stats, FAQ, CTABanner
- Nav: NavFull, Footer: FooterFull

---

## Output Summary

When complete, confirm with the designer:

```
Template: {name}
Slug: {slug}
Location: /Users/gkavanagh/Development/HealingBuds/templates/{slug}-template/
GitHub: https://github.com/AutomatosAI/{slug}-template

Files:
  layout.json      — {N} sections ({list section types})
  defaults.json    — {theme description} ({primary color})
  template.config  — Marketplace: {category}, {N} tags
  styles.css       — {font pairing}, {animation count} animations
  hero.jpg         — {included/not included}

Next Steps:
1. Push to GitHub (done automatically if gh CLI available)
2. Super Admin → Store Templates → Upload New Template
3. Paste GitHub URL, select "Default (BudStack)"
4. After upload, edit the template card to add a preview screenshot
5. Tenants can clone from Template Marketplace
```

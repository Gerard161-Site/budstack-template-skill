# Design brief — BudStacks storefront templates (v2)

Give this page to the designer (a person, or a design tool such as Claude Design) before any design work starts. It says what the platform can render, what the designer decides, and what to hand back so the template can be built without guessing.

## 1. What you are designing

A BudStacks storefront is a medical-cannabis shop for one brand. A **template** is the look of that shop's home page and About page.

A template is not free-form. It is assembled from a fixed library of **sections** (section 4 below), styled by a fixed set of **design tokens** (section 3). The design has to be expressible as:

1. one navigation bar, chosen from five;
2. an ordered list of sections, chosen from the library, each with its own text, images and options;
3. one footer, chosen from three;
4. one set of design tokens.

Anything else cannot be built: a custom section layout, a new component, bespoke CSS effects, a second type scale, per-section fonts. If a design needs something the library does not have, pick the closest section and note the gap in the handoff. Do not draw it as if it existed.

Not part of the template, so do not design them: the product list and product pages, cart, checkout, account pages, the age gate and the cookie banner. They take the template's colours, fonts, radius and shadows automatically.

## 2. What makes a template look professional here

These are the rules a design is reviewed against.

- **Type.** At most two font families (one for headings, one for body), plus one optional accent face for a few words. Any Google Font is allowed. Hero heading 56–72px at desktop; section headings 36–48px. The platform scales both down on phones (to 60% and 70%), so do not design separate mobile sizes.
- **Rhythm.** Sections must not all be the same height apart. Plan the density of each section: `compact` for thin bands (logos, stats, a trust strip), `normal` for most, `spacious` for the one or two sections that should breathe.
- **One photographic treatment.** Pick one look for all images in the template (for example warm natural light, or studio product shots on a tint) and keep to it.
- **Eyebrows.** Use a small label above the heading on at least half the sections that have a heading.
- **Contrast.** Body text and headings at least 4.5:1 against their background, including inside any section given its own colours. Button labels must read on the button colour; the platform picks black or white for you, so do not rely on white text on a light brand colour.
- **Restraint.** One accent colour. No more than one animated or shader hero per page. Glass effects only when the palette is built for them.
- **Copy.** No medical claims ("cures", "treats", "the best"). Calls to action are about eligibility and consultation, not buying. Write real copy for the brand; do not leave placeholder text.

## 3. Design tokens you choose

One value per row for the whole template.

| Token | Choices |
|---|---|
| Colours (required) | primary, secondary, accent, background, text, heading |
| Colours (optional) | surface (cards), border |
| Body font | any Google Font |
| Heading font | any Google Font |
| Accent font (optional) | any Google Font |
| Base text size | 14–18px (default 16) |
| Hero heading size at desktop | 56–72px (default 60) |
| Section heading size at desktop | 36–48px (default 40) |
| Body weight | 300, 400, 500, 700 |
| Heading weight | 400, 500, 600, 700, 800 |
| Body letter-spacing | tight, normal, wide, wider |
| Heading letter-spacing | tight, normal, wide |
| Heading case | none, uppercase |
| Heading line height | tight, snug, normal |
| Corner radius | none, small, medium, large (cards 0 / 4 / 10 / 16px; framed images 0 / 8 / 16 / 24px) |
| Button shape | rounded, square, pill |
| Button size | small, medium, large |
| Shadow strength | none, soft, medium, bold |
| Shadow tint | neutral (black), brand (the heading colour) |
| Spacing scale | compact, normal, comfortable |
| Glass effect on cards | none, light, heavy |
| Button hover | none, lift, glow, scale, pulse |
| Scroll-in animation | none, fade-up, slide-right, zoom-in |
| Divider between sections | none, wave, slant, curve |

Per section you may also set: **density** (compact, normal, spacious), an **eyebrow**, text alignment (left, centre, right), and a **colour override** (its own background, text, heading, primary and so on) for a dark band or a tinted block.

## 4. The section library

### Navigation (pick one)

| Type | What it is |
|---|---|
| NavMinimal | Clean, flat bar |
| NavFull | Standard sticky bar with cart and call to action |
| NavTransparent | Transparent over the hero, fills in on scroll |
| NavDark | Floating dark glass bar |
| NavPill | Compact centred floating capsule |

### Heroes (use one, first on the page)

| Type | What it is |
|---|---|
| HeroFullScreen | Full-width background image or gradient with text over it |
| HeroSplit | Two columns: text and one image |
| HeroSplitImages | Two columns: text and an asymmetric grid of three images |
| HeroFramed | Full background image with a text panel on the left or right |
| HeroCollage | Editorial collage of split images, watermark and bold type |
| HeroVideo | Background video |
| HeroMinimal | Text only |
| HeroDesignali | Gradient headline, radial glow, optional showcase image |
| HeroAurora | Animated aurora gradient, letter-by-letter headline |
| HeroMeshGradient | Dark hero with animated mesh gradients |
| HeroShaderGlass | Dark glass hero with mesh gradient and glowing border |
| HeroWarpShader | Animated fluid warp background |
| HeroFuturistic | Dark hero with animated grid and particles |

### Content

| Type | What it is |
|---|---|
| ValueProps | Three or four benefits, each an icon, title and line. Variants: card, bordered, plain; icon in a circle, square or bare; centred or left-aligned |
| Features | Feature list with icons or images. Variants: card, bordered, plain |
| FeaturesShowcase | Centre image with feature cards on each side |
| Testimonials | Customer quotes, optional avatar. Variants: card, bordered, plain |
| SocialProof | Avatar stack, trust line and optional quote |
| About | Brand story with one image and a few stats |
| Stats | A row of key numbers |
| StatsCounter | Key numbers that count up, with icons |
| ProductShowcase | Live products or product categories from the shop |
| Gallery | Image grid |
| VideoGallery | Video and image grid that opens in a modal |
| ImageShowcase | One full-width image with text over it |
| Parallax | Full-width image with parallax scroll and text over it |
| BentoGrid | Asymmetric grid of cards of different sizes |
| BlogFeed | Recent posts from the shop's blog |
| LogoMarquee | Scrolling row of partner or press logos |
| TextMarquee | Scrolling line of text |
| Pricing | Plan cards with feature lists |
| ComparisonTable | Feature comparison grid across plans |
| TeamGrid | Team members: avatar, name, role, bio |
| Timeline | Vertical timeline with years |
| ProcessSteps | Numbered steps with connecting lines |
| TabsShowcase | Tabs, each with an image and description |
| FAQ | Accordion of questions |

### Calls to action

| Type | What it is |
|---|---|
| CTABanner | Full-width band: heading, line, one button, optional footnote |
| CTASplit | Two columns: text and image |
| CTAWithImage | Call to action beside a featured image |
| Newsletter | Email signup |

### Footer (pick one)

| Type | What it is |
|---|---|
| FooterSimple | One line: copyright and links |
| FooterFull | Multi-column links, contact details, disclaimer |
| FooterBrand | Dark footer with brand block, columns and contact |

Every footer carries the **Dr Green partner mark**. This is mandatory and cannot be removed. Choose `full` (logo block) or `compact` (one line, single colour); FooterSimple is always compact.

### About page

The About page is a fixed sequence of seven sections: page title, mission and story, stats band, values grid, facilities, journey timeline, closing call to action. Supply the text and images; the layout is not designable.

## 5. Images

Supply or describe every image. Sizes are minimums.

| Slot | Size | Shape |
|---|---|---|
| Full-screen hero background | 1920×1080 (2560×1440 preferred) | 16:9 |
| Split hero image | 1200×1200 | 1:1 or 4:5 |
| Hero video | 1920×1080 MP4, 8 MB or less, about 8 seconds, loops | 16:9 |
| Image showcase, parallax | 1200×800 | 3:2 |
| Gallery image | 800×800 | 1:1 |
| Card illustration | 800×600 | 4:3 |
| Avatar | 200×200 | 1:1 |
| Logo | 400×400, transparent PNG or SVG | square |

No image slot may be left empty. If a logo row has six logos, there must be six logos.

## 6. What to hand back

For each template, one page of design at 1440px and one at 375px, plus this specification as text. The specification is what gets built; the picture shows intent.

```
Template name:
Slug (lowercase-with-hyphens):
Brand in one paragraph (who it is for, tone):

TOKENS
  colours: primary, secondary, accent, background, text, heading [, surface, border]   (hex)
  fonts: body, heading [, accent]
  sizes: base, hero, section
  weights: body, heading
  heading: letter-spacing, case, line height
  radius, button shape, button size
  shadow strength, shadow tint
  spacing scale, glass, button hover, scroll animation, divider

NAVIGATION
  type, links (label → page), call-to-action label

SECTIONS (in order)
  1. type
     eyebrow, heading, subtitle
     options (variant, alignment, columns …)
     items (title, text, icon or image for each)
     buttons (label → where it goes)
     density: compact | normal | spacious
     colour override, if any
     images used (slot → which image)
  2. …

FOOTER
  type, partner mark (full | compact), tagline, columns, disclaimer

ABOUT PAGE
  text and images for the seven sections

IMAGES
  for each: file or description, slot, size

GAPS
  anything the design wanted that the library could not do
```

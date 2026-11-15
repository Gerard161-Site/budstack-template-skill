# Figma import

Use this when the input is a Figma URL (`figma.com/design/…` or `figma.com/file/…`). It needs the `figma` MCP server. The result of this reference is the same thing every other input produces: a filled-in handoff specification (see `design-brief.md` §6), which `SKILL.md` Phase 2 onward turns into a template.

Two rules override anything below that says otherwise:

- Map the design onto the section library in `contract/component-catalog.md`. If a frame has no matching section, pick the closest and record the gap; do not invent a section or a config key.
- Emit only the design tokens listed in `SKILL.md` Phase 2. A Figma style that has no token (a second shadow, a per-section font) is dropped and recorded as a gap.

---

## Reading the file

**When the user provides a Figma URL, use this path. Skip the interview entirely.**

**Prerequisites:** The `figma` MCP server must be configured and available.

**Step 1 — Extract the Figma file key from the URL:**
The URL format is `https://www.figma.com/design/{FILE_KEY}/...` or `https://www.figma.com/file/{FILE_KEY}/...`
Extract the `FILE_KEY` portion (e.g., `HqvNJqJy8Xvu3KWYu8QLUV`).

**Step 2 — Get a VISUAL REFERENCE first (MANDATORY):**

**Before interpreting any structured data, you MUST see the design visually.** Structured JSON data
tells you what nodes exist. A screenshot tells you what the design actually LOOKS like — light vs
dark sections, visual rhythm, spacing, composition, how images sit in context.

**Method A: Export the root frame as a rendered PNG** using `download_figma_images`:
```
download_figma_images(fileKey, nodes=[{nodeId: ROOT_FRAME_ID, fileName: "design-reference.png"}])
```
When you pass a nodeId **WITHOUT** an `imageRef`, the Figma API renders the entire node WITH ALL
children composed into a single flat image — like a screenshot. Use this for the full-page reference.

**Method B: Ask the user for a screenshot** — If the API is rate-limited or the frame is too large,
ask the user to export from Figma (Select frame → Export → PNG/JPG). A screenshot is equally valuable.

**Read the screenshot with the Read tool** before making ANY design decisions. This is non-negotiable.

**Step 2b — Read structured design data:**

Use **`get_figma_data`** with the file key and node ID. Returns: hierarchy, component names, text
content, layout rules, spacing, image references, and design tokens.

**Step 2c — Build a section light/dark map (MANDATORY before generating files):**

Cross-reference the screenshot with the structured data. For EACH section group, determine:

| Question | How to tell from data | How to tell from screenshot |
|---|---|---|
| Light or dark bg? | Text fills: `#000000` = light bg, `#FFFFFF` = dark bg | Visually obvious |
| Has bg image? | RECTANGLE child with `fills[].type === "IMAGE"` | Photo visible behind content |
| Heading color? | Heading TEXT node fill color | Contrast against background |
| Body text color? | Body TEXT node fill color | Readability check |

**CRITICAL: Never assume an all-dark or all-light theme.** Most designs ALTERNATE light and dark
sections. Get this wrong and the entire template looks broken (black text on black bg, white text
on white bg). Build the map BEFORE generating any files.

**Fallback: Figma REST API** — If MCP tools are unavailable:

```bash
# Get full file structure, text, colors, typography
curl -s -H "X-Figma-Token: {API_KEY}" "https://api.figma.com/v1/files/{FILE_KEY}"

# Export rendered screenshots of nodes (renders WITH all children)
curl -s -H "X-Figma-Token: {API_KEY}" "https://api.figma.com/v1/images/{FILE_KEY}?ids={NODE_IDS}&format=png&scale=2"
```

If the file has multiple pages, focus on the homepage/landing page first.

**Step 3 — Interpret the Figma design and map to BudStacks:**

Analyze the Figma output and produce a **design interpretation brief**. This is the critical AI step.
Map what you see to the closest BudStacks components:

| What you see in Figma | Map to BudStacks |
|---|---|
| **HEROES** | |
| Large hero banner / full-width image with text overlay | `HeroFullScreen` |
| Split layout — text one side, image other | `HeroSplit` |
| Split layout with multiple image grid (2-3 images) | `HeroSplitImages` |
| Video placeholder or cinematic header | `HeroVideo` |
| Clean text-only header, no image | `HeroMinimal` |
| Animated gradient / abstract colorful background | `HeroAurora` or `HeroMeshGradient` |
| Glassmorphism hero with blur/glow effects | `HeroShaderGlass` |
| Clean modern hero with gradient text + showcase image | `HeroDesignali` |
| Animated pattern/grid background (checks, stripes) | `HeroWarpShader` |
| Dark futuristic / cyberpunk / grid-line aesthetic | `HeroFuturistic` |
| **CONTENT** | |
| 3-4 icon+text cards in a grid | `ValueProps` |
| 6+ feature items in grid/list | `Features` |
| Text block + image side by side with stats | `About` |
| Product category cards | `ProductShowcase` |
| Quote/review cards with star ratings | `Testimonials` |
| Avatar stack + rating + customer count (compact) | `SocialProof` |
| Image grid / masonry layout | `Gallery` |
| Video + image mixed grid with lightbox | `VideoGallery` |
| Big number counters on colored bg | `Stats` or `StatsCounter` |
| Expandable question/answer list | `FAQ` |
| Blog post cards | `BlogFeed` |
| Full-width image with overlaid text card | `ImageShowcase` |
| Full-width image with parallax scroll effect | `Parallax` |
| Scrolling logo strip / partner logos | `LogoMarquee` |
| Asymmetric card grid with mixed sizes | `BentoGrid` |
| Pricing tier cards / membership plans | `Pricing` |
| Feature comparison matrix / table | `ComparisonTable` |
| Team member cards with photos + roles | `TeamGrid` |
| Vertical timeline / milestones / history | `Timeline` |
| Numbered steps / how-it-works flow | `ProcessSteps` |
| Tabbed content panels with icons | `TabsShowcase` |
| **CTAs** | |
| Gradient banner with single CTA button | `CTABanner` |
| Image bg with CTA overlay | `CTAWithImage` |
| Steps/process diagram + image | `CTASplit` |
| Email signup / newsletter form | `Newsletter` |
| **NAVIGATION** | |
| Dark floating nav with blur | `NavDark` |
| Transparent/invisible nav | `NavTransparent` |
| Solid professional nav with cart | `NavFull` |
| Simple minimal nav | `NavMinimal` |
| Pill-shaped floating nav (premium) | `NavPill` |
| HealingBuds branded nav | `NavHealingBuds` |
| **FOOTERS** | |
| Premium footer with contact info + columns | `FooterBrand` |
| Multi-column link footer | `FooterFull` |
| Single-line minimal footer | `FooterSimple` |

**Step 4 — Extract design tokens:**

From the Figma colors/variables, extract and convert to raw HSL channels:
- Primary, secondary, accent colors → `"H S% L%"` format (NO hex, NO `hsl()` wrapper)
- Background and surface colors
- Text and heading colors
- Any gradient definitions

From typography:
- Identify heading font family and body font family
- Map to Google Fonts URL
- Extract font weights, sizes, letter-spacing if available

**Step 5 — Extract content:**

Pull actual text content from the Figma design:
- Hero headline and subtitle
- Section headings
- Value prop / feature item text
- CTA button labels
- Navigation link labels
- Footer text and tagline

Use the ACTUAL text from the Figma file — don't generate placeholder content when real content exists.

**Step 6 — Present interpretation to user for approval:**

Before generating files, present a summary:
```
Figma Import Summary:
- Brand: {name from Figma file}
- Sections detected: Hero (split) → Values (4 cards) → About → Testimonials → CTA → Footer
- Mapped to: HeroSplit → ValueProps → About → Testimonials → CTABanner
- Nav: NavFull (solid professional nav detected)
- Footer: FooterBrand (multi-column with contact)
- Colors: Primary #xxx → H S% L%, Secondary #xxx → H S% L%, ...
- Typography: {heading font} + {body font}
- Content: Using text from Figma file
- Images: {N} images detected (will need to be provided separately for S3)
```

**Wait for user approval before proceeding to Phase 2.**

**Image handling note:** Figma images can be exported via the API but quality/licensing varies.
Flag to the user which sections need images and whether the Figma images should be exported
or if they'll provide their own. Create `assets/` directory with `.gitkeep` for any missing images.

---


---

## API and export reference

This is the end-to-end pipeline for converting any Figma design into a BudStacks template.

### Quick Reference: Figma API Endpoints

```bash
# 1. Get full file (structure, text, colors, fonts)
curl -s -H "X-Figma-Token: {KEY}" "https://api.figma.com/v1/files/{FILE_KEY}"

# 2. Export images from specific nodes (scale=2 for retina)
curl -s -H "X-Figma-Token: {KEY}" "https://api.figma.com/v1/images/{FILE_KEY}?ids={NODE_IDS}&format=png&scale=2"

# 3. Get file styles (published styles only)
curl -s -H "X-Figma-Token: {KEY}" "https://api.figma.com/v1/files/{FILE_KEY}/styles"
```

### Image Export Strategy

**CRITICAL: Two types of image export exist — know the difference:**

#### Type 1: Node Render (NO imageRef) — Full-size composed image
When you call `download_figma_images` with a nodeId but **WITHOUT** an `imageRef`, the Figma API
RENDERS the node with all its children at the requested scale. This produces a full-size, web-ready
image exactly as it appears in the design.

**Use this for:**
- Full-page design reference screenshots (export the root frame)
- Section screenshots for visual comparison
- Composed visuals (hero with overlays, cards with text, etc.)
- ANY image where you want the final composed result

#### Type 2: Fill Image (WITH imageRef) — Raw source fill
When you include an `imageRef`, it downloads the raw image fill from that specific node. This can
be a tiny thumbnail, a cropped portion, or a low-res placeholder — **you have no control over the
source resolution.**

**Use this ONLY for:**
- Raw background photos you'll use as CSS backgrounds
- Source images you know are high-res from the Figma data

#### Correct Export Workflow

1. **Export the full page as a reference** (Node Render, no imageRef):
   ```
   {nodeId: "ROOT_FRAME", fileName: "design-reference.png"}
   ```

2. **Export each section GROUP as a composed screenshot** (Node Render, no imageRef):
   ```
   {nodeId: "HERO_GROUP", fileName: "hero-composed.png"}
   {nodeId: "PARTNERS_GROUP", fileName: "partners-composed.png"}
   ```

3. **Export individual images at full size** (Node Render on the IMAGE rectangle, no imageRef):
   ```
   {nodeId: "PARTNER_PHOTO_RECT", fileName: "partner-erik.png"}
   ```
   This renders the rectangle at its Figma dimensions × pngScale. A 458×497px rectangle at
   scale=2 produces a 916×994px image — perfect for web.

4. **Only use imageRef as a last resort** when you specifically need the raw source image
   and you've verified it's high-res.

#### Quality Checklist
- **Minimum file size for photos:** >50KB (if a "photo" is 9KB, something is wrong)
- **Always use pngScale: 2** for retina-ready images
- **Verify sizes after download** — `ls -lh assets/` and flag anything suspiciously small

#### Rate Limit Awareness (Figma API: ~30 requests/minute)
- **Batch all image downloads into ONE call** — pass all nodes in a single array
- **Never retry 429 errors immediately** — wait at least 60 seconds, or ask the user to export manually
- **Minimize total API calls:** 1 for `get_figma_data` + 1 for `download_figma_images` = 2 total
- **If rate-limited:** Ask the user to manually export from Figma (Select node → Export → PNG 2x)

#### Semantic naming:
- Hero image → `hero.png`
- About section image → `about.png`
- Team/partner photos → `partner-{name}.png`
- Brand images → `brand-{name}.png`
- Gallery images → `gallery-{n}.png`
- Section backgrounds → `bg-{section}.png`

### Section Mapping Intelligence

When interpreting a Figma design, think in terms of **what the section does**, not just what it looks like:

- A row of logos → `LogoMarquee` (not "skip it")
- A large mixed-size card grid → `BentoGrid` (not just "ValueProps")
- Numbered steps → `ProcessSteps` (not `CTASplit`)
- A tabbed interface → `TabsShowcase` (not `Features`)
- A full-width photo break → `Parallax` (not `ImageShowcase`)
- An email signup form → `Newsletter` (not `CTABanner`)
- A comparison matrix → `ComparisonTable` (not "skip it")
- Staff/team photos → `TeamGrid` (not `About`)
- Brand history / milestones → `Timeline` (not `About`)

### Confidence Scoring

When mapping Figma sections to BudStacks components, rate your confidence:
- **High (90%+):** Clear visual match (e.g., accordion = FAQ, star ratings = Testimonials)
- **Medium (60-89%):** Reasonable interpretation (e.g., large card grid could be BentoGrid or ProductShowcase)
- **Low (<60%):** No clear match — flag to user and suggest closest option or skip

Present low-confidence mappings to the user for decision before generating files.


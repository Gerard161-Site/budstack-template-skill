# BudStacks Section Component Catalog

Complete reference for every registered section component, its config options, and visual behavior.

## Heroes

### HeroFullScreen
Full-viewport immersive hero with ambient glow effects and staggered animations.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| title | string | pageContent.homeHeroTitle | Falls back to "Welcome to {businessName}" |
| subtitle | string | pageContent.homeHeroSubtitle | |
| description | string | pageContent.homeHeroDescription | |
| textAlign | "center" \| "left" | "center" | Left shows inline logo, center shows circular logo badge |
| heroType | "image" \| "gradient" \| "gradient-image" | "gradient-image" | Image needs heroImageUrl; gradient uses CSS |
| ctaText | string | "Book Consultation" | Primary CTA button |
| secondaryCtaText | string | — | Optional outline-style second CTA |
| secondaryCtaHref | string | — | |

**Visual:** Three gradient overlay layers, animated scroll indicator, ambient glow using primary color.
**Best for:** Bold first impressions, lifestyle brands, image-heavy sites.

### HeroSplit
Two-column split layout — text on left, image on right.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| title | string | pageContent.homeHeroTitle | |
| subtitle | string | pageContent.homeHeroSubtitle | |
| description | string | pageContent.homeHeroDescription | |
| ctaText | string | "Get Started" | |
| secondaryCtaText | string | — | Outline-style button |
| secondaryCtaHref | string | — | |

**Visual:** Grid with 4:5 aspect ratio image area. Image side has gradient fallback if no heroImageUrl. Text slides from left, image from right with stagger delay.
**Best for:** Professional sites, medical clinics, B2B brands, content-forward sites.

### HeroVideo
Video background with cinematic overlay and optional watermark.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| videoUrl | string | — | Relative path (e.g. "assets/hero-video.mp4") — signed by platform |
| watermarkUrl | string | — | Large semi-transparent logo overlay (40vw, 12% opacity) |
| textAlign | "left" \| "center" \| "right" | "center" | Affects content and logo placement |
| heroType | "video" \| "image" \| "gradient-image" | Auto-detected from videoUrl | |
| overlayOpacity | number | 0.55 | 0-1, controls dark gradient overlay |
| ctaText | string | "Book Consultation" | |
| title | string | pageContent.homeHeroTitle | |
| subtitle | string | pageContent.homeHeroSubtitle | |

**Visual:** Muted, looped video. 90-degree gradient overlay (dark left → transparent right for left-align). Poster fallback to heroImageUrl.
**Best for:** Premium brands, brands with video assets, cinematic experiences.
**Note:** Set `heroVideoPath: null` and `videoUrl` in section config. Video files need to be in template assets/ dir and uploaded to S3.

### HeroMinimal
Clean, gradient-only hero with no image — purely typographic.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| title | string | pageContent.homeHeroTitle | |
| subtitle | string | pageContent.homeHeroSubtitle | |
| description | string | pageContent.homeHeroDescription | |
| ctaText | string | "Get Started" | Shows with arrow-right icon |

**Visual:** Soft gradient background (primary at 0.08 opacity), centered text, uppercase subtitle label, CTA with animated arrow. Light and elegant.
**Best for:** Editorial brands, text-first sites, minimal aesthetics, brands without hero imagery.

---

## Content Sections

### ValueProps
Value proposition card grid. Adapts to item count (3 items = 3-col centered, 4 = 4-col).

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Why Choose Us" | |
| subtitle | string | "Experience the difference..." | |
| items | Array | 4 defaults | `{ title, description, icon }` |

**Icons available:** Star, Shield, Heart, Check, Sprout, Users, FlaskConical, Leaf, Award, Clock, Truck, HeartPulse, Zap, Eye, Lock, Globe
**Visual:** Icon in circular primary-tinted bg, card with border + shadow on hover. Intersection observer animation.
**Best for:** Trust building, differentiators, core values.

### Features
Horizontal icon+text feature cards in 3-column grid.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "What Sets Us Apart" | |
| subtitle | string | | |
| items | Array | 6 defaults | `{ title, description, icon }` |

**Visual:** Icon in rounded square (primary bg), text alongside. 3-col desktop, 2-col tablet. Shadow-md on hover.
**Best for:** Feature lists, service breakdowns, detailed differentiators. Use when you need MORE than 4 value props.

### About
Two-column about section with image + stat counters.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "About {businessName}" | |
| content | string | pageContent.aboutMission | Multi-sentence description |
| imageUrl | string | — | Relative path, signed by platform |
| stats | Array | 3 defaults | `{ value, label }` e.g. `{ "value": "5000+", "label": "Happy Patients" }` |

**Visual:** Left = 4:3 image (gradient fallback), Right = heading + text + 3-stat grid + CTA button. Stats show large primary-colored values.
**Best for:** Brand story, company info, establishing credibility.

### ProductShowcase
Product category navigation cards.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Our Products" | |
| subtitle | string | | |
| categories | Array | 4 defaults | `{ title, description, href }` |

**Visual:** 4-col card grid, hover lift. Each card has arrow link. Bottom "View All Products" CTA.
**Best for:** Category browsing, product discovery.

### Testimonials
Customer review cards with star ratings.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "What Our Patients Say" | |
| subtitle | string | | |
| items | Array | 3 defaults | `{ quote, author, role, rating }` |

**Visual:** Quote icon watermark, star rating, surface-colored cards, staggered animation. 3-col grid.
**Best for:** Social proof, trust building. Pair after About or ValueProps.

### Gallery
Masonry-style image gallery with hover zoom.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Our Gallery" | |
| subtitle | string | | |
| items | Array | — | `{ src, alt, span: "wide" \| "tall" \| "normal" }` |

**Visual:** 3-col grid with variable spans. Image zoom on hover (scale-105), gradient overlay appears.
**Best for:** Visual brands, dispensary interiors, product photography.
**Note:** Images need to be uploaded to S3 template assets.

### Stats
Animated number counters on gradient background.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "By the Numbers" | |
| items | Array | 4 defaults | `{ value, suffix, prefix, label }` |

**Visual:** Full-width primary→secondary gradient bg, large animated counters (2s duration), 4-col grid. WHITE text on dark gradient.
**CSS Note:** Stats has its own dark gradient background. You may still want to scope `--tenant-color-heading: 0 0% 100%` for the section.
**Best for:** Impressive metrics, authority, scale.

### FAQ
Accordion with expand/collapse animation.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Frequently Asked Questions" | |
| subtitle | string | | |
| items | Array | 5 defaults | `{ question, answer }` |

**Visual:** Chevron rotation indicator, AnimatePresence transitions, max-width 3xl container. First item open by default.
**Best for:** Common questions, compliance info, reducing support load.

### BlogFeed
Latest blog post cards pulled from tenant's posts.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Latest from The Wire" | |
| subtitle | string | | |

**Visual:** 3-col card grid, gradient placeholder if no image, date with Clock icon, "View All" link with arrow. Surface background.
**Best for:** Content marketing, news, updates. Usually near bottom of page.

### ImageShowcase
Full-width background image with floating content card overlay.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Our Facility" | |
| content | string | | Description paragraph |
| ctaText | string | | Button text |
| ctaHref | string | | Button link |
| imageUrl | string | — | Relative path |
| overlayStyle | "gradient-left" \| "gradient-center" \| "dark" | "gradient-left" | Direction of gradient overlay |

**Visual:** Rounded corners (2xl-3xl), min-height 420px, backdrop-blur content card. Multiple overlay options for directional emphasis.
**Best for:** Facility showcases, immersive breaks between text sections, visual storytelling.

### LogoMarquee
Infinite scrolling brand logo carousel with edge fade masks.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Trusted By" | Small uppercase label above marquee |
| logos | Array | 6 placeholders | `{ src, alt }` — image URL + alt text |
| speed | number | 60 | 1-100, controls scroll speed |
| reverse | boolean | false | Reverse scroll direction |

**Visual:** Infinite CSS animation loop, grayscale logos that colorize on hover, gradient fade masks on edges. Doubles logo array for seamless loop.
**Best for:** Partner logos, brand trust signals, certifications. Pairs well after hero or before footer.

### BentoGrid
Trendy asymmetric card grid with variable span sizes.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Why We Stand Out" | |
| subtitle | string | — | |
| cards | Array | 6 defaults | `{ icon, title, description, span, imageUrl }` |

**Span options:** `"wide"` (col-span-2), `"tall"` (row-span-2), `"normal"` (1×1)
**Icons available:** Leaf, Shield, Zap, Heart, Sparkles, Package
**Visual:** 3-column grid with auto-rows, cards have icon badge + title + description. Optional background image (20% opacity). Hover shadow-xl.
**Best for:** Feature highlights, value propositions with visual interest, modern layouts.

### Pricing
2-3 tier pricing cards with feature lists and highlighted "popular" tier.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Simple, Transparent Pricing" | |
| subtitle | string | "Choose the plan..." | |
| tiers | Array | 3 defaults | `{ name, price, description, features[], cta, highlighted }` |

**Visual:** Cards side by side, highlighted tier gets primary bg + white text + "Most Popular" badge + scale-up. Feature list with Check icons. CTA button per tier. Adapts to 2 or 3 tiers.
**Best for:** Subscription plans, membership tiers, service packages.

### TeamGrid
Team member avatars with name, role, and optional bio.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Meet Our Team" | |
| subtitle | string | "The experts behind..." | |
| members | Array | 4 defaults | `{ name, role, avatar, bio }` |

**Visual:** Circular avatar (initials fallback if no image), name + role (primary color) + bio text. 4-col for 4+, 3-col otherwise. Staggered entrance animation.
**Best for:** Team pages, about sections, establishing human connection.

### Timeline
Vertical timeline with dot indicators and year labels.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Our Journey" | |
| subtitle | string | — | |
| entries | Array | 5 defaults | `{ year, title, description, imageUrl }` |

**Visual:** Center vertical line (desktop), dot indicators, alternating left/right cards (desktop). Year badges in primary pill. Cards with border + rounded corners.
**Best for:** Company history, milestones, process explanations, brand story.

### ComparisonTable
Feature comparison grid with check/x icons across tiers.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Compare Plans" | |
| subtitle | string | "Find the right fit..." | |
| tiers | Array | ["Basic", "Pro", "Enterprise"] | Tier column names |
| features | Array | 7 defaults | `{ name, values[] }` — values are `true`, `false`, or string |

**Visual:** Table with tier headers, feature rows with Check (green) / X (gray) icons or text values. Responsive with horizontal scroll. Clean border styling.
**Best for:** Plan comparison, feature matrices, upgrade justification. Pairs well with Pricing.

### Parallax
Full-width background image with parallax scroll effect and overlay text.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Experience the Difference" | |
| description | string | "Premium quality products..." | |
| imageUrl | string | — | Background image, falls back to gradient |
| ctaText | string | — | Optional CTA button |
| ctaHref | string | consultationUrl | CTA link |
| overlayOpacity | number | 0.5 | 0-1, dark overlay opacity |

**Visual:** framer-motion scroll-linked parallax (±10% range). Dark overlay, centered white text, optional CTA button. Min-height 60vh. Gradient fallback.
**Best for:** Visual breaks, immersive moments, image-heavy brands. Use between content sections.

### SocialProof
Avatar stack badge with trust metrics and optional testimonial.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | — | Optional section heading |
| avatars | Array | 5 defaults | Avatar image URLs |
| count | number | 10000 | Customer count (displays as "10K+") |
| label | string | "Happy Customers" | |
| rating | number | 4.9 | Star rating (1-5) |
| testimonial | string | — | Optional quote |
| testimonialAuthor | string | — | Quote attribution |

**Visual:** Overlapping avatar circles + star rating + count. Letters fallback for missing avatar images. Optional blockquote card below. Compact and punchy.
**Best for:** Quick trust signal, pairs with hero or above CTA. Lightweight alternative to full Testimonials.

### TabsShowcase
Tabbed content with icon triggers and per-tab image + description.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "What Sets Us Apart" | |
| subtitle | string | — | |
| tabs | Array | 4 defaults | `{ label, icon, title, description, imageUrl }` |

**Icons available:** Leaf, FlaskConical, Truck, ShieldCheck
**Visual:** Pill-style tab triggers (active = primary bg). Content area: 2-column grid with text + image/placeholder. AnimatePresence transitions between tabs. Icon placeholder when no image.
**Best for:** Feature deep-dives, process explanations, multi-aspect showcases. Rich alternative to ValueProps.

### VideoGallery
Video/image grid with click-to-expand modal and play button overlays.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Gallery" | |
| subtitle | string | — | |
| items | Array | 5 defaults | `{ type, src, thumbnail, title, span }` |

**Type options:** `"video"` (shows play button), `"image"`
**Span options:** `"wide"` (col-span-2), `"normal"`
**Visual:** 3-column grid with auto-rows. Hover: scale-up + dark overlay. Click: full-screen modal with video player or image viewer. X close button. Spring animation on modal.
**Best for:** Product videos, behind-the-scenes, dispensary tours. Pairs well with Gallery.

### ProcessSteps
Horizontal or vertical numbered steps with connecting lines and icons.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "How It Works" | |
| subtitle | string | "Getting started is simple" | |
| orientation | "horizontal" \| "vertical" | "horizontal" | Layout direction |
| steps | Array | 4 defaults | `{ title, description, icon }` |

**Icons available:** ClipboardList, Search, Truck, CheckCircle
**Visual:** Step circles with icon + numbered badge, connecting lines between steps. Horizontal = side-by-side on desktop, vertical = stacked. Staggered entrance.
**Best for:** Onboarding flows, how-it-works, ordering process. Cleaner than CTASplit's hardcoded 3-step.

### StatsCounter
Animated digit roller with spring physics and icons — upgraded Stats.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | — | Optional heading |
| items | Array | 4 defaults | `{ value, suffix, label, icon }` |

**Icons available:** Users, Package, Star, TrendingUp
**Visual:** Primary→secondary gradient bg, icon circles (white/10 bg), spring-animated counter (framer-motion useSpring). Handles decimals (4.9) and large numbers (10,000+). White text.
**CSS Note:** Same gradient background as Stats — may need dark text scoping.
**Best for:** Impressive metrics with smooth animation. Use instead of Stats for richer visual.

---

## CTA Sections

### Newsletter
Email signup section with heading, input, and subscribe button.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Stay in the Loop" | |
| subtitle | string | "Get the latest news..." | |
| placeholder | string | "you@example.com" | Input placeholder |
| buttonText | string | "Subscribe" | Button label |

**Visual:** Primary→secondary gradient bg, mail icon circle, email input + button inline (stacked on mobile). Success state on submit. White text, white/10 input bg.
**Best for:** Email list building, pre-footer engagement. Place near end of page.

### CTABanner
Simple gradient banner call-to-action.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | "Ready to Start?" | |
| subtitle | string | | |
| ctaText | string | "Book Consultation" | White bg + primary text button |

**Visual:** Primary→secondary gradient bg, centered white text, single CTA. "No credit card required" disclaimer.
**Best for:** Quick conversion point. Place before footer.

### CTAWithImage
Image background CTA with colored overlay.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | | |
| subtitle | string | | |
| ctaText | string | | |
| imageUrl | string | — | Falls back to gradient if no image |

**Visual:** Background image under 135-degree gradient overlay (primary→secondary), centered content, rounded corners.
**Best for:** Visually rich CTAs, premium feel.

### CTASplit
Split layout with steps process + image.

**Config:**
| Key | Type | Default | Notes |
|-----|------|---------|-------|
| heading | string | | |
| subtitle | string | | |
| ctaText | string | | |
| imageUrl | string | — | |

**Visual:** Left = heading + 3-step process (Calendar, Video, MessageCircle icons). Right = image.
**Steps are hardcoded:** 1. Book Online, 2. Consultation, 3. Get Prescription.
**Best for:** Explaining a process, medical consultation flow.

---

## Navigation

### NavDark
Floating glassmorphic dark bar with dual CTAs and shrink-on-scroll.

**Config (via defaults.json navigation):**
- `links[]` — nav link items
- `cta` — primary CTA: `{ label, href }` (glass pill style)
- `cta2` — secondary CTA: `{ label, href }` (glass pill style)
- `showCart` — boolean (default true)

**Default links:** `["/conditions", "/products", "/the-wire", "/about", "/contact"]`
**Default cta:** `{ "label": "Check Eligibility", "href": "/consultation" }`
**Default cta2:** `{ "label": "Patient Login", "href": "/login" }`

**Visual:** Fixed with margin from edges, rounded corners (16px→12px on scroll), dark sage backdrop (rgba(42,61,58)), backdrop-filter blur. Logo + brand shrink on scroll. Uppercase brand text.
**Best for:** Premium, luxury, medical authority, dark themes.

### NavTransparent
Invisible nav that materializes on scroll.

**Config (via defaults.json navigation):**
- `links[]`, `cta: { label, href }`

**Visual:** Initially transparent with white text. On scroll (80px threshold): bg appears, text color switches to heading color. Backdrop blur 12px.
**Best for:** Hero-forward designs, lifestyle, image-heavy. Lets the hero breathe.

### NavFull
Solid, professional nav with cart and CTA.

**Config (via defaults.json navigation):**
- `links[]`, `cta: { label, href }`
- `showCart` (implied)

**Visual:** Sticky, bg 0.95-0.98 opacity on scroll. Logo + links + cart + CTA button (primary bg).
**Best for:** E-commerce focused, professional, feature-rich.

### NavMinimal
Simple, clean nav with just links.

**Config (via defaults.json navigation):**
- `links[]`

**Visual:** Logo + business name on left, links on right. Mobile hamburger. Border-bottom.
**Best for:** Editorial, minimal, text-first brands.

---

## Footers

### FooterBrand
Premium branded footer with contact icons and leaf section headers.

**Config (via defaults.json footer):**
- `tagline`, `disclaimer`
- `sections[]` — link columns with `{ title, links[] }`
- Also reads `tenant.businessAddress` and `tenant.contactEmail`

**Default sections:** Company (`/about, /products, /the-wire, /contact`), Resources (`/consultation, /conditions, /faq`), Legal (`/privacy, /terms, /regulatory`)

**Visual:** Brand column (logo + tagline + MapPin address + Mail email), 3 link columns with Leaf icon headers, disclaimer, copyright bar.
**Best for:** Established brands, premium, full contact info.

### FooterFull
Multi-section footer with brand column and link columns.

**Config (via defaults.json footer):**
- `tagline`, `disclaimer`
- `sections[]`

**Default sections:** Quick Links (`/products, /about, /the-wire, /contact`), Support (`/faq, /consultation, /conditions`), Legal (`/privacy, /terms, /regulatory`)

**Visual:** Brand column (col-span-2) + 3 link columns. "Powered by BudStacks" in bottom bar. Dark bg.
**Best for:** Feature-rich sites, standard professional footer.

### FooterSimple
Minimal footer with just copyright and links.

**Config (via defaults.json footer):**
- `links[]`

**Default links:** `["/privacy", "/terms", "/contact"]`

**Visual:** Single line, copyright left, 3 links right. Border-top.
**Best for:** Minimal sites, editorial, clean designs.

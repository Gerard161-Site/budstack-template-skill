# Assets Pipeline

> **Purpose.** Every image, video, and logo a template references gets uploaded to the tenant's S3 prefix and referenced by path in `layout.json` / `defaults.json`. The platform signs URLs at render time and strips signing query strings before save. Generators must follow the asset-key contract or files won't load and the editor's image uploaders won't recognise the slot.
>
> **Source of truth.** `nextjs_space/lib/types/template-layout.ts::SECTION_ASSET_KEYS` and the S3 signing logic in `app/api/tenant-admin/branding/route.ts`.

---

## 1. The Seven Asset Keys

`SECTION_ASSET_KEYS` (single source of truth) — only these keys, anywhere they appear in section configs, get S3-signed at render and stripped on save:

| Key | Purpose | Typical sections |
|---|---|---|
| `imageUrl` | Primary section image | All heroes, ImageShowcase, FeatureGrid items, Gallery items, Testimonial images |
| `imageUrl2` | Secondary image | HeroSplit (right), HeroCollage (second tile), FeaturesShowcase |
| `imageUrl3` | Tertiary image | HeroCollage (third tile), gallery overflow |
| `videoUrl` | Hero/showcase video | HeroVideo, VideoGallery, video-backed sections |
| `watermarkUrl` | Faint watermark/overlay logo | Hero overlays, branded backgrounds |
| `rightImageUrl` | Right-side image | HeroSplit, ContentImage |
| `backgroundImageUrl` | Full-bleed background image | HeroFullScreen, Parallax, sections with bg-image |

**Don't invent new keys.** If a section needs a new image slot, the schema in `section-schemas.ts` AND `SECTION_ASSET_KEYS` must both be updated in the codebase first — generators can only use the existing seven.

---

## 2. Path-Only URLs (No Query Strings)

Every value for an asset key must be a **path-only string**:

```jsonc
// CORRECT — relative to the template folder; the file is assets/hero.jpg
{ "imageUrl": "assets/hero.jpg" }

// WRONG — a value that starts with "/" is not resolved against the template's
// files. The browser asks the storefront itself for it and gets nothing.
{ "imageUrl": "/uploads/healingbuds/hero-1.jpg" }

// WRONG — query string would be stripped on save, breaking signing
{ "imageUrl": "assets/hero.jpg?X-Amz-Signature=abc123" }

// WRONG — the platform uses relative paths into the tenant prefix
{ "imageUrl": "https://s3.eu-west-1.amazonaws.com/budstack-uploads/development/tenants/abc/templates/healingbuds/hero.jpg" }
```

The signing layer resolves a relative path against the store's copy of the template and signs it at render time (`lib/templates/sign-layout-assets.ts`: only values that start with neither `/` nor `http` are signed). Hard-coded full URLs bypass signing and become broken links the moment the bucket policy changes.

**Path conventions:**

```
assets/{section-name}-{role}.{ext}
```

- `hero-1.jpg` → first hero image
- `hero-1-bg.jpg` → first hero background
- `gallery-strain-og-kush.jpg` → gallery item, named after content
- `logo.png` → the template's logo (referenced by `defaults.json.logoPath` as `assets/logo.png`, NOT a section asset key)

---

## 3. Required Image Dimensions

Every image a template ships should **meet these dimensions**, so it holds up at desktop width:

| Section / role | Recommended dimensions | Aspect | Format |
|---|---|---|---|
| Hero (full-screen) `backgroundImageUrl` | 1920×1080 min, 2560×1440 ideal | 16:9 | JPG (≥80%) or WebP |
| Hero (split) `imageUrl` / `rightImageUrl` | 1200×1200 min, 1500×1500 ideal | 1:1 or 4:5 | JPG/WebP |
| Hero (video) `videoUrl` | 1920×1080 H.264 MP4 | 16:9 | MP4, ≤8MB, 8s loop |
| Image showcase (single) `imageUrl` | 1200×800 min, 1600×1067 ideal | 3:2 | JPG/WebP |
| Gallery item `imageUrl` | 800×800 min, 1200×1200 ideal | 1:1 | JPG/WebP |
| Feature/value-prop card `imageUrl` (icon-style) | 400×400 (icon) or 800×600 (illustration) | 1:1 or 4:3 | PNG (transparent) or SVG |
| Testimonial avatar `imageUrl` | 200×200 min | 1:1 | JPG/WebP |
| Logo `logoUrl` (top-level) | 400×400 ideal, 800×800 max | 1:1 (square crop) | **PNG with transparency** |
| Favicon `faviconUrl` | 32×32 + 64×64 (multi-resolution) | 1:1 | PNG or ICO |
| Watermark `watermarkUrl` | 600×600, very low opacity | 1:1 | PNG with transparency |

---

## 4. Format Guidance

| Format | Use | Avoid |
|---|---|---|
| **WebP** | Default for all photographic content (heroes, galleries, showcases). 25–35% smaller than JPG at equivalent quality. | Logos, icons, anything needing transparency on Safari < 14 (already obsolete, but still). |
| **JPG** | Fallback for photographic content. Use ≥80% quality; below 75% banding becomes visible on gradients. | Anything with transparency, anything with sharp lines/text. |
| **PNG** | Logos, icons, watermarks, anything with transparency or hard edges. | Photographic content (10–20× larger than JPG/WebP). |
| **SVG** | Icons, illustrations, anything that needs to scale infinitely. | Photographic content. Only use SVGs from trusted sources or audited — they can carry script. |
| **MP4 (H.264)** | All video content. Universal browser support. Cap at 8s loop, ≤8MB total. | WebM (less universal), GIF (massive file size), AVI (decoding overhead). |

---

## 5. The Signing / Stripping Pipeline

### On render

1. The section's config holds `imageUrl: "assets/hero.jpg"`
2. The render layer resolves it under the store's copy of the template: `{store's template folder}/assets/hero.jpg`
3. AWS SDK presigns the URL with a 15-minute expiry signature
4. Component receives the signed URL and renders `<img src="https://...?X-Amz-Signature=...">`

### On save (editor → API)

1. Editor reads section config including the signed URL
2. Operator edits something else (text, colours, etc.)
3. Editor saves entire layout/defaults — but the signed URL is now stale
4. Save layer walks the config tree, finds keys in `SECTION_ASSET_KEYS`, **strips everything from `?` onwards**
5. Database stores path-only values

### On editor open (re-sign)

1. Editor loads layout/defaults from API
2. API walks config, finds asset keys, presigns each with a fresh 15-minute signature
3. Editor receives signed URLs, displays in image previews

**Generators emit path-only.** Never emit signed URLs. Never assume the URL the editor displays is the URL stored in S3.

---

## 6. Tenant S3 Path Architecture

```
budstack-uploads/
├── development/
│   └── tenants/
│       └── {tenantId}/
│           ├── logo.png
│           ├── favicon.png
│           └── templates/
│               └── {template-slug}/
│                   ├── layout.json
│                   ├── defaults.json
│                   ├── template.config.json
│                   ├── styles.css
│                   ├── hero-1.jpg
│                   ├── hero-1-bg.jpg
│                   ├── gallery-1.webp
│                   └── ...
└── production/
    └── tenants/...
```

- One template directory per (tenant × template) — there is **no fallback** to a base `templates/{slug}/` path. Each tenant owns a complete copy of every asset.
- During onboarding (and clone / blank-create), the platform copies the base template's complete asset tree into the tenant's prefix.
- Generators emit relative paths: the same `layout.json` works across tenants because the prefix is added at sign time.

---

## 7. Naming Conventions

```
{role}[-{variant}][-{descriptor}].{ext}
```

| Pattern | Example | Notes |
|---|---|---|
| `hero-{n}.{ext}` | `hero-1.jpg`, `hero-2.jpg` | Numbered when multiple heroes in one template |
| `hero-{n}-bg.{ext}` | `hero-1-bg.jpg` | Background distinct from foreground subject |
| `gallery-{slug}.{ext}` | `gallery-og-kush.webp` | Slug describes content |
| `feature-{role}.{ext}` | `feature-shield.png` | Icon-style features |
| `testimonial-{name}.{ext}` | `testimonial-maria.jpg` | Avatar, first-name slug |
| `logo.{ext}` | `logo.png`, `logo-mark.svg` | Always lowercase |
| `favicon.{ext}` | `favicon.png`, `favicon.ico` | Always lowercase |
| `watermark.{ext}` | `watermark.png` | Single per template |

**Rules:**
- Always lowercase
- Hyphens, never underscores or spaces
- ASCII-safe, no accented chars (Lisbon → `lisboa`, not `lisbôa`)
- Descriptive over numeric where possible (`gallery-strain-og-kush` > `gallery-7`)
- File extensions match the actual format

---

## 8. When the images have not been supplied

Do not reference a file that is not in the template's `assets/` folder: the validator fails the template, and the store would show a broken image.

1. **Say which images are missing**, with the slot, the minimum size and the format from §3, and ask for them.
2. **Until they arrive, leave the slot out.** Remove the key or the item; never use an empty string or a made-up path.
3. **Supply production sizes.** An operator replaces a file in place later; an 800×600 stand-in where a 1920×1080 image belongs looks broken at desktop width.

---

## 9. Compliance Considerations

For PT/UK/DE medical cannabis markets:

- **No imagery of recreational use** — no smoking, no rolling, no pipes, no parties. Even on lifestyle templates.
- **No imagery of plants in clearly recreational settings** — fine in cultivation/grow-room contexts, not fine in lounges or social settings.
- **Doctor / pharmacist imagery** must be authentic stock or licensed; never imply specific medical claims with photography (a smiling person + "feel better fast" is a regulatory red flag in the UK).
- **Patient imagery** — use diverse, age-appropriate models. Medical cannabis users span 30–80; templates that lean too young (or too high-end-fashion) misrepresent the market.
- **Strain imagery** — close-up flower / trichome photography is fine. Branded packaging is fine. Avoid imagery that emphasises THC content visually (purple-haze marketing aesthetic).

When in doubt, default to clinical/wellness photography over lifestyle/lounge photography for licensed-medical templates.

---

## 10. Audit Checklist

Before shipping a generated template:

- [ ] All asset values are path-only (no `?` query string anywhere in `layout.json` or `defaults.json`)
- [ ] Every asset value is `assets/<file>` (no leading slash) and the file is in the template's `assets/` folder — the validator checks both
- [ ] All keys in `SECTION_ASSET_KEYS` are populated with real paths or omitted (never empty string)
- [ ] No section uses an undocumented key for an image (e.g., `heroImage`, `bgImage`, `coverUrl` — all wrong)
- [ ] All file extensions match the format guidance above
- [ ] All filenames are lowercase, hyphenated, ASCII-safe
- [ ] No imagery violates compliance rules for the target market

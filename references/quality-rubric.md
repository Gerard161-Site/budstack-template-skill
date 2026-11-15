# Quality rubric

A template is reviewed against this page twice: when the design decisions are made (Phase 2), and on the rendered preview at 375, 768 and 1440px (Phase 7). The validator checks what a script can check; the rest is for you to look at and report.

"Validator" marks the items `scripts/validate-template.mjs` enforces. Errors block upload. Warnings must each be either fixed or justified in the final report.

## Type

| Rule | Checked by |
|---|---|
| At most two font families for body and headings, plus one optional accent | Validator (warning) |
| Hero heading 56–72px at desktop (`typography.fontSize.hero`) | Validator (warning) |
| Section headings 36–48px at desktop (`typography.fontSize.section`) | Validator (warning) |
| Every font is loaded: in `settings.googleFontsUrl`, or a catalogue id with no URL set | Validator (error) |
| On the preview: hero h1 is at least 56px at 1440 and at most 40px at 375 | You, on the screenshots |
| No heading wraps to a single orphaned word at 375 or 1440 | You, on the screenshots |

The platform scales headings down on small screens. Do not add CSS to size headings.

## Rhythm

| Rule | Checked by |
|---|---|
| At least two densities across the page | Validator (warning) |
| `compact` for thin bands (logos, stats, a trust strip); `spacious` for at most two sections | You |
| An eyebrow on at least half the sections that have a heading | Validator (warning) |
| One hero, first on the page | Validator (warning) |
| No two adjacent sections with the same background unless one is a thin band | You, on the screenshots |

## Colour and contrast

| Rule | Checked by |
|---|---|
| Text and headings at least 4.5:1 on the background and on the surface | Validator (error) |
| The same inside every `colorOverrides` | Validator (error) |
| One accent colour, used sparingly | You |
| Glass effect only on a palette designed for it | You |

Button labels cannot fail: the platform picks black or white for the label from the button colour. Do not design around a white label on a light brand colour.

## Imagery

| Rule | Checked by |
|---|---|
| No empty image or logo field | Validator (error) |
| Every referenced file is in `assets/` | Validator (error) |
| One photographic treatment across the template | You |
| Minimum sizes per slot (`design-brief.md` §5, `assets-pipeline.md`) | You |
| No stretched, cropped-through-the-subject or visibly upscaled image at any of the three widths | You, on the screenshots |

## Sections and variants

| Rule | Checked by |
|---|---|
| Every section type and config key exists in the contract | Validator (error) |
| At least one non-default `variant` on ValueProps, Features or Testimonials where the template uses them | You |
| The Dr Green partner mark is present; `compact` where the footer design calls for restraint | Validator (it cannot be removed) |
| At most one animated or shader hero | You |

## Copy

| Rule | Checked by |
|---|---|
| No medical claims: nothing that says the product cures, treats or is the best | You (`copy-style-cannabis.md`) |
| Calls to action are about eligibility and consultation, not buying | You |
| Real copy for the brand in every field: no placeholder or sample text | You |
| A footer disclaimer for the brand's market | You |

## CSS

| Rule | Checked by |
|---|---|
| `styles.css` is at most 120 lines, with no `!important`, `@apply`, `@tailwind`, `theme()` or `--tenant-color-*` | Validator (error) |
| Every selector starts with `.template-{slug}` and none targets a Tailwind utility class | Validator (error) |

Most v2 templates need fewer than 30 lines. If you are writing more, the thing you want is probably a design token or a `colorOverrides`.

## Variety

Variety is a tie-breaker, not a goal. Choose the archetype, hero and section order that fit the brand. When two choices fit equally well, take the one the existing templates use less.

## What the final report must list

1. The validator result: zero errors, and each warning with what was done about it.
2. The three screenshots reviewed, and for each rubric row marked "You": pass, or what was changed.
3. Anything the design asked for that the section library could not do.

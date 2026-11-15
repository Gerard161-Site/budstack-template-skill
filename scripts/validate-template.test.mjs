/**
 * Tests for the template validator. Run with:  node --test scripts/
 *
 * Each test writes a small template into a temporary folder, changes one
 * thing, and checks the validator's verdict. The starting template is a
 * complete, valid Template Design System v2 template.
 */
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { contrastRatio, readableOn } from "./lib/contrast.mjs";
import { validateJsonSchema } from "./lib/json-schema.mjs";
import { loadContract, validateTemplate } from "./lib/validate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const contract = loadContract(join(here, "..", "references", "contract"));
const created = [];

after(() => {
  for (const dir of created) rmSync(dir, { recursive: true, force: true });
});

const SLUG = "test-clinic";

function validTemplate() {
  return {
    config: { id: SLUG, slug: SLUG, name: "Test Clinic", version: "1.0.0" },
    layout: {
      version: 1,
      navigation: "NavMinimal",
      footer: "FooterBrand",
      footerConfig: { partnerMark: "compact", disclaimer: "Prescription-only medicine." },
      settings: {
        wrapperClass: `template-${SLUG}`,
        googleFontsUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&family=Fraunces:wght@600&display=swap",
      },
      sections: [
        { id: "hero", type: "HeroSplit", config: { eyebrow: "Clinic", title: "Care, prescribed", imageUrl: "assets/hero.jpg" } },
        { id: "values", type: "ValueProps", config: { eyebrow: "Why us", heading: "Built on evidence", variant: "bordered", density: "spacious" } },
        { id: "stats", type: "Stats", config: { heading: "In numbers" } },
        { id: "faq", type: "FAQ", config: { eyebrow: "Questions", heading: "Before you start" } },
        { id: "cta", type: "CTABanner", config: { heading: "Check eligibility", colorOverrides: undefined } },
      ],
    },
    defaults: {
      slug: SLUG,
      logoPath: "assets/logo.png",
      designSystem: {
        schemaVersion: 2,
        colors: {
          primary: "210 78% 22%",
          secondary: "205 55% 48%",
          accent: "196 75% 30%",
          background: "210 25% 98%",
          text: "210 20% 28%",
          heading: "210 50% 12%",
        },
        typography: {
          fontFamily: { body: "'Plus Jakarta Sans', system-ui, sans-serif", heading: "'Fraunces', Georgia, serif" },
          fontSize: { base: "16", hero: "64", section: "40" },
        },
        borderRadius: { container: "large", button: "pill" },
        shadows: { card: "soft", tint: "brand" },
      },
    },
    css: `.template-${SLUG} [data-section-type="HeroSplit"] {\n  background: hsl(var(--tenant-color-surface));\n}\n`,
    assets: ["hero.jpg", "logo.png"],
  };
}

function check(mutate) {
  const template = validTemplate();
  if (mutate) mutate(template);
  const dir = mkdtempSync(join(tmpdir(), "budstacks-template-"));
  created.push(dir);
  mkdirSync(join(dir, "assets"));
  for (const asset of template.assets) writeFileSync(join(dir, "assets", asset), "x");
  writeFileSync(join(dir, "template.config.json"), JSON.stringify(template.config));
  writeFileSync(join(dir, "layout.json"), JSON.stringify(template.layout));
  writeFileSync(join(dir, "defaults.json"), JSON.stringify(template.defaults));
  writeFileSync(join(dir, "styles.css"), template.css);
  return validateTemplate(dir, contract);
}

function assertError(result, fragment) {
  assert.ok(
    result.errors.some((error) => error.includes(fragment)),
    `expected an error containing ${JSON.stringify(fragment)}, got:\n  ${result.errors.join("\n  ") || "(none)"}`,
  );
}

describe("a valid v2 template", () => {
  it("passes with no errors and no warnings", () => {
    const result = check();

    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.warnings, []);
    assert.equal(result.slug, SLUG);
  });
});

describe("layout.json", () => {
  it("rejects an unknown section type", () => {
    assertError(check((t) => { t.layout.sections[1].type = "MegaHero"; }), '"MegaHero" is not a section type');
  });

  it("rejects a config key the section does not read", () => {
    assertError(check((t) => { t.layout.sections[1].config.animation = "fade"; }), "config.animation: ValueProps does not read this key");
  });

  it("rejects a select value outside its options", () => {
    assertError(check((t) => { t.layout.sections[1].config.variant = "glass"; }), '"glass" is not one of card | bordered | plain');
  });

  it("rejects an empty image, at the top level and inside an item", () => {
    assertError(check((t) => { t.layout.sections[0].config.imageUrl = ""; }), "config.imageUrl: empty image");
    assertError(
      check((t) => { t.layout.sections.push({ id: "logos", type: "LogoMarquee", config: { logos: [{ name: "A", src: "" }] } }); }),
      "logos[0].src: empty image",
    );
  });

  it("rejects scaffold placeholders left in any file", () => {
    assertError(check((t) => { t.layout.sections[0].config.title = "{{HERO_TITLE}}"; }), "layout.sections[0].config.title: unfilled placeholder {{HERO_TITLE}}");
    assertError(
      check((t) => { t.defaults.pageContent = { about: { heroSubtitle: "About {{BUSINESS_NAME}}" } }; }),
      "defaults.pageContent.about.heroSubtitle: unfilled placeholder {{BUSINESS_NAME}}",
    );
  });

  it("rejects an asset that is not in the folder", () => {
    assertError(check((t) => { t.layout.sections[0].config.imageUrl = "assets/missing.jpg"; }), "assets/missing.jpg is not in the template folder");
  });

  it("rejects density on a section that keeps its own padding", () => {
    assertError(check((t) => { t.layout.sections[0].config.density = "compact"; }), "HeroSplit does not read this key");
  });

  it("rejects an unknown nav or footer, and unknown chrome config keys", () => {
    assertError(check((t) => { t.layout.navigation = "NavMega"; }), 'layout.navigation: "NavMega" is not one of');
    assertError(check((t) => { t.layout.footerConfig.newsletter = true; }), "footerConfig.newsletter: the footer does not read this key");
  });

  it("does not let the partner mark be switched off", () => {
    assertError(check((t) => { t.layout.footerConfig.partnerMark = "none"; }), 'footerConfig.partnerMark: "none" is not one of full | compact');
  });

  it("rejects a colour override key the runtime does not read", () => {
    assertError(check((t) => { t.layout.sections[2].colorOverrides = { muted: "0 0% 50%" }; }), "colorOverrides.muted: not a colour the runtime reads");
  });

  it("requires unique section ids and the template's wrapper class", () => {
    assertError(check((t) => { t.layout.sections[3].id = "hero"; }), "ids must be unique");
    assertError(check((t) => { t.layout.settings.wrapperClass = "template-other"; }), 'wrapperClass: must be "template-test-clinic"');
  });
});

describe("defaults.json — design system", () => {
  it("rejects a template that is not on v2", () => {
    assertError(check((t) => { delete t.defaults.designSystem.schemaVersion; }), "schemaVersion: must be 2");
  });

  it("rejects tokens the runtime ignores, by name", () => {
    const result = check((t) => {
      t.defaults.designSystem.gradients = { primary: "linear-gradient(red, blue)" };
      t.defaults.designSystem.typography.headingFont = "'Fraunces', serif";
      t.defaults.designSystem.borderRadius.sm = "0.25rem";
    });

    assertError(result, "designSystem.gradients: not read by the runtime");
    assertError(result, "designSystem.typography.headingFont: not read by the runtime");
    assertError(result, "designSystem.borderRadius.sm: not read by the runtime");
  });

  it("rejects hex colours and off-list values", () => {
    assertError(check((t) => { t.defaults.designSystem.colors.primary = "#0f4c2e"; }), "designSystem.colors.primary");
    assertError(check((t) => { t.defaults.designSystem.shadows.card = "0 1px 2px black"; }), "designSystem.shadows.card");
  });

  it("rejects a font that is not loaded", () => {
    assertError(
      check((t) => { t.defaults.designSystem.typography.fontFamily.heading = "'Geist', sans-serif"; }),
      '"Geist" is not in layout.settings.googleFontsUrl',
    );
  });

  it("accepts a catalogue font id when the layout loads no fonts of its own", () => {
    const result = check((t) => {
      t.defaults.designSystem.typography.fontFamily = { body: "inter", heading: "playfair" };
      delete t.layout.settings.googleFontsUrl;
    });

    assert.deepEqual(result.errors, []);
  });

  it("rejects text that cannot be read on the background", () => {
    assertError(check((t) => { t.defaults.designSystem.colors.text = "210 20% 70%"; }), "text on background contrast is");
  });

  it("checks contrast inside a section's colour override", () => {
    assertError(
      check((t) => { t.layout.sections[2].colorOverrides = { background: "210 50% 12%" }; }),
      "layout.sections[2].colorOverrides: text on background contrast is",
    );
  });

  it("never fails the button label: the platform picks black or white", () => {
    const result = check((t) => { t.defaults.designSystem.colors.primary = "48 95% 55%"; });

    assert.ok(!result.errors.some((error) => error.includes("button label")));
    assert.equal(readableOn("48 95% 55%"), "0 0% 0%");
  });
});

describe("styles.css", () => {
  const css = (text) => (t) => { t.css = text; };

  it("rejects !important, @tailwind, @apply, theme() and colour declarations", () => {
    assertError(check(css(`.template-${SLUG} h1 { color: red !important; }`)), "!important");
    assertError(check(css(`@tailwind base;`)), "@tailwind");
    assertError(check(css(`.template-${SLUG} .x { @apply flex; }`)), "@apply");
    assertError(check(css(`.template-${SLUG} .x { color: theme(colors.red.500); }`)), "theme()");
    assertError(check(css(`.template-${SLUG} { --tenant-color-primary: 1 2% 3%; }`)), "--tenant-color-* declaration");
  });

  it("rejects a selector that is not scoped to the template", () => {
    assertError(check(css(`h1 { letter-spacing: 0; }`)), 'selector "h1" must start with .template-test-clinic');
    assertError(check(css(`:root { --x: 1; }`)), 'selector ":root" must start with');
  });

  it("rejects selectors that target Tailwind utilities or class substrings", () => {
    assertError(check(css(`.template-${SLUG} .rounded-full { border-radius: 0; }`)), "targets a Tailwind utility class");
    assertError(check(css(`.template-${SLUG} [class*="shadow"] { box-shadow: none; }`)), "matches by class-name substring");
  });

  it("accepts scoped rules inside @media and ignores @keyframes steps", () => {
    const result = check(
      css(`@media (min-width: 768px) {\n  .template-${SLUG} [data-ui~="card"] { padding: 2rem; }\n}\n@keyframes drift {\n  0% { opacity: 0; }\n  100% { opacity: 1; }\n}\n`),
    );

    assert.deepEqual(result.errors, []);
  });

  it("rejects more than 120 lines", () => {
    assertError(check(css(`.template-${SLUG} .a { color: red; }\n`.repeat(121))), "limited to 120");
  });
});

describe("rubric warnings", () => {
  it("warns when fewer than half the headed sections have an eyebrow", () => {
    const result = check((t) => { for (const section of t.layout.sections) delete section.config.eyebrow; });

    assert.deepEqual(result.errors, []);
    assert.ok(result.warnings.some((warning) => warning.startsWith("eyebrows:")));
  });

  it("warns when the hero size is outside 56 to 72", () => {
    const result = check((t) => { t.defaults.designSystem.typography.fontSize.hero = "44"; });

    assert.ok(result.warnings.some((warning) => warning.includes("hero size 44px")));
  });
});

describe("building blocks", () => {
  it("computes WCAG contrast", () => {
    assert.equal(Math.round(contrastRatio("0 0% 0%", "0 0% 100%")), 21);
    assert.equal(contrastRatio("not a colour", "0 0% 100%"), null);
  });

  it("refuses a schema keyword it does not implement", () => {
    assert.throws(() => validateJsonSchema({ type: "string", format: "email" }, "a"), /keyword "format"/);
  });
});

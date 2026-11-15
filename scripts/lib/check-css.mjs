/**
 * styles.css checks. A v2 template needs very little CSS: the platform styles
 * headings, buttons, cards and spacing from the design system. What is left
 * must be scoped to the template and must not fight the platform.
 */
const MAX_LINES = 120;
const TAILWIND_UTILITY =
  /\.(?:container|flex|grid|hidden|block|relative|absolute|sticky|(?:sm|md|lg|xl|2xl|hover|focus|group-hover)\\:|(?:text|bg|p[xytblr]?|m[xytblr]?|gap|rounded|shadow|w|h|min-w|min-h|max-w|max-h|font|tracking|leading|border|items|justify|opacity|z|top|left|right|bottom|inset|col|row|space-[xy])-[a-z0-9[\]\/.%-]+)(?![\w-])/;

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "));
}

/** Top-level-ish rules as { selectors, line }, descending into @media/@supports. */
function selectorsOf(css) {
  const found = [];
  let depth = 0;
  let buffer = "";
  let line = 1;
  let bufferLine = 1;
  const keyframeDepths = [];
  for (const char of css) {
    if (char === "\n") line += 1;
    if (char === "{") {
      const head = buffer.trim();
      if (head.startsWith("@keyframes") || head.startsWith("@font-face")) keyframeDepths.push(depth);
      else if (!head.startsWith("@") && keyframeDepths.length === 0 && head !== "") {
        found.push({ selectors: head.split(/,(?![^()]*\))/).map((selector) => selector.trim()), line: bufferLine });
      }
      depth += 1;
      buffer = "";
      bufferLine = line;
    } else if (char === "}") {
      depth -= 1;
      if (keyframeDepths.length > 0 && keyframeDepths[keyframeDepths.length - 1] === depth) keyframeDepths.pop();
      buffer = "";
      bufferLine = line;
    } else if (char === ";") {
      buffer = "";
      bufferLine = line;
    } else {
      if (buffer.trim() === "" && char.trim() !== "") bufferLine = line;
      buffer += char;
    }
  }
  return found;
}

export function checkCss(rawCss, slug) {
  const errors = [];
  const warnings = [];
  if (typeof rawCss !== "string" || rawCss.trim() === "") return { errors, warnings };

  const lines = rawCss.split("\n").length;
  if (lines > MAX_LINES) errors.push(`styles.css: ${lines} lines — a v2 template is limited to ${MAX_LINES}`);

  const css = stripComments(rawCss);
  const banned = [
    [/!important/, "!important"],
    [/@tailwind\b/, "@tailwind (the file is injected as it is; Tailwind never processes it)"],
    [/@apply\b/, "@apply (the file is injected as it is; Tailwind never processes it)"],
    [/\btheme\(/, "theme() (the file is injected as it is; Tailwind never processes it)"],
    [/--tenant-color-[a-z-]+\s*:/, "a --tenant-color-* declaration (colours come from designSystem.colors; the platform strips these)"],
    [/@import\b/, "@import (load fonts with layout.settings.googleFontsUrl)"],
  ];
  css.split("\n").forEach((text, index) => {
    for (const [pattern, name] of banned) {
      if (pattern.test(text)) errors.push(`styles.css:${index + 1}: ${name}`);
    }
  });

  const scopes = [`.template-${slug}`, `.tenant-theme-container .template-${slug}`];
  for (const rule of selectorsOf(css)) {
    for (const selector of rule.selectors) {
      const scoped = scopes.some((scope) => selector === scope || selector.startsWith(`${scope} `) || selector.startsWith(`${scope}:`) || selector.startsWith(`${scope}.`) || selector.startsWith(`${scope}[`) || selector.startsWith(`${scope}>`));
      if (!scoped) errors.push(`styles.css:${rule.line}: selector "${selector}" must start with .template-${slug}`);
      if (selector.includes("[class*=")) errors.push(`styles.css:${rule.line}: selector "${selector}" matches by class-name substring`);
      else if (TAILWIND_UTILITY.test(selector.replace(`.template-${slug}`, ""))) {
        errors.push(`styles.css:${rule.line}: selector "${selector}" targets a Tailwind utility class — style by section instead ([data-section-type="…"], [data-ui~="…"])`);
      }
    }
  }
  return { errors, warnings };
}

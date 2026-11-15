/**
 * Colour maths for the validator. The same formulas as the platform's
 * lib/theme/tenant-tokens.ts (WCAG relative luminance and contrast ratio; the
 * luminance at which black and white contrast equally), so a palette that
 * passes here is one the storefront will not have to correct.
 */
const CHANNELS = /^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/;
const LUMINANCE_SWITCH = 0.179;

export const WHITE = "0 0% 100%";
export const BLACK = "0 0% 0%";
export const AA_TEXT = 4.5;

/** Raw HSL channels ("178 48% 21%") → [r, g, b] in 0..255, or null. */
export function toRgb(channels) {
  const match = typeof channels === "string" ? CHANNELS.exec(channels.trim()) : null;
  if (!match) return null;
  const h = Number(match[1]) / 360;
  const s = Number(match[2]) / 100;
  const l = Number(match[3]) / 100;
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue = (t) => {
    const x = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255];
}

function linear(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(channels) {
  const rgb = toRgb(channels);
  if (!rgb) return null;
  return 0.2126 * linear(rgb[0]) + 0.7152 * linear(rgb[1]) + 0.0722 * linear(rgb[2]);
}

/** WCAG contrast ratio, 1 to 21; null when either colour cannot be read. */
export function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la === null || lb === null) return null;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** The label colour the platform puts on `background`: black or white. */
export function readableOn(background) {
  const luminance = relativeLuminance(background);
  return luminance !== null && luminance > LUMINANCE_SWITCH ? BLACK : WHITE;
}

/** The card colour the platform derives when a palette sets no `surface`. */
export function derivedSurface(background) {
  const luminance = relativeLuminance(background);
  if (luminance === null || luminance > LUMINANCE_SWITCH) return WHITE;
  const rgb = toRgb(background).map((channel) => channel + (255 - channel) * 0.07);
  return rgbToChannels(rgb);
}

function rgbToChannels([r, g, b]) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return `0 0% ${Math.round(l * 100)}%`;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === rr) h = (gg - bb) / d + (gg < bb ? 6 : 0);
  else if (max === gg) h = (bb - rr) / d + 2;
  else h = (rr - gg) / d + 4;
  return `${Math.round((h / 6) * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

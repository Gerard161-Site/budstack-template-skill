/**
 * BudStack Template Generator - Helper Functions
 *
 * Utility functions for:
 * - HEX to HSL conversion
 * - Color scale generation
 * - Template customization
 */

/**
 * Convert HEX color to HSL format (no hsl() wrapper)
 *
 * @param hex - HEX color string (with or without #)
 * @returns HSL string in format "HUE SAT% LIGHT%"
 *
 * @example
 * hexToHSL("#3B82F6") // Returns "217 91% 60%"
 * hexToHSL("FF6B6B")  // Returns "0 58% 71%"
 */
export function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Validate hex
  if (!/^[0-9A-F]{6}$/i.test(hex)) {
    throw new Error(`Invalid HEX color: ${hex}`);
  }

  // Convert to RGB (0-1 range)
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

/**
 * Convert HSL to RGB (for shadow calculations)
 *
 * @param hsl - HSL string in format "HUE SAT% LIGHT%"
 * @returns RGB object {r, g, b}
 */
export function hslToRGB(hsl: string): { r: number; g: number; b: number } {
  const [h, s, l] = hsl.split(' ').map((v, i) => {
    const num = parseFloat(v);
    return i === 0 ? num : num / 100;
  });

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Generate full color scale (50-900) from base HSL color
 *
 * @param baseHSL - Base HSL color in format "HUE SAT% LIGHT%"
 * @returns Object with color scale (50-900)
 *
 * @example
 * generateColorScale("217 91% 60%")
 * // Returns:
 * // {
 * //   "50": "217 91% 97%",
 * //   "100": "217 91% 92%",
 * //   ...
 * //   "500": "217 91% 60%",
 * //   ...
 * //   "900": "217 91% 20%"
 * // }
 */
export function generateColorScale(baseHSL: string): Record<string, string> {
  const [h, sStr, lStr] = baseHSL.split(' ');
  const s = parseInt(sStr);
  const l = parseInt(lStr);

  return {
    "50": `${h} ${Math.min(s + 10, 100)}% 97%`,
    "100": `${h} ${Math.min(s + 5, 100)}% 92%`,
    "200": `${h} ${s}% 82%`,
    "300": `${h} ${s}% 72%`,
    "400": `${h} ${Math.max(s - 5, 0)}% ${Math.min(l + 5, 95)}%`,
    "500": `${h} ${s}% ${l}%`,  // Base color
    "600": `${h} ${s}% ${Math.max(l - 10, 10)}%`,
    "700": `${h} ${Math.min(s + 5, 100)}% ${Math.max(l - 20, 10)}%`,
    "800": `${h} ${Math.min(s + 10, 100)}% ${Math.max(l - 30, 10)}%`,
    "900": `${h} ${Math.min(s + 15, 100)}% ${Math.max(l - 40, 10)}%`
  };
}

/**
 * Generate shadows using brand color
 *
 * @param hsl - Brand HSL color
 * @returns Object with shadow definitions
 */
export function generateShadows(hsl: string): Record<string, string> {
  const rgb = hslToRGB(hsl);
  const { r, g, b } = rgb;

  return {
    "theme-sm": `0 2px 8px rgba(${r}, ${g}, ${b}, 0.08)`,
    "theme-md": `0 4px 16px rgba(${r}, ${g}, ${b}, 0.12)`,
    "theme-lg": `0 8px 32px rgba(${r}, ${g}, ${b}, 0.16)`,
    "theme-xl": `0 12px 48px rgba(${r}, ${g}, ${b}, 0.20)`,
    "theme-2xl": `0 20px 64px rgba(${r}, ${g}, ${b}, 0.24)`
  };
}

/**
 * Generate gradients using brand color
 *
 * @param hsl - Brand HSL color
 * @returns Object with gradient definitions
 */
export function generateGradients(hsl: string): Record<string, string> {
  const [h, s, l] = hsl.split(' ').map((v, i) => {
    return i === 0 ? parseInt(v) : v;
  });

  const darkerL = `${Math.max(parseInt(l) - 20, 10)}%`;
  const lighterL = `${Math.min(parseInt(l) + 20, 95)}%`;

  const rgb = hslToRGB(hsl);
  const { r, g, b } = rgb;

  return {
    "primary": `linear-gradient(135deg, hsl(${h} ${s} ${l}) 0%, hsl(${h} ${s} ${darkerL}) 100%)`,
    "secondary": `linear-gradient(135deg, hsl(${h} ${s} ${darkerL}) 0%, hsl(${h} ${s} ${lighterL}) 100%)`,
    "hero-overlay": `linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.6) 0%, rgba(${r}, ${g}, ${b}, 0.8) 100%)`,
    "card-hover": `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.1) 0%, rgba(${r}, ${g}, ${b}, 0.05) 100%)`
  };
}

/**
 * Slugify template name
 *
 * @param name - Template display name
 * @returns Kebab-case slug
 *
 * @example
 * slugify("Ocean Wellness") // Returns "ocean-wellness"
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validate HEX color
 *
 * @param hex - HEX color string
 * @returns boolean
 */
export function isValidHex(hex: string): boolean {
  hex = hex.replace('#', '');
  return /^[0-9A-F]{6}$/i.test(hex);
}

/**
 * Get complementary color (opposite on color wheel)
 *
 * @param hsl - HSL color
 * @returns Complementary HSL color
 */
export function getComplementaryColor(hsl: string): string {
  const [h, s, l] = hsl.split(' ');
  const hue = parseInt(h);
  const complementaryHue = (hue + 180) % 360;

  return `${complementaryHue} ${s} ${l}`;
}

/**
 * Get analogous colors (adjacent on color wheel)
 *
 * @param hsl - HSL color
 * @returns Array of 2 analogous HSL colors
 */
export function getAnalogousColors(hsl: string): [string, string] {
  const [h, s, l] = hsl.split(' ');
  const hue = parseInt(h);

  return [
    `${(hue + 30) % 360} ${s} ${l}`,
    `${(hue - 30 + 360) % 360} ${s} ${l}`
  ];
}

/**
 * Get triadic colors (120° apart on color wheel)
 *
 * @param hsl - HSL color
 * @returns Array of 2 triadic HSL colors
 */
export function getTriadicColors(hsl: string): [string, string] {
  const [h, s, l] = hsl.split(' ');
  const hue = parseInt(h);

  return [
    `${(hue + 120) % 360} ${s} ${l}`,
    `${(hue + 240) % 360} ${s} ${l}`
  ];
}

// Example usage:
if (require.main === module) {
  console.log('BudStack Template Generator - Helper Functions\n');

  // Test HEX to HSL conversion
  const testHex = '#3B82F6';
  const hsl = hexToHSL(testHex);
  console.log(`HEX: ${testHex} → HSL: ${hsl}`);

  // Test color scale generation
  const scale = generateColorScale(hsl);
  console.log('\nColor Scale:');
  Object.entries(scale).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  // Test shadows
  const shadows = generateShadows(hsl);
  console.log('\nShadows:');
  Object.entries(shadows).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  // Test gradients
  const gradients = generateGradients(hsl);
  console.log('\nGradients:');
  Object.entries(gradients).forEach(([key, value]) => {
    console.log(`  ${key}: ${value.substring(0, 60)}...`);
  });
}

# BudStack Template Generator Skill

**Purpose**: Generate new BudStack templates by cloning and customizing a baseline template.

**Approach**: Clone → Customize → Output (not generate from scratch)

---

## How This Skill Works

When user requests a new BudStack template:

1. **Gather Requirements** - Ask user for customization details
2. **Clone Base Template** - Copy reference template as starting point
3. **Customize Clone** - Replace colors, fonts, content, assets
4. **Generate Files** - Output customized template files
5. **Create New Repo** - Save to new directory (e.g., `client-template/`)

**Why this approach?**
- ✅ Faster (minutes vs hours)
- ✅ More reliable (proven baseline)
- ✅ Less error-prone (known working code)
- ✅ Consistent quality (follows standards)

---

## Skill Invocation

**User says:**
- "Create a new BudStack template"
- "Generate a BudStack template for [ClientName]"
- "I need a new template"
- "Make me a template"

**Skill activates and starts workflow.**

---

## Workflow

### Step 1: Gather Requirements

Ask the user these questions (use AskUserQuestion tool):

#### Q1: Template Name
**Question:** "What should we name this template?"
**Input:** Text input (kebab-case preferred)
**Example:** `ocean-wellness`, `urban-cannabis`, `sunset-medical`

#### Q2: Color Palette
**Question:** "What's your primary brand color? (HEX format)"
**Input:** HEX color (e.g., #3B82F6)
**Note:** We'll generate full HSL palette from this

**Optional:** "Any secondary or accent colors?"

#### Q3: Font Selection
**Question:** "Which font pairing do you prefer?"
**Options:**
- Professional: Plus Jakarta Sans + Archivo Narrow
- Organic: Lora + Montserrat
- Modern: Inter + Montserrat
- Elegant: Cormorant + Lato
- Custom: Let user specify

#### Q4: Style Direction
**Question:** "What style direction?"
**Options:**
- Medical/Professional (use healingbuds as base)
- Wellness/Organic (use wellness-nature as base)
- Modern/Bold (use gta-cannabis as base)
- Custom (use template-design as base)

#### Q5: Assets (Optional)
**Question:** "Do you have assets ready?"
- Logo (image file path or URL)
- Hero image (image file path or URL)
- If no: Use placeholders

### Step 2: Select Base Template

Based on style direction, select reference:

```
Medical/Professional → clone from healingbuds-template
Wellness/Organic → clone from wellness-nature-template
Modern/Bold → clone from gta-cannabis-template
Custom → clone from template-design baseline
```

**Base template location:**
- Local: `/Users/gkavanagh/Development/HealingBuds/templates/[template-name]/`
- Or reference from main repo

### Step 3: Clone Base Template

**Action:**
```bash
# Create new directory for template
mkdir -p /Users/gkavanagh/Development/HealingBuds/templates/[new-template-name]

# Copy base template files
cp -r /Users/gkavanagh/Development/HealingBuds/templates/[base-template]/* \
     /Users/gkavanagh/Development/HealingBuds/templates/[new-template-name]/
```

### Step 4: Convert HEX to HSL

User provides HEX color → Convert to HSL format:

**Conversion:**
```
HEX → RGB → HSL (no hsl() wrapper)

Example:
#3B82F6 → rgb(59, 130, 246) → 217 91% 60%
```

Generate full color scale (50-900):

```javascript
// Pseudo-code for scale generation
baseHue = 217
baseSat = 91%

scale = {
  "50": "217 91% 97%",   // Very light
  "100": "217 91% 92%",
  "200": "217 91% 82%",
  "300": "217 91% 72%",
  "400": "217 91% 66%",
  "500": "217 91% 60%",  // Base color
  "600": "217 91% 50%",
  "700": "217 91% 40%",
  "800": "217 91% 30%",
  "900": "217 91% 20%"   // Very dark
}
```

### Step 5: Customize Files

**Replace in all files:**

#### 5.1: Template Slug/ID
Find: `healingbuds` (or base template slug)
Replace: `new-template-slug`

**Files:**
- index.tsx: className
- template.config.json: id, slug, name
- defaults.json: template, slug
- styles.css: class names

#### 5.2: Colors (HSL)
Find: Base template colors
Replace: New HSL colors

**Files to update:**
- `defaults.json`:
  - `primaryColor`: "HUE SAT% LIGHT%"
  - `designSystem.colors`: Full palette

- `styles.css`:
  - `:root` variables
  - Color scales (50-900)
  - `--primary`, `--secondary`, `--accent`

#### 5.3: Fonts
Find: Base template fonts
Replace: New font selections

**Files to update:**
- `defaults.json`:
  - `fontFamily`
  - `designSystem.typography.fontFamily`

- `styles.css`:
  - `@import url(...)` (Google Fonts)
  - `--tenant-font-base`
  - `--tenant-font-heading`

#### 5.4: Template Name & Metadata
**Files to update:**
- `template.config.json`:
  - `name`: "New Template Display Name"
  - `description`: "Custom description..."
  - `author`: "BudStack Platform" (or custom)

- `defaults.json`:
  - `pageContent.homeHeroTitle`
  - `pageContent.homeHeroSubtitle`

- `README.md`:
  - Update title
  - Update description
  - Update features

#### 5.5: Assets (if provided)
If user provided logo/hero:

**Copy assets:**
```bash
cp [logo-path] /Users/gkavanagh/Development/HealingBuds/templates/[new-template]/assets/logo.png
cp [hero-path] /Users/gkavanagh/Development/HealingBuds/templates/[new-template]/assets/hero.jpg
```

**Update references:**
- `defaults.json`:
  - `logoPath`: "/templates/[template-name]/assets/logo.png"
  - `heroImagePath`: "/templates/[template-name]/assets/hero.jpg"

### Step 6: Generate Color-Adjusted Shadows & Gradients

Based on new primary color, update theme-specific shadows and gradients:

**Shadows (use primary color RGB):**
```json
"shadows": {
  "theme-sm": "0 2px 8px rgba(R, G, B, 0.08)",
  "theme-md": "0 4px 16px rgba(R, G, B, 0.12)",
  "theme-lg": "0 8px 32px rgba(R, G, B, 0.16)"
}
```

**Gradients:**
```json
"gradients": {
  "primary": "linear-gradient(135deg, hsl(HUE SAT% LIGHT%) 0%, hsl(HUE SAT% DARKER%) 100%)",
  "hero-overlay": "linear-gradient(180deg, rgba(R,G,B, 0.6) 0%, rgba(R,G,B, 0.8) 100%)"
}
```

### Step 7: Update Value Props

Ask user if they want custom value props or use defaults:

**Default value props** (keep from base template)
**Custom value props** (ask user for 4 items):
- Title
- Description
- Icon name (Lucide React)

Update in `defaults.json`:
```json
"valueProps": [
  {
    "title": "User Title",
    "description": "User description",
    "icon": "UserChosenIcon"
  }
]
```

### Step 8: Validate Output

Run validation checklist:

**File Structure:**
- [ ] All required files exist
- [ ] No references to old template name
- [ ] All colors in HSL format
- [ ] Fonts properly imported
- [ ] Assets copied (if provided)

**Color Format:**
- [ ] No hex colors remaining
- [ ] No rgb() colors
- [ ] All HSL without hsl() wrapper
- [ ] Color scales complete (50-900)

**Variables:**
- [ ] --tenant-color-* defined
- [ ] --tenant-font-* defined
- [ ] Platform integration variables correct

### Step 9: Output Summary

Display summary to user:

```
✅ Template Generated: [template-name]
Location: /Users/gkavanagh/Development/HealingBuds/templates/[template-name]/

📁 Files Created:
- index.tsx
- template.config.json
- defaults.json
- styles.css
- components/ (X files)
- README.md

🎨 Customization Applied:
- Primary Color: [HSL value]
- Font Pairing: [fonts]
- Base Template: [base used]
- Assets: [logo/hero status]

📋 Next Steps:
1. Review generated files
2. Test locally: Copy to /path/to/budstack/nextjs_space/templates/
3. Customize further if needed
4. Push to GitHub when ready
```

---

## Helper Functions

### HEX to HSL Conversion

```typescript
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert to RGB
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
```

### Generate Color Scale

```typescript
function generateColorScale(baseHSL: string): object {
  const [h, s, l] = baseHSL.split(' ').map(v => parseInt(v));

  return {
    "50": `${h} ${s}% 97%`,
    "100": `${h} ${s}% 92%`,
    "200": `${h} ${Math.max(s - 10, 0)}% 82%`,
    "300": `${h} ${Math.max(s - 10, 0)}% 72%`,
    "400": `${h} ${Math.max(s - 5, 0)}% 62%`,
    "500": `${h} ${s}% ${l}%`,  // Base color
    "600": `${h} ${s}% ${Math.max(l - 10, 10)}%`,
    "700": `${h} ${s}% ${Math.max(l - 20, 10)}%`,
    "800": `${h} ${s}% ${Math.max(l - 30, 10)}%`,
    "900": `${h} ${s}% ${Math.max(l - 40, 10)}%`
  };
}
```

---

## File Templates

### Output File Structure

```
[new-template-name]/
├── index.tsx                    # Customized main component
├── template.config.json         # Updated metadata
├── defaults.json                # Customized design system
├── styles.css                   # Updated styles with new colors
├── components/                  # Copied from base
│   ├── Hero.tsx
│   ├── ConsultationCTA.tsx
│   └── [other components]
├── assets/                      # User assets (if provided)
│   ├── logo.png
│   └── hero.jpg
└── README.md                    # Generated documentation
```

---

## Example Usage

**User:** "Create a new BudStack template called Ocean Wellness"

**Skill:**
1. Asks: "What's your primary brand color?"
   → User: "#0EA5E9"

2. Asks: "Which font pairing?"
   → User: "Professional (Plus Jakarta Sans)"

3. Asks: "What style direction?"
   → User: "Wellness/Organic"

4. Asks: "Do you have logo/hero images?"
   → User: "Yes, here's the path..."

5. **Clones** wellness-nature-template

6. **Converts** #0EA5E9 → 199 89% 48% (HSL)

7. **Generates** color scale (50-900)

8. **Replaces** all colors in defaults.json and styles.css

9. **Updates** fonts to Plus Jakarta Sans

10. **Copies** user's logo and hero images

11. **Updates** all template references (wellness-nature → ocean-wellness)

12. **Outputs** to `/Users/gkavanagh/Development/HealingBuds/templates/ocean-wellness/`

13. **Displays** summary with next steps

---

## Error Handling

**If base template not found:**
- Fall back to template-design baseline
- Notify user

**If HEX color invalid:**
- Ask user to provide valid HEX color (#RRGGBB)

**If asset files not found:**
- Use placeholders
- Notify user

**If font not in Google Fonts:**
- Use system font fallback
- Notify user

---

## Important Notes

1. **Always use HSL format** - No exceptions
2. **Always clone, never generate from scratch** - Proven templates work
3. **Always validate output** - Check against baseline
4. **Always provide summary** - User needs next steps
5. **Always preserve component structure** - Don't modify layout

---

## Reference Templates

**Available for cloning:**
- `healingbuds-template/` - Medical/Professional (gold standard)
- `wellness-nature-template/` - Wellness/Organic (earth tones)
- `gta-cannabis-template/` - Modern/Bold (retro/neon)
- `template-design/` - Baseline (documentation + structure)

**Location:** `/Users/gkavanagh/Development/HealingBuds/templates/`

---

## Skill Output Format

When skill completes, output:

1. **Confirmation message** with template name and location
2. **File list** of what was created/modified
3. **Customization summary** (colors, fonts, assets)
4. **Next steps** for user
5. **Validation status** (passed/warnings)

---

## Integration with BudStack

**After generation:**
1. User reviews generated template
2. User copies to BudStack: `cp -r [template-name] /path/to/budstack/nextjs_space/templates/`
3. BudStack auto-detects new template
4. Template appears in marketplace
5. Users can select and customize via `/tenant-admin/branding`

---

**This skill enables rapid template creation (5-10 minutes) while maintaining BudStack quality standards.**

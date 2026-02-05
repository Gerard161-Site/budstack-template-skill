# BudStack Template Generator Skill

**For:** Claude AI Agent
**Purpose:** Generate new BudStack templates by cloning and customizing reference templates
**Approach:** Clone → Customize → Output (proven and fast)

---

## Quick Start

### For Claude AI:

When user asks to create a new BudStack template:

1. **Read SKILL.md** for complete workflow
2. **Follow the 9-step process** exactly
3. **Clone a base template** (don't generate from scratch)
4. **Customize** colors, fonts, content, assets
5. **Output** to new directory

### For Humans:

```bash
# View available base templates
ls /Users/gkavanagh/Development/HealingBuds/templates/

# healingbuds-template/    - Medical/Professional
# wellness-nature-template/ - Wellness/Organic
# gta-cannabis-template/   - Modern/Bold
# template-design/         - Baseline docs
```

---

## How It Works

**Traditional approach:** Generate from scratch (slow, error-prone)
**Our approach:** Clone proven template, customize (fast, reliable)

### Workflow Overview

```
User Request
    ↓
Gather Requirements (name, colors, fonts, style)
    ↓
Select Base Template (healingbuds, wellness, gta, or custom)
    ↓
Clone Base Template
    ↓
Convert Colors (HEX → HSL)
    ↓
Generate Color Scales (50-900)
    ↓
Customize Files (replace colors, fonts, names)
    ↓
Copy Assets (logo, hero images)
    ↓
Validate Output
    ↓
Create New Repo Directory
    ↓
Done! (Ready to use in 5-10 minutes)
```

---

## Requirements from User

**Minimum:**
- Template name (kebab-case)
- Primary color (HEX format)
- Font preference
- Style direction

**Optional:**
- Logo image
- Hero image
- Secondary/accent colors
- Custom value propositions

---

## Base Templates

### healingbuds-template (Medical/Professional)
**Use for:** Premium medical cannabis brands
**Colors:** Sage-teal palette
**Fonts:** Plus Jakarta Sans + Archivo Narrow
**Features:** Video hero, animations, comprehensive

### wellness-nature-template (Wellness/Organic)
**Use for:** Wellness centers, natural products
**Colors:** Earth-tone palette
**Fonts:** Lora (serif) + Montserrat
**Features:** Organic patterns, spacious, calming

### gta-cannabis-template (Modern/Bold)
**Use for:** Modern brands, street-style edge
**Colors:** Retro (coral, teal, yellow)
**Fonts:** Inter + Montserrat
**Features:** Neon glows, comic shadows, bold

### template-design (Baseline)
**Use for:** Custom requirements
**Content:** Documentation, guides, standards
**Purpose:** Reference for building custom

---

## Output Structure

Generated template includes:

```
[template-name]/
├── index.tsx                 # Main component
├── template.config.json      # Metadata
├── defaults.json             # Design system
├── styles.css                # Styles (HSL colors)
├── components/               # React components
│   ├── Hero.tsx
│   ├── ConsultationCTA.tsx
│   └── [feature components]
├── assets/                   # Images
│   ├── logo.png
│   └── hero.jpg
└── README.md                 # Documentation
```

---

## File Locations

**Base Templates:**
```
/Users/gkavanagh/Development/HealingBuds/templates/
├── healingbuds-template/
├── wellness-nature-template/
├── gta-cannabis-template/
├── template-design/
└── budstack-template-skill/ (this repo)
```

**Generated Templates:**
```
/Users/gkavanagh/Development/HealingBuds/templates/[new-template-name]/
```

**BudStack Integration:**
```
/Users/gkavanagh/Development/HealingBuds/budstack-saas/nextjs_space/templates/[template-name]/
```

---

## Customization Process

### 1. Colors (HEX → HSL)
```
Input:  #3B82F6 (HEX)
Convert: 217 91% 60% (HSL)
Generate Scale:
  50:  217 91% 97%
  100: 217 91% 92%
  ...
  500: 217 91% 60% (base)
  ...
  900: 217 91% 20%
```

### 2. Fonts
```
Replace in:
- defaults.json: fontFamily, typography.fontFamily
- styles.css: @import, --tenant-font-*
```

### 3. Template Name
```
Find: base-template-slug
Replace: new-template-slug

Update in:
- index.tsx
- template.config.json
- defaults.json
- styles.css
- README.md
```

### 4. Assets
```
Copy:
- Logo → assets/logo.png
- Hero → assets/hero.jpg

Update paths in defaults.json
```

---

## Validation Checklist

Before outputting, verify:

**Files:**
- [ ] All required files exist
- [ ] No old template name references
- [ ] All colors in HSL format
- [ ] Fonts properly imported
- [ ] Assets copied

**Variables:**
- [ ] --tenant-color-* defined
- [ ] --tenant-font-* defined
- [ ] Color scales complete (50-900)

**Metadata:**
- [ ] template.config.json complete
- [ ] defaults.json has full design system
- [ ] README updated

---

## Example: Creating "Ocean Wellness" Template

**User Request:**
> "Create a BudStack template called Ocean Wellness with blue colors"

**Claude Process:**

1. **Gather:**
   - Name: ocean-wellness
   - Color: #0EA5E9 (ocean blue)
   - Fonts: Professional (Plus Jakarta Sans)
   - Style: Wellness/Organic
   - Assets: None (use placeholders)

2. **Clone:**
   ```bash
   cp -r wellness-nature-template/ ocean-wellness/
   ```

3. **Convert Color:**
   - #0EA5E9 → 199 89% 48%

4. **Generate Scale:**
   ```json
   "ocean-blue": {
     "50": "199 89% 97%",
     "500": "199 89% 48%",
     "900": "199 89% 20%"
   }
   ```

5. **Replace:**
   - Colors: wellness green → ocean blue
   - Fonts: Lora → Plus Jakarta Sans
   - Name: wellness-nature → ocean-wellness

6. **Output:**
   - Created: `/Users/gkavanagh/Development/HealingBuds/templates/ocean-wellness/`

7. **Summary:**
   ```
   ✅ Template Generated: ocean-wellness
   🎨 Primary Color: 199 89% 48% (ocean blue)
   📝 Font: Plus Jakarta Sans + Montserrat
   📁 Location: /templates/ocean-wellness/
   ⏱️  Time: 2 minutes
   ```

---

## Integration Flow

```
Generate Template
    ↓
Review Locally
    ↓
Copy to BudStack
    ↓
Test in Development
    ↓
Push to GitHub (if needed)
    ↓
Deploy to Production
    ↓
Appears in Marketplace
    ↓
Users Can Select
```

---

## Benefits

✅ **Fast:** 5-10 minutes vs hours
✅ **Reliable:** Proven base templates
✅ **Consistent:** Follows BudStack standards
✅ **Flexible:** Full customization support
✅ **Validated:** Automatic checks

---

## Support Files

**In this repo:**
- `SKILL.md` - Complete skill documentation (read this!)
- `README.md` - This file
- `helpers.ts` - Helper functions (HEX→HSL, color scales)
- `examples/` - Example workflows

**Reference:**
- `template-design/` - Baseline documentation
- `healingbuds-template/` - Gold standard reference
- `wellness-nature-template/` - Organic style reference
- `gta-cannabis-template/` - Bold style reference

---

## Next Steps

1. **Read SKILL.md** - Complete workflow documentation
2. **Review base templates** - Understand options
3. **Test generation** - Create a sample template
4. **Integrate** - Use in production

---

## Support

- GitHub: https://github.com/HealingBuds/budstack-templates
- Email: dev@healingbuds.com
- Docs: https://docs.budstack.com/templates

---

**Ready to generate templates in minutes, not hours!**

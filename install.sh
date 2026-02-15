#!/bin/bash
# Install the BudStack Template Creator as a Claude Code skill
#
# Usage: ./install.sh
# Then use /create-template in any Claude Code session
#
# What this does:
#   1. Creates ~/.claude/skills/create-template/
#   2. Copies SKILL.md, references/, and scripts/ there
#   3. The skill auto-triggers when you ask to "create a template"

set -e

SKILL_DIR="$HOME/.claude/skills/create-template"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing BudStack Template Creator skill..."

# Create skill directory structure
mkdir -p "$SKILL_DIR/references"
mkdir -p "$SKILL_DIR/scripts"

# Copy skill files
cp "$SCRIPT_DIR/SKILL.md" "$SKILL_DIR/SKILL.md"
cp "$SCRIPT_DIR/references/component-catalog.md" "$SKILL_DIR/references/component-catalog.md"
cp "$SCRIPT_DIR/references/layout-archetypes.md" "$SKILL_DIR/references/layout-archetypes.md"
cp "$SCRIPT_DIR/references/typography.md" "$SKILL_DIR/references/typography.md"
cp "$SCRIPT_DIR/references/color-theory.md" "$SKILL_DIR/references/color-theory.md"
cp "$SCRIPT_DIR/scripts/helpers.ts" "$SKILL_DIR/scripts/helpers.ts"

echo ""
echo "Installed to: $SKILL_DIR"
echo ""
echo "Usage:"
echo "  1. Open Claude Code in any project"
echo "  2. Type: /create-template YourBrandName"
echo "  3. Answer the brand interview questions"
echo "  4. The skill generates 4 template files + assets"
echo ""
echo "Templates output to: ~/Development/HealingBuds/templates/{brand-name}/"
echo ""
echo "Done!"

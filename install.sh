#!/bin/bash
# ============================================================
# BudStacks Template Creator — Install Script
# ============================================================
#
# Installs the AI-powered template designer as a Claude Code skill.
#
# Usage:
#   ./install.sh
#
# After install:
#   /create-budstacks-template YourBrandName
#
# What this does:
#   1. Creates ~/.claude/skills/create-budstacks-template/
#   2. Copies SKILL.md, references/, and scripts/
#   3. The skill auto-triggers in Claude Code when you ask to create a template

set -e

SKILL_DIR="$HOME/.claude/skills/create-budstacks-template"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  ____            _ ____  _             _        "
echo " | __ ) _   _  __| / ___|| |_ __ _  ___| | _____ "
echo " |  _ \| | | |/ _\` \___ \| __/ _\` |/ __| |/ / __|"
echo " | |_) | |_| | (_| |___) | || (_| | (__|   <\__ \\"
echo " |____/ \__,_|\__,_|____/ \__\__,_|\___|_|\_\___/"
echo ""
echo " Template Creator Skill — v3.0"
echo ""

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

echo "Installed to: $SKILL_DIR"
echo ""
echo "-------------------------------------------"
echo ""
echo "  You're ready to go!"
echo ""
echo "  Open Claude Code and type:"
echo ""
echo "    /create-budstacks-template YourBrandName"
echo ""
echo "  The AI will interview you about your brand,"
echo "  then design and generate a complete template."
echo ""
echo "-------------------------------------------"
echo ""

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
echo " Template Builder Skill — v5.0 (Template Design System v2)"
echo ""

# Create skill directory structure
mkdir -p "$SKILL_DIR/references"
mkdir -p "$SKILL_DIR/scripts"

# Copy the skill: the document, every reference (including the platform
# contract in references/contract/) and the validator.
cp "$SCRIPT_DIR/SKILL.md" "$SKILL_DIR/SKILL.md"
cp -R "$SCRIPT_DIR/references/." "$SKILL_DIR/references/"
cp -R "$SCRIPT_DIR/scripts/." "$SKILL_DIR/scripts/"

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
echo "  Give it a design handoff, a Figma URL, or"
echo "  just the brand, and it builds the template."
echo ""
echo "-------------------------------------------"
echo ""

---
name: aso-screenshots
description: Generate high-converting App Store screenshots for BibleDiscern. Analyzes the codebase to identify 3-5 core benefits, pairs them with simulator screenshots, and produces polished App Store images via a two-stage compose + AI enhancement process.
---

# ASO App Store Screenshots Skill

This comprehensive guide helps create high-converting App Store screenshots through a structured, multi-phase process.

## Core Process Phases

**Recall First**: Always check Claude Code memory for saved progress on benefits, screenshot analysis, pairings, brand colour, and generated screenshots before proceeding.

**Benefit Discovery**: Analyze the codebase to understand functionality, then ask clarifying questions about target audience and competitive positioning. Draft 3-5 core benefits using action verbs ("TRACK", "SEARCH", "BUILD") focused on user value, not technical features.

**Screenshot Pairing**: Collect simulator screenshots, assess each as Great/Usable/Retake with honest feedback, provide retake guidance for weak captures, then pair the best screenshots with benefits based on relevance and visual impact.

**Generation**: Use Nano Banana Pro via Gemini MCP to transform scaffolds into polished App Store screenshots. The first approved screenshot becomes the style template for consistency across the set.

## Key Generation Details

- **Dimensions**: Default to 1290×2796px (iPhone 6.7") with strict post-processing crop/resize to Apple's exact specs
- **Design Format**: Bold headline text (action verb large, descriptor smaller), photorealistic iPhone frame, simulator screenshot composited inside, solid brand colour background
- **Device Placement**: Position high on canvas with bottom edge cropped off for dynamic effect
- **Breakout Elements**: Only add if an obvious UI panel directly reinforces the benefit; must extend beyond both device edges with drop shadow
- **Consistency**: All 3 versions generated in parallel; first approved version becomes style template for subsequent benefits

## Memory Persistence

Save confirmed benefits, screenshot assessments, pairings, brand colour, and generation state to Claude Code memory incrementally. This enables seamless resume across conversations without re-analysis or re-supply of materials.

## Setup Requirements

- Install Pillow: `pip install pillow`
- SF Pro Display Black font at `/Library/Fonts/SF-Pro-Display-Black.otf` (from Apple Developer resources)
- Gemini MCP configured as a server (for Nano Banana Pro generation step)
- Scripts: `compose.py` (scaffold), `generate_frame.py` (device frame), `showcase.py` (preview assembly)

## Source

Original skill by @adamlyttleapps — https://github.com/adamlyttleapps/claude-skill-aso-appstore-screenshots

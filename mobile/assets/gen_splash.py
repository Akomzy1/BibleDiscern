from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1284, 2778
BG = (253, 246, 236)       # #FDF6EC cream
NAVY = (27, 42, 74)        # #1B2A4A
GOLD = (200, 164, 94)      # #C8A45E
CARD_BG = (245, 236, 220)  # slightly darker cream for card

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# ── Card (rounded rect) ───────────────────────────────────────────────────────
card_w, card_h = 760, 760
cx, cy = W // 2, H // 2 - 80
card_x0 = cx - card_w // 2
card_y0 = cy - card_h // 2
card_x1 = cx + card_w // 2
card_y1 = cy + card_h // 2
radius = 120

draw.rounded_rectangle([card_x0, card_y0, card_x1, card_y1], radius=radius, fill=CARD_BG)

# ── Cross icon ────────────────────────────────────────────────────────────────
cross_cx = cx
cross_cy = cy - 80
arm = 160   # half-length of each arm
th = 54     # thickness

# vertical bar
draw.rectangle([cross_cx - th//2, cross_cy - arm, cross_cx + th//2, cross_cy + arm], fill=NAVY)
# horizontal bar
draw.rectangle([cross_cx - arm, cross_cy - th//2 + 20, cross_cx + arm, cross_cy + th//2 + 20], fill=NAVY)

# ── Text ─────────────────────────────────────────────────────────────────────
# Try Georgia, fall back to default
try:
    font_title = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 110)
    font_tagline = ImageFont.truetype("C:/Windows/Fonts/georgiai.ttf", 56)
except:
    font_title = ImageFont.load_default()
    font_tagline = ImageFont.load_default()

title = "BibleDiscern"
tagline = "Weigh it with wisdom"

# Title
bb = draw.textbbox((0, 0), title, font=font_title)
tw = bb[2] - bb[0]
title_y = cross_cy + arm + 60
draw.text((cx - tw // 2, title_y), title, fill=NAVY, font=font_title)

# Tagline
bb2 = draw.textbbox((0, 0), tagline, font=font_tagline)
tw2 = bb2[2] - bb2[0]
tagline_y = title_y + (bb[3] - bb[1]) + 28
draw.text((cx - tw2 // 2, tagline_y), tagline, fill=GOLD, font=font_tagline)

# Underline beneath tagline
line_y = tagline_y + (bb2[3] - bb2[1]) + 18
draw.line([(cx - tw2 // 2, line_y), (cx + tw2 // 2, line_y)], fill=GOLD, width=3)

img.save("C:/Users/TEMP/Desktop/LibratoAi/mobile/assets/splash.png")
print("splash.png saved")

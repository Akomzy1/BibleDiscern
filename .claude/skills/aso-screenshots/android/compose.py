"""
BibleDiscern — Android Play Store Screenshot Generator
Dimensions: 1080 x 1920px (Google Play portrait standard)
Brand: Navy #1B2A4A bg | Gold #C8A45E accent | Cream #FDF6EC text
Font: Georgia Bold (system) — closest match to Playfair Display
"""

from PIL import Image, ImageDraw, ImageFont
import math, os, sys

# ── Output
OUT_DIR   = os.path.join(os.path.dirname(__file__), "final")
WORK_DIR  = os.path.join(os.path.dirname(__file__), "working")
W, H      = 1080, 1920

# ── Brand colours
NAVY      = (27,  42,  74)
NAVY_LT   = (45,  65, 102)
GOLD      = (200, 164, 94)
GOLD_LT   = (232, 213, 163)
CREAM     = (253, 246, 236)
PARCHMENT = (245, 236, 215)
SAGE      = (122, 139, 111)
BORDER    = (232, 223, 208)
TEXT_MED  = (92,  81,  68)

# ── Fonts
FONTS_DIR = "C:/Windows/Fonts"
def font(name, size):
    path = os.path.join(FONTS_DIR, name)
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

F_VERB    = font("georgiab.ttf", 148)   # action verb — HUGE gold
F_HERO    = font("georgiab.ttf",  52)   # hero descriptor line
F_SUB     = font("georgiai.ttf",  36)   # italic sub-copy
F_LABEL   = font("georgiab.ttf",  34)   # small labels / brand name
F_SMALL   = font("georgia.ttf",   28)   # fine print / captions
F_UI_HDR  = font("georgiab.ttf",  26)   # UI text inside phone — header
F_UI_BODY = font("georgia.ttf",   21)   # UI text inside phone — body
F_UI_SM   = font("georgia.ttf",   17)   # UI text inside phone — small

# ── Helpers
def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def draw_text_centered(draw, text, y, font, color, canvas_w=W, shadow=False):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (canvas_w - tw) // 2
    if shadow:
        draw.text((x+3, y+3), text, font=font, fill=(0, 0, 0, 80))
    draw.text((x, y), text, font=font, fill=color)

def draw_text_in_screen(draw, text, x0, x1, y, font, color):
    """Center text horizontally within the screen region [x0, x1]."""
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = x0 + (x1 - x0 - tw) // 2
    draw.text((x, y), text, font=font, fill=color)

def wrap_text(draw, text, font, max_w, padding=80):
    """Word-wrap text to fit within max_w. Returns list of lines."""
    words = text.split()
    lines, cur = [], []
    for word in words:
        test = " ".join(cur + [word])
        bb = draw.textbbox((0, 0), test, font=font)
        if bb[2] - bb[0] > max_w - padding:
            if cur:
                lines.append(" ".join(cur))
            cur = [word]
        else:
            cur.append(word)
    if cur:
        lines.append(" ".join(cur))
    return lines

def draw_text_wrapped_centered(draw, text, y, font, color, canvas_w=W, line_gap=8, shadow=False):
    """Draw word-wrapped centred text. Returns the bottom y of the last line."""
    lines = wrap_text(draw, text, font, canvas_w)
    bb = draw.textbbox((0, 0), "Ay", font=font)
    lh = bb[3] - bb[1]
    for line in lines:
        draw_text_centered(draw, line, y, font, color, canvas_w, shadow)
        y += lh + line_gap
    return y

def draw_text_left(draw, text, x, y, font, color):
    draw.text((x, y), text, font=font, fill=color)

def draw_rounded_rect(draw, box, radius, fill=None, outline=None, width=1):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=width)

def draw_cross(draw, cx, cy, size, color, thickness=6):
    vert_w = max(1, size // 8)
    horiz_h = max(1, size // 8)
    # Vertical
    draw.rectangle([cx - vert_w, cy - size//2, cx + vert_w, cy + size//2], fill=color)
    # Horizontal (at 35% from top)
    cross_y = cy - size//2 + int(size * 0.35)
    draw.rectangle([cx - size//2, cross_y - horiz_h, cx + size//2, cross_y + horiz_h], fill=color)

def draw_phone_frame(draw, cx, top_y, phone_w, phone_h, screen_margin=28):
    """Draw a clean Android phone outline. Returns screen bounding box."""
    radius = 60
    x0 = cx - phone_w // 2
    y0 = top_y
    x1 = x0 + phone_w
    y1 = y0 + phone_h

    # Phone body
    draw_rounded_rect(draw, [x0, y0, x1, y1], radius=radius,
                       fill=NAVY_LT, outline=GOLD_LT, width=3)

    # Camera pill
    cam_cx = cx
    cam_y = y0 + 22
    draw.ellipse([cam_cx - 14, cam_y - 8, cam_cx + 14, cam_y + 8], fill=(15, 25, 50))
    draw.ellipse([cam_cx - 6, cam_y - 6, cam_cx + 6, cam_y + 6], fill=(10, 15, 35))

    # Side buttons
    btn_x = x1 + 3
    draw_rounded_rect(draw, [btn_x, y0 + 160, btn_x + 8, y0 + 280], radius=4, fill=GOLD_LT)
    draw_rounded_rect(draw, [x0 - 11, y0 + 130, x0 - 3, y0 + 220], radius=4, fill=BORDER)
    draw_rounded_rect(draw, [x0 - 11, y0 + 240, x0 - 3, y0 + 320], radius=4, fill=BORDER)

    # Screen area
    sx0 = x0 + screen_margin
    sy0 = y0 + 55
    sx1 = x1 - screen_margin
    sy1 = y1 - screen_margin
    draw_rounded_rect(draw, [sx0, sy0, sx1, sy1], radius=radius - 20, fill=CREAM)

    return (sx0, sy0, sx1, sy1)  # screen bounds


# ════════════════════════════════════════════════════════════
# UI MOCKUP RENDERERS  (drawn onto the phone screen)
# ════════════════════════════════════════════════════════════

def render_discern_ui(draw, sx0, sy0, sx1, sy1):
    """Step-by-step journey mockup."""
    sw = sx1 - sx0
    pad = 24

    # Header bar
    draw_rounded_rect(draw, [sx0, sy0, sx1, sy0 + 70], radius=0, fill=NAVY)
    draw_text_in_screen(draw, "The Crossroads", sx0, sx1, sy0 + 22, F_UI_HDR, GOLD)

    # Situation card
    cy = sy0 + 90
    draw_rounded_rect(draw, [sx0 + pad, cy, sx1 - pad, cy + 90], radius=14, fill=PARCHMENT)
    draw.text((sx0 + pad + 16, cy + 14), "Should I take the new role,", font=F_UI_BODY, fill=TEXT_MED)
    draw.text((sx0 + pad + 16, cy + 38), "or stay and serve where I am?", font=F_UI_BODY, fill=TEXT_MED)
    draw.text((sx0 + pad + 16, cy + 64), "Tone: Reflective", font=F_UI_SM, fill=SAGE)

    # 7 steps
    steps = [
        ("✝", "The Word",          True),
        ("✦", "Those Who Walked",  True),
        ("◎", "The Examination",   True),
        ("◉", "The Stillness",     False),
        ("✿", "The Fruit",         False),
        ("✦", "The Prayer",        False),
    ]
    step_y = cy + 108
    for icon, label, done in steps:
        col = GOLD if done else BORDER
        fill = GOLD if done else (200, 200, 200)
        draw.ellipse([sx0 + pad, step_y, sx0 + pad + 28, step_y + 28], fill=col)
        draw.text((sx0 + pad + 7, step_y + 4), "OK" if done else icon, font=F_UI_SM, fill=NAVY)
        draw.text((sx0 + pad + 40, step_y + 4), label, font=F_UI_BODY, fill=NAVY if done else TEXT_MED)
        step_y += 44

    # CTA button
    btn_y = sy1 - 74
    draw_rounded_rect(draw, [sx0 + pad, btn_y, sx1 - pad, btn_y + 50], radius=25, fill=GOLD)
    draw_text_in_screen(draw, "Continue Journey", sx0, sx1, btn_y + 14, F_UI_HDR, NAVY)


def render_scale_ui(draw, sx0, sy0, sx1, sy1):
    """Daily Scale mockup — WEIGH two sides."""
    sw = sx1 - sx0
    pad = 20

    # Header
    draw_rounded_rect(draw, [sx0, sy0, sx1, sy0 + 70], radius=0, fill=NAVY)
    draw_text_in_screen(draw, "The Daily Scale", sx0, sx1, sy0 + 22, F_UI_HDR, GOLD)

    # Question
    q_y = sy0 + 84
    draw.text((sx0 + pad, q_y), "Should Christians prioritize", font=F_UI_BODY, fill=NAVY)
    draw.text((sx0 + pad, q_y + 26), "personal prayer or community", font=F_UI_BODY, fill=NAVY)
    draw.text((sx0 + pad, q_y + 52), "worship first?", font=F_UI_BODY, fill=NAVY)

    # Two side cards
    card_y = q_y + 96
    mid = (sx0 + sx1) // 2 - 8
    # Side A
    draw_rounded_rect(draw, [sx0 + pad, card_y, mid, card_y + 130], radius=14,
                       fill=PARCHMENT, outline=GOLD, width=2)
    draw.text((sx0 + pad + 12, card_y + 10), "PERSONAL", font=F_UI_HDR, fill=NAVY)
    draw.text((sx0 + pad + 12, card_y + 40), "PRAYER", font=F_UI_HDR, fill=NAVY)
    draw.text((sx0 + pad + 12, card_y + 72), '"Enter your closet..."', font=F_UI_SM, fill=TEXT_MED)
    draw.text((sx0 + pad + 12, card_y + 94), "Matthew 6:6", font=F_UI_SM, fill=SAGE)

    # Side B
    draw_rounded_rect(draw, [mid + 16, card_y, sx1 - pad, card_y + 130], radius=14, fill=PARCHMENT)
    draw.text((mid + 28, card_y + 10), "COMMUNAL", font=F_UI_HDR, fill=NAVY)
    draw.text((mid + 28, card_y + 40), "WORSHIP", font=F_UI_HDR, fill=NAVY)
    draw.text((mid + 28, card_y + 72), '"Not forsaking..."', font=F_UI_SM, fill=TEXT_MED)
    draw.text((mid + 28, card_y + 94), "Hebrews 10:25", font=F_UI_SM, fill=SAGE)

    # Community results bar
    bar_y = card_y + 152
    draw.text((sx0 + pad, bar_y), "Community: 58% Personal · 42% Communal", font=F_UI_SM, fill=TEXT_MED)
    bar_y += 26
    bar_w = sx1 - sx0 - pad * 2
    draw_rounded_rect(draw, [sx0 + pad, bar_y, sx1 - pad, bar_y + 16], radius=8, fill=BORDER)
    draw_rounded_rect(draw, [sx0 + pad, bar_y, sx0 + pad + int(bar_w * 0.58), bar_y + 16], radius=8, fill=GOLD)

    # CTA
    btn_y = sy1 - 74
    draw_rounded_rect(draw, [sx0 + pad, btn_y, sx1 - pad, btn_y + 50], radius=25, fill=GOLD)
    draw_text_in_screen(draw, "Cast My Vote", sx0, sx1, btn_y + 14, F_UI_HDR, NAVY)


def render_stillness_ui(draw, sx0, sy0, sx1, sy1):
    """Stillness Engine mockup — breathing circle."""
    sw = sx1 - sx0
    cx = (sx0 + sx1) // 2
    cy_screen = (sy0 + sy1) // 2 - 40

    # Full navy screen
    draw_rounded_rect(draw, [sx0, sy0, sx1, sy1], radius=40, fill=NAVY)

    # Title
    draw_text_in_screen(draw, "The Stillness", sx0, sx1, sy0 + 20, F_UI_HDR, GOLD)
    draw_text_in_screen(draw, '"Be still, and know..."', sx0, sx1, sy0 + 54, F_UI_SM, CREAM)

    # Breathing rings (concentric)
    for r, alpha in [(130, 30), (100, 50), (70, 90)]:
        a = int(alpha * 255 / 100)
        ring_col = (200, 164, 94, a)
        # Pillow doesn't support per-pixel alpha on Draw directly, use ellipse with fill
        col = tuple(int(GOLD[i] + (NAVY[i] - GOLD[i]) * (1 - alpha/100)) for i in range(3))
        draw.ellipse([cx - r, cy_screen - r, cx + r, cy_screen + r], fill=col)

    # Cross in center
    draw_cross(draw, cx, cy_screen, 48, GOLD_LT, thickness=5)

    # Timer
    draw_text_in_screen(draw, "1:24", sx0, sx1, cy_screen + 148, F_UI_HDR, CREAM)

    # Progress bar
    bar_y = cy_screen + 190
    bar_w = sw - 80
    bar_x = sx0 + 40
    draw_rounded_rect(draw, [bar_x, bar_y, bar_x + bar_w, bar_y + 8], radius=4, fill=(60, 80, 120))
    draw_rounded_rect(draw, [bar_x, bar_y, bar_x + int(bar_w * 0.65), bar_y + 8], radius=4, fill=GOLD)

    # Phase label
    draw_text_in_screen(draw, "Inhale slowly...", sx0, sx1, bar_y + 28, F_UI_SM, CREAM)


def render_fruit_ui(draw, sx0, sy0, sx1, sy1):
    """Fruit of the Spirit radial diagnostic."""
    sw = sx1 - sx0
    pad = 20
    cx = (sx0 + sx1) // 2
    cy_chart = sy0 + 250

    draw_rounded_rect(draw, [sx0, sy0, sx1, sy0 + 70], radius=0, fill=NAVY)
    draw_text_in_screen(draw, "Fruit Diagnostic", sx0, sx1, sy0 + 18, F_UI_HDR, GOLD)

    # Radar/spider chart (simplified polygon)
    fruits = ["Love", "Joy", "Peace", "Patience", "Kindness", "Goodness", "Faithfulness", "Gentleness"]
    scores = [0.85, 0.70, 0.90, 0.55, 0.80, 0.75, 0.60, 0.88]
    n = len(fruits)
    R = 110  # max radius
    r_inner = 36

    # Background rings
    for ring in [0.25, 0.5, 0.75, 1.0]:
        pts = []
        for i in range(n):
            angle = math.pi * 2 * i / n - math.pi / 2
            r = R * ring
            pts.append((cx + r * math.cos(angle), cy_chart + r * math.sin(angle)))
        draw.polygon(pts, outline=BORDER)

    # Score polygon
    pts = []
    for i, score in enumerate(scores):
        angle = math.pi * 2 * i / n - math.pi / 2
        r = R * score
        pts.append((cx + r * math.cos(angle), cy_chart + r * math.sin(angle)))
    draw.polygon(pts, fill=(200, 164, 94, 80), outline=GOLD)
    # Re-draw outline solid
    for i in range(len(pts)):
        draw.line([pts[i], pts[(i+1) % len(pts)]], fill=GOLD, width=3)

    # Axis lines & labels
    for i, (fruit, score) in enumerate(zip(fruits, scores)):
        angle = math.pi * 2 * i / n - math.pi / 2
        xe = cx + R * math.cos(angle)
        ye = cy_chart + R * math.sin(angle)
        draw.line([(cx, cy_chart), (xe, ye)], fill=BORDER, width=1)
        # Label position
        lx = cx + (R + 22) * math.cos(angle)
        ly = cy_chart + (R + 22) * math.sin(angle)
        bbox = draw.textbbox((0, 0), fruit, font=F_UI_SM)
        tw = bbox[2] - bbox[0]
        draw.text((lx - tw//2, ly - 10), fruit, font=F_UI_SM, fill=NAVY)

    # Dot score labels
    card_y = cy_chart + R + 50
    rows = [
        ("Love", "85%", "Peace", "90%"),
        ("Joy",  "70%", "Patience","55%"),
    ]
    for row in rows:
        draw_rounded_rect(draw, [sx0 + pad, card_y, sx1 - pad, card_y + 44], radius=10, fill=PARCHMENT)
        draw.text((sx0 + pad + 14, card_y + 10), f"{row[0]}: {row[1]}", font=F_UI_BODY, fill=NAVY)
        draw.text((sx0 + pad + sw//2, card_y + 10), f"{row[2]}: {row[3]}", font=F_UI_BODY, fill=NAVY)
        card_y += 52


def render_journal_ui(draw, sx0, sy0, sx1, sy1):
    """Spiritual journal / Ebenezer stones."""
    sw = sx1 - sx0
    pad = 20

    draw_rounded_rect(draw, [sx0, sy0, sx1, sy0 + 70], radius=0, fill=NAVY)
    draw_text_in_screen(draw, "Your Journey", sx0, sx1, sy0 + 18, F_UI_HDR, GOLD)

    entries = [
        ("Mar 28", "Career crossroads", "Proverbs 16:9",
         "Felt peace after stillness. Staying put."),
        ("Mar 21", "Family conflict", "Matthew 18:15",
         "God reminded me of grace. Reconciled."),
        ("Mar 14", "Major life decision", "James 1:5",
         "Scripture confirmed what my heart knew."),
    ]

    ey = sy0 + 88
    for date, title, ref, note in entries:
        draw_rounded_rect(draw, [sx0 + pad, ey, sx1 - pad, ey + 108], radius=14,
                           fill=PARCHMENT, outline=BORDER, width=1)
        # Gold left accent bar
        draw_rounded_rect(draw, [sx0 + pad, ey, sx0 + pad + 5, ey + 108], radius=3, fill=GOLD)
        draw.text((sx0 + pad + 18, ey + 10), title, font=F_UI_HDR, fill=NAVY)
        draw.text((sx0 + pad + 18, ey + 38), ref, font=F_UI_SM, fill=GOLD)
        draw.text((sx0 + pad + 18, ey + 60), note, font=F_UI_SM, fill=TEXT_MED)
        draw.text((sx1 - pad - 70, ey + 10), date, font=F_UI_SM, fill=SAGE)
        # Ebenezer stone icon
        draw.text((sx0 + pad + 18, ey + 82), "🪨 Ebenezer stone", font=F_UI_SM, fill=SAGE)
        ey += 120


# ════════════════════════════════════════════════════════════
# SCREENSHOT BUILDER
# ════════════════════════════════════════════════════════════

SCREENSHOTS = [
    {
        "file":       "01_discern.png",
        "verb":       "DISCERN",
        "hero":       "Bring every decision before God",
        "sub":        "A structured 7-step journey rooted in Scripture",
        "ui_fn":      render_discern_ui,
        "bg":         NAVY,
        "verb_col":   GOLD,
        "hero_col":   CREAM,
        "sub_col":    GOLD_LT,
    },
    {
        "file":       "02_weigh.png",
        "verb":       "WEIGH",
        "hero":       "One biblical question. Every day.",
        "sub":        "Vote · See community results · Receive Scripture wisdom",
        "ui_fn":      render_scale_ui,
        "bg":         NAVY,
        "verb_col":   GOLD,
        "hero_col":   CREAM,
        "sub_col":    GOLD_LT,
    },
    {
        "file":       "03_listen.png",
        "verb":       "LISTEN",
        "hero":       "90 seconds of silence that changes everything",
        "sub":        "The Stillness Engine — guided contemplative prayer",
        "ui_fn":      render_stillness_ui,
        "bg":         NAVY,
        "verb_col":   GOLD,
        "hero_col":   CREAM,
        "sub_col":    GOLD_LT,
    },
    {
        "file":       "04_grow.png",
        "verb":       "GROW",
        "hero":       "See where your spirit aligns",
        "sub":        "Fruit of the Spirit diagnostic — track your heart over time",
        "ui_fn":      render_fruit_ui,
        "bg":         NAVY,
        "verb_col":   GOLD,
        "hero_col":   CREAM,
        "sub_col":    GOLD_LT,
    },
    {
        "file":       "05_remember.png",
        "verb":       "REMEMBER",
        "hero":       "Every prayer. Every answered moment.",
        "sub":        "Set your Ebenezer stone — your spiritual history, forever",
        "ui_fn":      render_journal_ui,
        "bg":         NAVY,
        "verb_col":   GOLD,
        "hero_col":   CREAM,
        "sub_col":    GOLD_LT,
    },
]


def build_screenshot(cfg):
    img  = Image.new("RGB", (W, H), cfg["bg"])
    draw = ImageDraw.Draw(img)

    # ── Gold horizontal accent line at very top
    draw.rectangle([0, 0, W, 6], fill=GOLD)

    # ── Cross icon (top centre)
    draw_cross(draw, W // 2, 90, 52, GOLD, thickness=5)

    # ── Brand label
    draw_text_centered(draw, "BibleDiscern", 152, F_LABEL, GOLD_LT)

    # ── Action verb
    verb_y = 210
    draw_text_centered(draw, cfg["verb"], verb_y, F_VERB, cfg["verb_col"], shadow=True)

    # ── Hero line (word-wrapped)
    verb_bbox = draw.textbbox((0, 0), cfg["verb"], font=F_VERB)
    hero_y = verb_y + (verb_bbox[3] - verb_bbox[1]) + 40
    sub_y = draw_text_wrapped_centered(draw, cfg["hero"], hero_y, F_HERO, cfg["hero_col"], line_gap=6)

    # ── Sub copy (word-wrapped)
    sub_y += 8
    phone_top_y = draw_text_wrapped_centered(draw, cfg["sub"], sub_y, F_SUB, cfg["sub_col"], line_gap=4)

    # ── Phone frame — fills remaining space, bottom crops off canvas for drama
    phone_w   = 620
    phone_h   = 1100
    phone_top = phone_top_y + 40
    phone_cx  = W // 2

    screen = draw_phone_frame(draw, phone_cx, phone_top, phone_w, phone_h)

    # ── UI mockup inside the screen
    sx0, sy0, sx1, sy1 = screen
    cfg["ui_fn"](draw, sx0, sy0, sx1, sy1)

    # ── Bottom: tagline + cross
    tag_y = H - 80
    draw.rectangle([0, tag_y - 24, W, H], fill=(18, 28, 55))   # footer strip
    draw_text_centered(draw, '"Weigh it with wisdom."', tag_y - 16, F_SMALL, GOLD_LT)

    # ── Save
    out_path = os.path.join(OUT_DIR, cfg["file"])
    img.save(out_path, "PNG", optimize=True)
    print(f"  OK  {cfg['file']}")
    return out_path


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(WORK_DIR, exist_ok=True)
    print(f"\nBibleDiscern Android Screenshots -- {W}x{H}px")
    print("-" * 48)
    paths = []
    for cfg in SCREENSHOTS:
        paths.append(build_screenshot(cfg))
    print(f"\n  {len(paths)} screenshots saved to:\n   {OUT_DIR}\n")


if __name__ == "__main__":
    main()

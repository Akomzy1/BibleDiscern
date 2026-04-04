"""
BibleDiscern — Google Play Store Screenshot Generator v2
Dimensions: 1284 x 2778px (Google Play recommended for phones)
Brand: Navy #1B2A4A | Gold #C8A45E | Cream #FDF6EC
"""

from PIL import Image, ImageDraw, ImageFont
import math, os

OUT_DIR = os.path.join(os.path.dirname(__file__), "final")
W, H = 1284, 2778

# ── Brand colours
NAVY      = (27,  42,  74)
NAVY_DARK = (13,  21,  32)
NAVY_LT   = (45,  65, 102)
GOLD      = (200, 164, 94)
GOLD_LT   = (232, 213, 163)
CREAM     = (253, 246, 236)
PARCHMENT = (245, 236, 215)
SAGE      = (122, 139, 111)
BORDER    = (232, 223, 208)
TEXT_DARK = (44,  36,  24)
TEXT_MED  = (92,  81,  68)
TEXT_LT   = (138, 127, 114)
WHITE     = (255, 255, 255)
GOLD_DIM  = (160, 131, 75)   # 75% gold for subtitle

FONTS_DIR = "C:/Windows/Fonts"

def fnt(name, size):
    try:
        return ImageFont.truetype(os.path.join(FONTS_DIR, name), size)
    except Exception:
        return ImageFont.load_default()

# Canvas fonts
F_HEAD     = fnt("georgiab.ttf", 96)
F_SUBHEAD  = fnt("georgiab.ttf", 96)
F_SUBTITLE = fnt("georgia.ttf",  36)
F_STARS    = fnt("georgiab.ttf", 42)

# Phone UI fonts
F_UI_LG        = fnt("georgiab.ttf", 36)
F_UI_MD        = fnt("georgiab.ttf", 30)
F_UI_BODY      = fnt("georgia.ttf",  26)
F_UI_BOLD_BODY = fnt("georgiab.ttf", 26)
F_UI_SM        = fnt("georgia.ttf",  21)
F_UI_BOLD_SM   = fnt("georgiab.ttf", 21)
F_UI_XS        = fnt("georgia.ttf",  17)
F_UI_ITAL      = fnt("georgiai.ttf", 22)
F_UI_ITAL_SM   = fnt("georgiai.ttf", 18)


# ── Drawing helpers ─────────────────────────────────────────────────────────

def rr(draw, box, radius, fill=None, outline=None, width=1):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius,
                            fill=fill, outline=outline, width=width)

def cross(draw, cx, cy, size, color):
    arm = size // 2
    th  = max(3, size // 7)
    draw.rectangle([cx - th, cy - arm, cx + th, cy + arm], fill=color)
    cross_y = cy - arm + int(size * 0.35)
    draw.rectangle([cx - arm, cross_y - th, cx + arm, cross_y + th], fill=color)

def tw(draw, text, f):
    bb = draw.textbbox((0, 0), text, font=f)
    return bb[2] - bb[0]

def th_px(draw, text, f):
    bb = draw.textbbox((0, 0), text, font=f)
    return bb[3] - bb[1]

def ctext(draw, text, y, f, color, cw=W):
    x = (cw - tw(draw, text, f)) // 2
    draw.text((x, y), text, font=f, fill=color)
    return th_px(draw, text, f)

def ctext_in(draw, text, x0, x1, y, f, color):
    x = x0 + (x1 - x0 - tw(draw, text, f)) // 2
    draw.text((x, y), text, font=f, fill=color)

def wrap(draw, text, f, max_w):
    words, lines, cur = text.split(), [], []
    for w in words:
        test = " ".join(cur + [w])
        if tw(draw, test, f) > max_w and cur:
            lines.append(" ".join(cur)); cur = [w]
        else:
            cur.append(w)
    if cur: lines.append(" ".join(cur))
    return lines

def ctext_wrap(draw, text, y, f, color, max_w, gap=8):
    for line in wrap(draw, text, f, max_w):
        ctext(draw, line, y, f, color)
        y += th_px(draw, line, f) + gap
    return y


# ── Phone frame ─────────────────────────────────────────────────────────────

PHONE_W = 900
PHONE_H = int(PHONE_W * 2.17)   # ≈ 1953

def draw_phone(draw, cx, top_y):
    pw, ph = PHONE_W, PHONE_H
    rad = 54
    x0 = cx - pw // 2
    y0 = top_y
    x1 = x0 + pw
    y1 = y0 + ph

    # Shadow (approximate with slightly larger dark rect behind)
    shadow_off = 12
    rr(draw, [x0 + shadow_off, y0 + shadow_off, x1 + shadow_off, y1 + shadow_off],
       radius=rad, fill=(10, 16, 28))

    # Phone body
    rr(draw, [x0, y0, x1, y1], radius=rad, fill=NAVY_DARK)

    # Notch
    notch_w, notch_h = 130, 32
    rr(draw, [cx - notch_w // 2, y0 + 18,
              cx + notch_w // 2, y0 + 18 + notch_h], radius=16, fill=(4, 8, 18))
    draw.ellipse([cx - 10, y0 + 24, cx + 10, y0 + 24 + 20], fill=(14, 22, 40))

    # Side buttons
    rr(draw, [x1,     y0 + 220, x1 + 9,  y0 + 400], radius=5, fill=NAVY_LT)
    rr(draw, [x0 - 9, y0 + 180, x0,      y0 + 310], radius=5, fill=NAVY_LT)
    rr(draw, [x0 - 9, y0 + 330, x0,      y0 + 440], radius=5, fill=NAVY_LT)

    # Screen area
    margin = 14
    sx0 = x0 + margin
    sy0 = y0 + 60
    sx1 = x1 - margin
    sy1 = y1 - margin
    return sx0, sy0, sx1, sy1


# ── UI Renderers ────────────────────────────────────────────────────────────

def ui_home(draw, sx0, sy0, sx1, sy1):
    sw = sx1 - sx0
    pad = 32

    rr(draw, [sx0, sy0, sx1, sy1], radius=40, fill=CREAM)

    # Status bar
    draw.text((sx0 + 20, sy0 + 14), "9:41", font=F_UI_SM, fill=TEXT_MED)
    # Battery indicator
    rr(draw, [sx1 - 52, sy0 + 16, sx1 - 18, sy0 + 30], radius=3, outline=TEXT_MED, width=1)
    rr(draw, [sx1 - 50, sy0 + 18, sx1 - 30, sy0 + 28], radius=2, fill=SAGE)
    draw.rectangle([sx1 - 18, sy0 + 20, sx1 - 16, sy0 + 26], fill=TEXT_MED)

    # Greeting
    gy = sy0 + 62
    draw.text((sx0 + pad, gy), "Good morning,", font=F_UI_BODY, fill=TEXT_MED)
    draw.text((sx0 + pad, gy + 34), "Welcome back", font=F_UI_LG, fill=TEXT_DARK)

    # TODAY label
    tod_y = gy + 98
    draw.text((sx0 + pad, tod_y), "TODAY", font=F_UI_BOLD_SM, fill=GOLD)
    draw.line([(sx0 + pad + tw(draw, "TODAY", F_UI_BOLD_SM) + 12, tod_y + 10),
               (sx1 - pad, tod_y + 10)], fill=BORDER, width=1)

    # Daily Scale card
    card_y  = tod_y + 38
    card_h  = sy1 - card_y - 98
    rr(draw, [sx0 + pad, card_y, sx1 - pad, card_y + card_h], radius=24, fill=NAVY)

    # Card header
    cy = card_y + 28
    draw.text((sx0 + pad + 24, cy), "TODAY'S DAILY SCALE", font=F_UI_BOLD_SM, fill=GOLD)
    cross(draw, sx1 - pad - 26, cy + 12, 22, GOLD)
    div_y = cy + 46
    draw.line([(sx0 + pad + 24, div_y), (sx1 - pad - 24, div_y)], fill=(50, 70, 110), width=1)

    # Question
    qy = div_y + 22
    for line in wrap(draw, "Is keeping the peace wisdom", F_UI_MD, sw - pad * 2 - 48):
        draw.text((sx0 + pad + 24, qy), line, font=F_UI_MD, fill=CREAM)
        qy += th_px(draw, line, F_UI_MD) + 8
    for line in wrap(draw, "— or avoidance?", F_UI_MD, sw - pad * 2 - 48):
        draw.text((sx0 + pad + 24, qy), line, font=F_UI_MD, fill=CREAM)
        qy += th_px(draw, line, F_UI_MD) + 8

    # A/B chips
    chip_y = qy + 28
    mid_c  = (sx0 + sx1) // 2 - 8
    rr(draw, [sx0 + pad + 24, chip_y, mid_c, chip_y + 54], radius=27, fill=NAVY_LT)
    ctext_in(draw, "A  Keep the peace", sx0 + pad + 24, mid_c, chip_y + 14, F_UI_SM, CREAM)
    rr(draw, [mid_c + 12, chip_y, sx1 - pad - 24, chip_y + 54], radius=27, fill=GOLD)
    ctext_in(draw, "B  Speak the truth", mid_c + 12, sx1 - pad - 24, chip_y + 14, F_UI_SM, NAVY)

    # Progress hint
    hint_y = chip_y + 72
    draw.text((sx0 + pad + 24, hint_y), "Scripture matched:", font=F_UI_ITAL_SM, fill=GOLD_LT)
    draw.text((sx0 + pad + 24, hint_y + 26), '"A gentle answer turns away wrath"', font=F_UI_ITAL_SM, fill=GOLD_LT)
    draw.text((sx0 + pad + 24, hint_y + 52), "— Proverbs 15:1", font=F_UI_ITAL_SM, fill=GOLD)

    # Weigh in button (pinned toward bottom of card)
    btn_y = card_y + card_h - 74
    rr(draw, [sx0 + pad + 24, btn_y, sx1 - pad - 24, btn_y + 56], radius=28, fill=GOLD)
    ctext_in(draw, "Weigh In  →", sx0 + pad + 24, sx1 - pad - 24, btn_y + 14, F_UI_MD, NAVY)

    # Tab bar
    tab_y = sy1 - 92
    draw.rectangle([sx0, tab_y, sx1, sy1], fill=WHITE)
    draw.line([(sx0, tab_y), (sx1, tab_y)], fill=BORDER, width=1)
    tabs = ["Home", "Discern", "Journal", "Settings"]
    tab_w = sw // 4
    for i, tab in enumerate(tabs):
        tx  = sx0 + i * tab_w + tab_w // 2
        col = GOLD if i == 0 else TEXT_LT
        draw.ellipse([tx - 14, tab_y + 14, tx + 14, tab_y + 42], fill=col)
        ttw = tw(draw, tab, F_UI_XS)
        draw.text((tx - ttw // 2, tab_y + 50), tab, font=F_UI_XS, fill=col)


def ui_daily_scale(draw, sx0, sy0, sx1, sy1):
    sw = sx1 - sx0
    pad = 28

    rr(draw, [sx0, sy0, sx1, sy1], radius=40, fill=CREAM)
    draw.text((sx0 + 20, sy0 + 14), "9:41", font=F_UI_SM, fill=TEXT_MED)

    # Header
    rr(draw, [sx0, sy0 + 40, sx1, sy0 + 108], radius=0, fill=NAVY)
    ctext_in(draw, "TODAY'S DAILY SCALE", sx0, sx1, sy0 + 60, F_UI_BOLD_BODY, GOLD)

    # Cross icon
    cx_icon = sx0 + sw // 2
    cross(draw, cx_icon, sy0 + 140, 32, GOLD)

    # Question card
    qc_y = sy0 + 190
    rr(draw, [sx0 + pad, qc_y, sx1 - pad, qc_y + 140],
       radius=18, fill=PARCHMENT, outline=GOLD, width=2)
    qy = qc_y + 18
    for line in wrap(draw, "Should you forgive someone who", F_UI_BODY, sw - pad * 2 - 32):
        ctext_in(draw, line, sx0 + pad + 12, sx1 - pad - 12, qy, F_UI_BODY, TEXT_DARK)
        qy += th_px(draw, line, F_UI_BODY) + 7
    for line in wrap(draw, "hasn't asked for forgiveness?", F_UI_BODY, sw - pad * 2 - 32):
        ctext_in(draw, line, sx0 + pad + 12, sx1 - pad - 12, qy, F_UI_BODY, TEXT_DARK)
        qy += th_px(draw, line, F_UI_BODY) + 7

    # Side A card (navy)
    a_y = qc_y + 158
    rr(draw, [sx0 + pad, a_y, sx1 - pad, a_y + 230], radius=18, fill=NAVY)
    draw.ellipse([sx0 + pad + 18, a_y + 18, sx0 + pad + 58, a_y + 58], fill=GOLD_LT)
    ctext_in(draw, "A", sx0 + pad + 18, sx0 + pad + 58, a_y + 26, F_UI_BOLD_BODY, NAVY)
    draw.text((sx0 + pad + 72, a_y + 18), "Yes — forgiveness", font=F_UI_BOLD_BODY, fill=CREAM)
    draw.text((sx0 + pad + 72, a_y + 48), "is for you", font=F_UI_BOLD_BODY, fill=CREAM)
    draw.line([(sx0 + pad + 18, a_y + 86), (sx1 - pad - 18, a_y + 86)], fill=(50, 70, 110), width=1)
    draw.text((sx0 + pad + 18, a_y + 102), "Release the offence. Your peace", font=F_UI_SM, fill=GOLD_LT)
    draw.text((sx0 + pad + 18, a_y + 128), "doesn't need their apology.", font=F_UI_SM, fill=GOLD_LT)
    draw.text((sx0 + pad + 18, a_y + 160), "Matthew 6:14", font=F_UI_BOLD_SM, fill=GOLD)
    draw.text((sx0 + pad + 18, a_y + 190), '"Forgive us as we forgive others"', font=F_UI_ITAL_SM, fill=GOLD_LT)

    # Side B card (parchment)
    b_y = a_y + 248
    rr(draw, [sx0 + pad, b_y, sx1 - pad, b_y + 230], radius=18,
       fill=PARCHMENT, outline=BORDER, width=1)
    draw.ellipse([sx0 + pad + 18, b_y + 18, sx0 + pad + 58, b_y + 58], fill=GOLD)
    ctext_in(draw, "B", sx0 + pad + 18, sx0 + pad + 58, b_y + 26, F_UI_BOLD_BODY, NAVY)
    draw.text((sx0 + pad + 72, b_y + 18), "Forgiveness", font=F_UI_BOLD_BODY, fill=TEXT_DARK)
    draw.text((sx0 + pad + 72, b_y + 48), "requires repentance", font=F_UI_BOLD_BODY, fill=TEXT_DARK)
    draw.line([(sx0 + pad + 18, b_y + 86), (sx1 - pad - 18, b_y + 86)], fill=BORDER, width=1)
    draw.text((sx0 + pad + 18, b_y + 102), "True reconciliation requires", font=F_UI_SM, fill=TEXT_MED)
    draw.text((sx0 + pad + 18, b_y + 128), "both parties to engage. Luke 17:3", font=F_UI_SM, fill=TEXT_MED)
    draw.text((sx0 + pad + 18, b_y + 160), "Luke 17:3", font=F_UI_BOLD_SM, fill=NAVY)
    draw.text((sx0 + pad + 18, b_y + 190), '"If they repent, forgive them"', font=F_UI_ITAL_SM, fill=TEXT_MED)

    # Italic warning
    note_y = b_y + 252
    for line in wrap(draw, "Weigh carefully. You can only choose once.", F_UI_ITAL, sw - pad * 2):
        ctext_in(draw, line, sx0, sx1, note_y, F_UI_ITAL, TEXT_MED)
        note_y += th_px(draw, line, F_UI_ITAL) + 6


def ui_results(draw, sx0, sy0, sx1, sy1):
    sw  = sx1 - sx0
    pad = 28

    rr(draw, [sx0, sy0, sx1, sy1], radius=40, fill=CREAM)
    draw.text((sx0 + 20, sy0 + 14), "9:41", font=F_UI_SM, fill=TEXT_MED)

    # Header
    rr(draw, [sx0, sy0 + 40, sx1, sy0 + 108], radius=0, fill=NAVY)
    ctext_in(draw, "COMMUNITY RESULTS", sx0, sx1, sy0 + 60, F_UI_BOLD_BODY, GOLD)

    # Question recap
    qy = sy0 + 128
    for line in wrap(draw, "Should you forgive someone who hasn't asked for forgiveness?",
                     F_UI_SM, sw - pad * 2):
        ctext_in(draw, line, sx0 + pad, sx1 - pad, qy, F_UI_SM, TEXT_MED)
        qy += th_px(draw, line, F_UI_SM) + 4

    draw.line([(sx0 + pad, qy + 10), (sx1 - pad, qy + 10)], fill=BORDER, width=1)
    qy += 30

    bar_max = sw - pad * 2

    # Bar A
    draw.text((sx0 + pad, qy), "A", font=F_UI_BOLD_BODY, fill=NAVY)
    pct_a = "63%"
    draw.text((sx1 - pad - tw(draw, pct_a, F_UI_LG), qy - 4), pct_a, font=F_UI_LG, fill=NAVY)
    qy += 36
    rr(draw, [sx0 + pad, qy, sx1 - pad, qy + 22], radius=11, fill=BORDER)
    rr(draw, [sx0 + pad, qy, sx0 + pad + int(bar_max * 0.63), qy + 22], radius=11, fill=NAVY)
    qy += 32
    draw.text((sx0 + pad, qy), "Yes — forgiveness is for you", font=F_UI_SM, fill=TEXT_MED)
    qy += 48

    # Bar B
    draw.text((sx0 + pad, qy), "B", font=F_UI_BOLD_BODY, fill=GOLD)
    pct_b = "37%"
    draw.text((sx1 - pad - tw(draw, pct_b, F_UI_LG), qy - 4), pct_b, font=F_UI_LG, fill=GOLD)
    qy += 36
    rr(draw, [sx0 + pad, qy, sx1 - pad, qy + 22], radius=11, fill=BORDER)
    rr(draw, [sx0 + pad, qy, sx0 + pad + int(bar_max * 0.37), qy + 22], radius=11, fill=GOLD)
    qy += 32
    draw.text((sx0 + pad, qy), "Forgiveness requires repentance", font=F_UI_SM, fill=TEXT_MED)
    qy += 56

    # Stats card
    rr(draw, [sx0 + pad, qy, sx1 - pad, qy + 90], radius=16, fill=PARCHMENT)
    ctext_in(draw, "892 believers weighed in", sx0 + pad, sx1 - pad, qy + 12, F_UI_BOLD_BODY, TEXT_DARK)
    ctext_in(draw, "You're with the majority", sx0 + pad, sx1 - pad, qy + 50, F_UI_SM, SAGE)
    qy += 108

    # Scripture lens callout
    rr(draw, [sx0 + pad, qy, sx1 - pad, qy + 100], radius=16, fill=NAVY)
    draw.text((sx0 + pad + 20, qy + 14), "Scripture Lens:", font=F_UI_BOLD_SM, fill=GOLD)
    draw.text((sx0 + pad + 20, qy + 42), '"Blessed are the merciful, for they"', font=F_UI_ITAL_SM, fill=GOLD_LT)
    draw.text((sx0 + pad + 20, qy + 66), '"shall receive mercy." — Matt 5:7', font=F_UI_ITAL_SM, fill=GOLD_LT)
    qy += 120

    # CTA
    rr(draw, [sx0 + pad, qy, sx1 - pad, qy + 62], radius=31, fill=GOLD)
    ctext_in(draw, "See the Scripture Lens", sx0 + pad, sx1 - pad, qy + 17, F_UI_MD, NAVY)


def ui_journey(draw, sx0, sy0, sx1, sy1):
    sw  = sx1 - sx0
    pad = 26

    rr(draw, [sx0, sy0, sx1, sy1], radius=40, fill=CREAM)
    draw.text((sx0 + 20, sy0 + 14), "9:41", font=F_UI_SM, fill=TEXT_MED)

    # Header
    rr(draw, [sx0, sy0 + 40, sx1, sy0 + 108], radius=0, fill=NAVY)
    ctext_in(draw, "YOUR JOURNEY", sx0, sx1, sy0 + 60, F_UI_BOLD_BODY, GOLD)

    steps = [
        (1, "The Crossroads",          "Share your decision",     False),
        (2, "The Word",                "Matched scriptures",       False),
        (3, "Those Who Walked Before", "Biblical narratives",      False),
        (4, "The Examination",         "Reflection questions",     False),
        (5, "The Stillness",           "90s guided silence",       True),
        (6, "The Fruit",               "Spirit diagnostic",        False),
        (7, "The Prayer",              "Personalised prayer",      False),
    ]

    sy = sy0 + 124
    row_h = 106

    for num, name, desc, highlight in steps:
        bg  = (255, 248, 220) if highlight else PARCHMENT
        bdr = GOLD if highlight else BORDER
        rr(draw, [sx0 + pad, sy, sx1 - pad, sy + row_h - 8],
           radius=16, fill=bg, outline=bdr, width=2 if highlight else 1)

        # Number badge
        bx = sx0 + pad + 22
        by = sy + (row_h - 8) // 2
        badge_fill = GOLD if highlight else (NAVY_LT if num < 5 else BORDER)
        draw.ellipse([bx - 24, by - 24, bx + 24, by + 24], fill=badge_fill)
        num_s = str(num)
        ctext_in(draw, num_s, bx - 24, bx + 24, by - 15, F_UI_BOLD_BODY,
                 NAVY if highlight else CREAM)

        # Text
        tx = bx + 38
        name_f  = F_UI_BOLD_BODY if highlight else F_UI_BODY
        name_col = NAVY if highlight else TEXT_DARK
        draw.text((tx, sy + 14), name, font=name_f, fill=name_col)
        draw.text((tx, sy + 52), desc, font=F_UI_SM, fill=TEXT_MED if not highlight else GOLD)

        # Gold right arrow for highlighted step
        if highlight:
            arr_x = sx1 - pad - 30
            draw.text((arr_x, sy + 32), ">", font=F_UI_BOLD_BODY, fill=GOLD)

        sy += row_h


def ui_stillness(draw, sx0, sy0, sx1, sy1):
    sw  = sx1 - sx0
    sh  = sy1 - sy0
    cx  = (sx0 + sx1) // 2
    cy  = sy0 + sh // 2 - 60

    # Full navy screen
    rr(draw, [sx0, sy0, sx1, sy1], radius=40, fill=NAVY)
    draw.text((sx0 + 20, sy0 + 14), "9:41", font=F_UI_SM, fill=GOLD_LT)

    # Title header
    ctext_in(draw, "THE STILLNESS", sx0, sx1, sy0 + 52, F_UI_BOLD_BODY, GOLD)
    draw.line([(sx0 + 60, sy0 + 88), (sx1 - 60, sy0 + 88)], fill=(50, 70, 110), width=1)

    # Concentric breathing rings
    radii = [(220, 8), (175, 15), (130, 30), (88, 60)]
    for r, alpha in radii:
        a = alpha / 100
        col = tuple(int(NAVY[i] + (GOLD[i] - NAVY[i]) * a) for i in range(3))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)

    # Outer glow ring (outline only)
    draw.ellipse([cx - 225, cy - 225, cx + 225, cy + 225],
                 outline=(50, 70, 40), width=1)

    # Cross in center
    arm = 36
    th2 = 6
    cross_h_y = cy - arm + int(arm * 2 * 0.35)
    draw.rectangle([cx - th2, cy - arm, cx + th2, cy + arm], fill=GOLD_LT)
    draw.rectangle([cx - arm, cross_h_y - th2, cx + arm, cross_h_y + th2], fill=GOLD_LT)

    # Scripture
    scr_y = cy + 248
    for line in wrap(draw, '"Be still, and know that I am God."', F_UI_ITAL, sw - 80):
        ctext_in(draw, line, sx0, sx1, scr_y, F_UI_ITAL, GOLD_LT)
        scr_y += th_px(draw, line, F_UI_ITAL) + 8
    scr_y += 4
    ctext_in(draw, "— Psalm 46:10", sx0, sx1, scr_y, F_UI_SM, GOLD)

    # Timer + progress bar
    timer_y = sy1 - 160
    ctext_in(draw, "0:54", sx0, sx1, timer_y, F_UI_LG, CREAM)
    bar_y = timer_y + 52
    bx = sx0 + 60
    bw = sw - 120
    rr(draw, [bx, bar_y, bx + bw, bar_y + 10], radius=5, fill=(30, 50, 90))
    rr(draw, [bx, bar_y, bx + int(bw * 0.60), bar_y + 10], radius=5, fill=GOLD)
    draw.text((bx, bar_y + 18), "0:00", font=F_UI_XS, fill=(80, 110, 160))
    draw.text((bx + bw - tw(draw, "1:30", F_UI_XS), bar_y + 18), "1:30",
              font=F_UI_XS, fill=(80, 110, 160))


# ── Screenshot definitions ──────────────────────────────────────────────────

SHOTS = [
    {
        "file":      "screenshot-1-home.png",
        "head1":     "Weigh Every Decision",
        "head2":     "with Biblical Wisdom",
        "subtitle":  "AI-Powered Christian Discernment Companion",
        "stars":     True,
        "ui":        ui_home,
    },
    {
        "file":      "screenshot-2-daily-scale.png",
        "head1":     "A New Question",
        "head2":     "Every Morning",
        "subtitle":  "The Daily Scale — Sharpen Your Discernment",
        "stars":     False,
        "ui":        ui_daily_scale,
    },
    {
        "file":      "screenshot-3-results.png",
        "head1":     "See How Others",
        "head2":     "Weighed It",
        "subtitle":  "1,000+ Christians Weighing In Daily",
        "stars":     False,
        "ui":        ui_results,
    },
    {
        "file":      "screenshot-4-journey.png",
        "head1":     "7 Steps of Biblical",
        "head2":     "Discernment",
        "subtitle":  "Rooted in Ignatian & Wesleyan Tradition",
        "stars":     False,
        "ui":        ui_journey,
    },
    {
        "file":      "screenshot-5-stillness.png",
        "head1":     "90 Seconds of",
        "head2":     "Guided Silence",
        "subtitle":  "The Feature No Other App Has",
        "stars":     False,
        "ui":        ui_stillness,
    },
]


def build(cfg):
    img  = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(img)

    # Gold line at very bottom
    draw.rectangle([0, H - 4, W, H], fill=GOLD)

    y = 90

    # Cross icon
    cross(draw, W // 2, y + 24, 38, GOLD)
    y += 68

    y += 32  # gap

    # Headline 1 — gold
    h1_h = th_px(draw, cfg["head1"], F_HEAD)
    ctext(draw, cfg["head1"], y, F_HEAD, GOLD)
    y += h1_h + 16

    # Headline 2 — white
    h2_h = th_px(draw, cfg["head2"], F_SUBHEAD)
    ctext(draw, cfg["head2"], y, F_SUBHEAD, WHITE)
    y += h2_h + 58

    # Phone mockup
    phone_top = y
    sx0, sy0, sx1, sy1 = draw_phone(draw, W // 2, phone_top)
    cfg["ui"](draw, sx0, sy0, sx1, sy1)
    y = phone_top + PHONE_H + 52

    # Subtitle
    for line in wrap(draw, cfg["subtitle"], F_SUBTITLE, W - 160):
        ctext(draw, line, y, F_SUBTITLE, GOLD_DIM)
        y += th_px(draw, line, F_SUBTITLE) + 8

    # Stars (screenshot 1 only)
    if cfg["stars"]:
        y += 16
        ctext(draw, "★★★★★", y, F_STARS, GOLD)
        y += th_px(draw, "★★★★★", F_STARS) + 10
        ctext(draw, "4.8 Rating  ·  Christian Discernment", y, F_SUBTITLE, GOLD_LT)

    out = os.path.join(OUT_DIR, cfg["file"])
    img.save(out, "PNG", optimize=True)
    print(f"  OK  {cfg['file']}")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"\nBibleDiscern Google Play Screenshots v2 -- {W}x{H}px")
    print("-" * 56)
    for cfg in SHOTS:
        build(cfg)
    print(f"\n  5 screenshots saved to:\n   {OUT_DIR}\n")


if __name__ == "__main__":
    main()

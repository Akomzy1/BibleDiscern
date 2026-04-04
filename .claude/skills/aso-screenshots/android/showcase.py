"""
Generate a side-by-side showcase of all 5 Android screenshots.
Output: working/showcase.png
"""
from PIL import Image, ImageDraw, ImageFont
import os

FINAL_DIR = os.path.join(os.path.dirname(__file__), "final")
WORK_DIR  = os.path.join(os.path.dirname(__file__), "working")

SCREENSHOTS = [
    "01_discern.png",
    "02_weigh.png",
    "03_listen.png",
    "04_grow.png",
    "05_remember.png",
]

THUMB_W = 360
THUMB_H = 640
PAD     = 24
NAVY    = (27, 42, 74)
GOLD    = (200, 164, 94)
CREAM   = (253, 246, 236)

def main():
    os.makedirs(WORK_DIR, exist_ok=True)
    thumbs = []
    for name in SCREENSHOTS:
        path = os.path.join(FINAL_DIR, name)
        if not os.path.exists(path):
            print(f"  MISSING: {name}")
            continue
        img = Image.open(path).convert("RGB")
        img = img.resize((THUMB_W, THUMB_H), Image.LANCZOS)
        thumbs.append(img)

    n = len(thumbs)
    total_w = n * THUMB_W + (n + 1) * PAD
    total_h = THUMB_H + PAD * 2 + 80  # extra for title bar

    canvas = Image.new("RGB", (total_w, total_h), NAVY)
    draw   = ImageDraw.Draw(canvas)

    # Gold top bar
    draw.rectangle([0, 0, total_w, 5], fill=GOLD)

    # Title
    try:
        fnt = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 28)
        fnt_sm = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 18)
    except Exception:
        fnt = fnt_sm = ImageFont.load_default()

    title = "BibleDiscern  --  Android Play Store Screenshots"
    bb = draw.textbbox((0, 0), title, font=fnt)
    draw.text(((total_w - (bb[2]-bb[0])) // 2, 16), title, font=fnt, fill=GOLD)

    sub = "1080 x 1920px  |  Google Play portrait standard"
    bb2 = draw.textbbox((0, 0), sub, font=fnt_sm)
    draw.text(((total_w - (bb2[2]-bb2[0])) // 2, 52), sub, font=fnt_sm, fill=CREAM)

    # Paste thumbnails
    labels = ["DISCERN", "WEIGH", "LISTEN", "GROW", "REMEMBER"]
    for i, (thumb, label) in enumerate(zip(thumbs, labels)):
        x = PAD + i * (THUMB_W + PAD)
        y = 80 + PAD
        canvas.paste(thumb, (x, y))
        # Label beneath
        lb_bb = draw.textbbox((0, 0), label, font=fnt_sm)
        lx = x + (THUMB_W - (lb_bb[2]-lb_bb[0])) // 2
        draw.text((lx, y + THUMB_H + 6), label, font=fnt_sm, fill=GOLD)

    out = os.path.join(WORK_DIR, "showcase.png")
    canvas.save(out, "PNG")
    print(f"Showcase saved: {out}")

if __name__ == "__main__":
    main()

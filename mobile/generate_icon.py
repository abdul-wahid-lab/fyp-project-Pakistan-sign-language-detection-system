"""
Generates app_icon.png (1024x1024) matching the LinguaSign logo:
  - Green gradient rounded square background
  - White hand SVG path centered inside
"""
from PIL import Image, ImageDraw
import math

SIZE = 1024
RADIUS = int(SIZE * 0.22)  # rounded corner radius

# Green gradient colours
GREEN_TOP  = (46, 213, 115)   # #2ED573  (top-left)
GREEN_BOT  = (28, 163, 78)    # #1CA34E  (bottom-right)

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# ── Gradient background (diagonal) ──────────────────────────
grad = Image.new("RGBA", (SIZE, SIZE))
gd   = ImageDraw.Draw(grad)
for y in range(SIZE):
    for x in range(SIZE):
        t = (x + y) / (SIZE * 2)
        c = lerp(GREEN_TOP, GREEN_BOT, t)
        gd.point((x, y), c + (255,))

# Rounded-square mask
mask = Image.new("L", (SIZE, SIZE), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, SIZE-1, SIZE-1], radius=RADIUS, fill=255)

img.paste(grad, mask=mask)

# ── Hand icon (scaled SVG path → polygon approximation) ──────
# The SVG viewBox is 0 0 24 24. We scale to fill ~55 % of the icon.
ICON = int(SIZE * 0.55)
OFF  = (SIZE - ICON) // 2          # centre offset
S    = ICON / 24                    # scale factor

draw2 = ImageDraw.Draw(img)

# Draw the hand as thick white strokes using line segments
# Path: M8 13V5.5a1.5 … hand outline broken into segments
sw = int(SIZE * 0.055)             # stroke width

def pt(x, y):
    return (OFF + x * S, OFF + y * S)

def arc_pts(cx, cy, r, a0, a1, steps=24):
    pts = []
    for i in range(steps + 1):
        a = math.radians(a0 + (a1 - a0) * i / steps)
        pts.append(pt(cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts

def draw_stroke(points, w):
    for i in range(len(points) - 1):
        draw2.line([points[i], points[i+1]], fill=(255, 255, 255, 255), width=w)
        draw2.ellipse([
            points[i][0]-w//2, points[i][1]-w//2,
            points[i][0]+w//2, points[i][1]+w//2
        ], fill=(255, 255, 255, 255))

# Finger 1 (left outer) x=8: from y=13 up to y=5.5, arc top
f1 = [pt(8, 13)] + [pt(8, 5.5)] + arc_pts(9.5, 5.5, 1.5, 180, 0)
draw_stroke(f1, sw)

# Finger 1 right side down to y=11
draw_stroke([pt(11, 5.5), pt(11, 11)], sw)

# Finger 2 x=11: from ~y=10.5 up to y=4, arc top
f2 = [pt(11, 10.5)] + [pt(11, 4)] + arc_pts(12.5, 4, 1.5, 180, 0)
draw_stroke(f2, sw)

# Finger 2 right down to y=10.5
draw_stroke([pt(14, 4), pt(14, 10.5)], sw)

# Finger 3 x=14: from ~y=10 up to y=5.5, arc top
f3 = [pt(14, 10)] + [pt(14, 5.5)] + arc_pts(15.5, 5.5, 1.5, 180, 0)
draw_stroke(f3, sw)

# Right side down into palm
draw_stroke([pt(17, 5.5), pt(17, 14)], sw)

# Palm bottom curve (simplified)
palm = [
    pt(17, 14), pt(17, 16), pt(16.5, 18.5), pt(15, 20.5),
    pt(13, 21), pt(11, 20.5), pt(9.5, 19),  pt(8.5, 17),
    pt(7.5, 15.5), pt(6.5, 14), pt(5.8, 13.2),
    pt(5.5, 12.5), pt(6.0, 11.5), pt(7.0, 11.5), pt(8, 13)
]
draw_stroke(palm, sw)

# Round caps on all stroke ends
for p in [pt(8,13), pt(17,14)]:
    draw2.ellipse([p[0]-sw//2, p[1]-sw//2, p[0]+sw//2, p[1]+sw//2],
                  fill=(255,255,255,255))

# ── Save ────────────────────────────────────────────────────
out = r"C:\Users\Abdul Wahid\Downloads\4-2026 phone\mobile\assets\icon\app_icon.png"
import os; os.makedirs(os.path.dirname(out), exist_ok=True)
img.save(out)
print(f"Saved {out}")

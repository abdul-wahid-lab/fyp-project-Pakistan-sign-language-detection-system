"""Generate LinguaSign mipmap launcher icons for Android."""
from PIL import Image, ImageDraw
import math, os

SIZE = 1024
RADIUS = int(SIZE * 0.22)
GREEN_TOP = (46, 213, 115)
GREEN_BOT  = (28, 163, 78)

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))

img  = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
grad = Image.new("RGBA", (SIZE, SIZE))
gd   = ImageDraw.Draw(grad)
for y in range(SIZE):
    for x in range(SIZE):
        t = (x + y) / (SIZE * 2)
        gd.point((x, y), lerp(GREEN_TOP, GREEN_BOT, t) + (255,))

mask = Image.new("L", (SIZE, SIZE), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, SIZE-1, SIZE-1], radius=RADIUS, fill=255)
img.paste(grad, mask=mask)

ICON = int(SIZE * 0.55)
OFF  = (SIZE - ICON) // 2
S    = ICON / 24
d2   = ImageDraw.Draw(img)
sw   = int(SIZE * 0.055)

def pt(x, y):
    return (OFF + x*S, OFF + y*S)

def arc_pts(cx, cy, r, a0, a1, steps=24):
    pts = []
    for i in range(steps + 1):
        a = math.radians(a0 + (a1-a0)*i/steps)
        pts.append(pt(cx + r*math.cos(a), cy + r*math.sin(a)))
    return pts

def stroke(pts, w):
    for i in range(len(pts) - 1):
        d2.line([pts[i], pts[i+1]], fill=(255,255,255,255), width=w)
        for p in (pts[i], pts[i+1]):
            d2.ellipse([p[0]-w//2, p[1]-w//2, p[0]+w//2, p[1]+w//2], fill=(255,255,255,255))

stroke([pt(8,13)] + [pt(8,5.5)] + arc_pts(9.5,5.5,1.5,180,0), sw)
stroke([pt(11,5.5), pt(11,11)], sw)
stroke([pt(11,10.5)] + [pt(11,4)] + arc_pts(12.5,4,1.5,180,0), sw)
stroke([pt(14,4), pt(14,10.5)], sw)
stroke([pt(14,10)] + [pt(14,5.5)] + arc_pts(15.5,5.5,1.5,180,0), sw)
stroke([pt(17,5.5), pt(17,14)], sw)
stroke([pt(17,14),pt(17,16),pt(16.5,18.5),pt(15,20.5),pt(13,21),pt(11,20.5),
        pt(9.5,19),pt(8.5,17),pt(7.5,15.5),pt(6.5,14),pt(5.8,13.2),
        pt(5.5,12.5),pt(6.0,11.5),pt(7.0,11.5),pt(8,13)], sw)

bg = Image.new("RGBA", (SIZE, SIZE), (255,255,255,255))
bg.paste(img, mask=img.split()[3])
src = bg.convert("RGB")

res_dir = os.path.join(os.path.dirname(__file__),
                       "android", "app", "src", "main", "res")
for folder, size in [("mipmap-mdpi",48),("mipmap-hdpi",72),
                     ("mipmap-xhdpi",96),("mipmap-xxhdpi",144),("mipmap-xxxhdpi",192)]:
    d = os.path.join(res_dir, folder)
    os.makedirs(d, exist_ok=True)
    src.resize((size, size), Image.LANCZOS).save(os.path.join(d, "ic_launcher.png"))
    print(f"  {folder}/ic_launcher.png  ({size}x{size})")

print("Done.")

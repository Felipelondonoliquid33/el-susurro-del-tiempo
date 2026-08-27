# -*- coding: utf-8 -*-
"""
build-archive.py — Pipeline de arte para "El Susurro del Tiempo".

Toma el material bruto de `marketing el susurro dle tiempo/imagenes promo…`,
lo cura (sólo material de archivo real, nada de stock moderno) y lo revela
en el tono sepia del sistema de diseño para que todas las piezas convivan
sobre el pergamino sin parecer un collage.

Uso:  python tools/build-archive.py
"""
import json
import os
import sys

from PIL import Image, ImageEnhance, ImageOps

SRC = r"C:\Users\rapma\Documents\marketing el susurro dle tiempo\imagenes promo susurro del tiempo"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "assets", "archive")

# ── Paleta del sistema de diseño ────────────────────────────────────────────
# El duotono va del sumi cálido (sombras) al pergamino (altas luces), de modo
# que cualquier foto — sea albúmina de 1910 o un Kodak de los 70 — cae dentro
# de la misma familia cromática que el fondo.
SHADOW = (38, 30, 24)      # sumi cálido
HIGHLIGHT = (243, 236, 222)  # pergamino

# ── Curaduría ───────────────────────────────────────────────────────────────
# Cada entrada: (slug, ruta relativa en el archivo bruto, ancho objetivo)
# Descartado deliberadamente: stock moderno (Quito, autos de prensa, carritos
# de supermercado, facturas, mascotas, medicina) — es material de investigación
# de los capítulos, no identidad de marca.

PLATES = [
    # ── Paisajes y escenas de archivo — columnas de la galería ──────────────
    ("paisaje-rio",        "1-3/28.jpg",  2400),
    ("paisaje-puente",     "1-3/20.jpg",  1600),
    ("paisaje-lomas",      "1-3/15.jpg",  1600),
    ("paisaje-arboleda",   "1-3/10.jpg",  1600),
    ("paisaje-quebrada",   "1-3/16.jpg",  2000),
    ("paisaje-vias",       "5/4.jpg",     1600),
    ("paisaje-bosque",     "4/2.jpg",     1400),
    ("paisaje-valle",      "6/8.jpg",     1400),
    ("paisaje-caserio",    "10/1.jpg",    1400),

    # ── Gente: retratos y escenas familiares ────────────────────────────────
    ("gente-pareja-roca",  "7/11.jpg",    1400),
    ("gente-rio",          "5/14.jpg",    1400),
    ("gente-familia-casa", "8/1.jpg",     1200),
    ("gente-dos-hombres",  "8/3.jpg",     1200),
    ("gente-jinete",       "8/5.jpg",     1600),
    ("gente-mujeres",      "4/6.jpg",     1400),
    ("gente-grupo",        "9/18.jpg",     900),
    ("gente-hermanos",     "9/15.jpg",    1200),
    ("gente-bautizo",      "31/8.jpeg",    900),

    # ── Retratos cerrados — tarjetas de capítulo ────────────────────────────
    ("retrato-senora",     "9/9.jpg",     1100),
    ("retrato-joven",      "8/4.jpg",     1200),
    ("retrato-dos-mujeres","11/4.jpg",    1400),
    ("retrato-nina",       "31/1.jpeg",   1100),
    ("retrato-mujer-silla","13/1.jpg",     900),
    ("retrato-novia",      "13/2.jpg",     460),

    # ── Animales y campo ────────────────────────────────────────────────────
    ("campo-caballos",     "5/8.jpg",      900),
    ("campo-vaca",         "1-3/8.jpg",    900),
    ("campo-yunta",        "10/3.jpg",     900),
    ("campo-potro",        "9/4.jpg",     1200),

    # ── Documentos: cartas, libretas, prensa ────────────────────────────────
    ("doc-carta",          "1-3/21.jpg",  1800),
    ("doc-carta-larga",    "1-3/24.jpg",  1600),
    ("doc-libreta",        "1-3/3.jpg",   1400),
    ("doc-manuscrito",     "5/5.jpg",     1600),
    ("doc-pliego",         "5/6.jpg",     1800),
    ("doc-oficial",        "5/3.jpg",     1800),
    ("doc-ledger",         "31/2.jpg",    1800),
    ("doc-mecanografiado", "6/6.jpg",     1400),
    ("doc-cuaderno",       "6/7.jpg",     1200),
    ("doc-recorte-boda",   "5/15.jpg",    1200),
    ("doc-prensa",         "29/5.jpg",     900),

    # ── Objetos: las reliquias ──────────────────────────────────────────────
    ("obj-maquina",        "9/1.jpeg",    1400),
    ("obj-maquina-manos",  "1-3/22.jpeg", 1400),
    ("obj-baul",           "1-3/17.jpeg", 1500),
    ("obj-baul-lateral",   "12/5.jpeg",   1500),
    ("obj-singer",         "1-3/32.jpeg", 1400),
    ("obj-rosario",        "1-3/19.jpeg", 1400),
    ("obj-rosario-biblia", "9/8.jpeg",    1300),
    ("obj-arana",          "12/8.jpeg",   1400),
    ("obj-arana-salon",    "13/6.jpeg",   1100),
    ("obj-lentes-libro",   "1-3/31.jpeg", 1500),
    ("obj-anillo",         "5/13.jpeg",   1300),
    ("obj-candelabro",     "1-3/4.jpeg",  1200),
    ("obj-encaje",         "13/4.jpg",     900),
    ("obj-libro-floral",   "31/5.jpg",    1500),
    ("obj-santo",          "30/12.jpg",   1200),
    ("obj-busto",          "30/1.jpg",    1600),
]


def duotone(im: Image.Image) -> Image.Image:
    """Mapea la luminancia a una rampa sumi→pergamino."""
    gray = ImageOps.grayscale(im)
    # Un poco de contraste antes del mapeo: el material escaneado suele venir plano.
    gray = ImageEnhance.Contrast(gray).enhance(1.12)
    toned = ImageOps.colorize(gray, black=SHADOW, white=HIGHLIGHT)
    # Devolvemos una pizca del color original para que el papel conserve vida.
    return Image.blend(toned, im.convert("RGB"), 0.10)


def vignette(im: Image.Image, strength: float = 0.16) -> Image.Image:
    """Viñeta radial suave: asienta la foto en la página en vez de recortarla."""
    w, h = im.size
    # Construimos la máscara en baja resolución y la escalamos: mismo resultado,
    # una fracción del coste.
    sw, sh = 96, 96
    mask = Image.new("L", (sw, sh))
    px = mask.load()
    cx, cy = sw / 2, sh / 2
    maxd = (cx * cx + cy * cy) ** 0.5
    for y in range(sh):
        for x in range(sw):
            d = (((x - cx) ** 2 + (y - cy) ** 2) ** 0.5) / maxd
            px[x, y] = int(255 * max(0.0, 1.0 - strength * d * d * 2.2))
    mask = mask.resize((w, h), Image.LANCZOS)
    dark = Image.new("RGB", (w, h), SHADOW)
    return Image.composite(im, dark, mask)


def process(rel: str, slug: str, target_w: int) -> dict | None:
    src = os.path.join(SRC, rel.replace("/", os.sep))
    if not os.path.exists(src):
        print(f"  !! falta {rel}")
        return None

    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    orig = im.size

    # Nunca ampliamos: el material de archivo no perdona el upscaling.
    if im.width > target_w:
        im = im.resize((target_w, round(im.height * target_w / im.width)), Image.LANCZOS)

    im = duotone(im)
    im = vignette(im)
    im = ImageEnhance.Brightness(im).enhance(1.02)

    os.makedirs(OUT, exist_ok=True)
    full = os.path.join(OUT, f"{slug}.webp")
    im.save(full, "WEBP", quality=86, method=6)

    # Miniatura para grillas y tarjetas: evita descargar 2400px para un hover.
    thumb = im.copy()
    thumb.thumbnail((640, 640), Image.LANCZOS)
    thumb.save(os.path.join(OUT, f"{slug}@sm.webp"), "WEBP", quality=84, method=6)

    return {
        "slug": slug,
        "src": f"/assets/archive/{slug}.webp",
        "thumb": f"/assets/archive/{slug}@sm.webp",
        "w": im.width,
        "h": im.height,
        "origin": rel,
        "originSize": list(orig),
    }


def main() -> int:
    print(f"→ {len(PLATES)} placas")
    manifest = []
    for slug, rel, w in PLATES:
        entry = process(rel, slug, w)
        if entry:
            manifest.append(entry)
            print(f"  ✓ {slug:<22} {entry['w']}x{entry['h']}")

    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2, ensure_ascii=False)

    total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
    print(f"\n{len(manifest)} placas reveladas — {total / 1e6:.1f} MB en {OUT}")
    return 0 if len(manifest) == len(PLATES) else 1


if __name__ == "__main__":
    sys.exit(main())

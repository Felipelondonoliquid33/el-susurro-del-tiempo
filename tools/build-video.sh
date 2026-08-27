#!/usr/bin/env bash
# build-video.sh — Revela los videos de marketing en el mismo sepia que las fotos.
#
# Los originales son 1080p60 con luz de ventana muy fría; sin gradación chocan
# contra el pergamino. Aquí se desaturan, se vuelcan a cálido, se les baja el
# frame rate a 24 (lectura cinematográfica, no videollamada) y se les añade un
# grano leve para que casen con el material de archivo.
#
# Uso:  bash tools/build-video.sh
set -euo pipefail

SRC="C:/Users/rapma/Documents/marketing el susurro dle tiempo/imagenes promo susurro del tiempo"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/assets/video"
mkdir -p "$OUT"

# Cadena de revelado compartida por todos los clips.
GRADE="hue=s=0.14,\
colorbalance=rs=0.14:gs=0.03:bs=-0.12:rm=0.11:gm=0.03:bm=-0.10:rh=0.07:gh=0.02:bh=-0.07,\
eq=contrast=1.07:brightness=0.015:gamma=1.03,\
noise=alls=5:allf=t"

# render <archivo-fuente> <inicio> <duración> <slug> <filtro-de-encuadre>
render() {
  local src="$1" ss="$2" dur="$3" slug="$4" frame="$5"

  echo "  · $slug"
  ffmpeg -y -v error -ss "$ss" -t "$dur" -i "$SRC/$src" \
    -an -vf "${frame},${GRADE},fps=24,format=yuv420p" \
    -c:v libx264 -crf 30 -preset slow -profile:v high -movflags +faststart \
    "$OUT/$slug.mp4"

  ffmpeg -y -v error -ss "$ss" -t "$dur" -i "$SRC/$src" \
    -an -vf "${frame},${GRADE},fps=24" \
    -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 \
    "$OUT/$slug.webm"

  # Póster: primer fotograma ya gradado, para que no haya destello de color
  # antes de que el video arranque.
  ffmpeg -y -v error -ss "$ss" -i "$SRC/$src" \
    -vf "${frame},${GRADE}" -frames:v 1 "$OUT/$slug-poster.webp"
}

echo "→ revelando clips"

# Plano medio: la lectura en voz alta. Es el corazón de la galería.
render "7 Video.mp4" 34 22 "lectura" "crop=1080:1080:420:0,scale=900:900"

# Retrato vertical del mismo plano, para el móvil.
render "7 Video.mp4" 34 22 "lectura-vertical" "crop=810:1080:555:0,scale=720:960"

# Plano general con la Singer en cuadro: enlaza el video con los objetos.
render "6 Video.mp4" 62 20 "escritorio" "crop=1440:810:240:135,scale=1280:720"

ls -la "$OUT"
echo "listo"

#!/bin/bash
# Build paket, commit, lalu unggah ke GitHub dalam satu perintah.
# Pakai:  ./tools/publish.sh "pesan perubahan"   (pesan boleh dikosongkan)
set -e
cd "$(dirname "$0")/.."
# Penanda versi supaya browser tidak memakai CSS/JS lama dari cache
V=$(cat css/styles.css js/app.js | shasum | cut -c1-10)
sed -i '' -E "s#css/styles\.css(\?v=[0-9a-f]+)?#css/styles.css?v=$V#; s#js/app\.js(\?v=[0-9a-f]+)?#js/app.js?v=$V#" index.html
python3 tools/build.py
git add -A
if git diff --cached --quiet; then
  echo "Tidak ada perubahan baru. GitHub sudah versi terbaru."
  exit 0
fi
MSG="${1:-Update web $(date '+%d-%m-%Y %H:%M')}"
git commit -q -m "$MSG"
git pull -q --rebase origin main
git push -q origin main
echo "Terunggah ke GitHub. Web di GitHub Pages diperbarui dalam 1–2 menit."

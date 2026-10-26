#!/bin/bash
# Build paket, commit, lalu unggah ke GitHub dalam satu perintah.
# Pakai:  ./tools/publish.sh "pesan perubahan"   (pesan boleh dikosongkan)
set -e
cd "$(dirname "$0")/.."
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

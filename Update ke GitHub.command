#!/bin/bash
# Klik dua kali file ini di Finder untuk build + unggah ke GitHub.
cd "$(dirname "$0")"
./tools/publish.sh
echo; read -n 1 -s -r -p "Tekan tombol apa saja untuk menutup…"

#!/bin/bash
# Klik dua kali file ini di Finder: setiap file web disimpan, otomatis diunggah ke GitHub.
cd "$(dirname "$0")"
python3 tools/autosync.py

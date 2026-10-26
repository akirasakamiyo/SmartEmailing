"""Sinkron otomatis: setiap kali file web disimpan, langsung diunggah ke GitHub.

Jalankan:  python3 tools/autosync.py      (hentikan dengan Ctrl+C)
Menunggu 10 detik setelah perubahan terakhir, lalu menjalankan tools/publish.sh.
"""
import pathlib, subprocess, time

ROOT = pathlib.Path(__file__).resolve().parent.parent
WATCH = ["index.html", "css", "js", "assets", "README.md"]
JEDA = 10  # detik tanpa perubahan sebelum diunggah


def snapshot():
    files = {}
    for w in WATCH:
        p = ROOT / w
        for f in ([p] if p.is_file() else p.rglob("*") if p.exists() else []):
            if f.is_file() and not f.name.startswith("."):
                files[str(f)] = f.stat().st_mtime
    return files


print(f"Sinkron otomatis aktif untuk {ROOT.name}. Simpan file, lalu tunggu {JEDA} detik. Ctrl+C untuk berhenti.")
last, changed_at = snapshot(), None
try:
    while True:
        time.sleep(2)
        now = snapshot()
        if now != last:
            last, changed_at = now, time.time()
            print("Perubahan terdeteksi, menunggu kamu selesai menyimpan…")
        if changed_at and time.time() - changed_at >= JEDA:
            changed_at = None
            stamp = time.strftime("%d-%m-%Y %H:%M")
            r = subprocess.run(["bash", str(ROOT / "tools/publish.sh"), f"Sinkron otomatis {stamp}"], cwd=ROOT)
            print("Selesai." if r.returncode == 0 else "Gagal mengunggah. Cek koneksi internet atau login GitHub.")
            last = snapshot()
except KeyboardInterrupt:
    print("\nSinkron otomatis dihentikan.")

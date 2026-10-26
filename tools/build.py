"""Bangun paket all-in-one Smart Emailing.

Hasil (folder dist/):
  - SmartEmailing_Tim7_offline.html : satu file berisi HTML + CSS + JS + ikon.
  - SmartEmailing_Tim7.zip          : paket folder lengkap untuk diunggah ke LMS.
Jalankan dari folder proyek:  python3 tools/build.py
"""
import base64, pathlib, re, zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)

html = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "css/styles.css").read_text(encoding="utf-8")
js = (ROOT / "js/app.js").read_text(encoding="utf-8").replace("</script", "<\\/script")
icon = base64.b64encode((ROOT / "assets/img/favicon.svg").read_bytes()).decode()

html = html.replace('<link rel="stylesheet" href="css/styles.css">', f"<style>\n{css}\n</style>")
html = html.replace('<script src="js/app.js"></script>', f"<script>\n{js}\n</script>")
html = html.replace('href="assets/img/favicon.svg"', f'href="data:image/svg+xml;base64,{icon}"')
assert not re.search(r'(src|href)="(https?:)?//', html), "Masih ada tautan eksternal!"
single = DIST / "SmartEmailing_Tim7_offline.html"
single.write_text(html, encoding="utf-8")

zpath = DIST / "SmartEmailing_Tim7.zip"
with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
    for p in ["index.html", "css/styles.css", "js/app.js", "README.md"]:
        z.write(ROOT / p, f"SmartEmailing_Tim7/{p}")
    for img in (ROOT / "assets/img").glob("*.svg"):
        z.write(img, f"SmartEmailing_Tim7/assets/img/{img.name}")
    for v in (ROOT / "assets/video").glob("*.mp4"):
        z.write(v, f"SmartEmailing_Tim7/assets/video/{v.name}")

print(f"OK  {single.name} ({single.stat().st_size // 1024} KB)")
print(f"OK  {zpath.name} ({zpath.stat().st_size // 1024} KB)")

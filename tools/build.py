"""Bangun paket Smart Emailing.

Hasil (folder dist/):
  - SmartEmailing_Tim7_offline.html : satu file (HTML + CSS + JS + ikon). Buka offline dengan klik dua kali.
  - SmartEmailing_Tim7.zip          : paket folder web biasa.
  - SmartEmailing_Tim7_SCORM.zip    : paket SCORM 1.2 untuk LMS (Moodle, Canvas, dll).
                                      Nilai evaluasi & status lulus dikirim ke LMS.
Jalankan dari folder proyek:  python3 tools/build.py
"""
import base64, pathlib, re, zipfile

STAMP = (2026, 1, 1, 0, 0, 0)  # tanggal tetap supaya isi zip sama = file zip sama


def put(z, arcname, data):
    """Tulis file ke zip dengan cap waktu tetap (hasil build selalu identik)."""
    info = zipfile.ZipInfo(arcname, date_time=STAMP)
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = 0o644 << 16
    z.writestr(info, data)

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

# Paket folder web biasa
zpath = DIST / "SmartEmailing_Tim7.zip"
with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
    for p in ["index.html", "css/styles.css", "js/app.js", "README.md"]:
        put(z, f"SmartEmailing_Tim7/{p}", (ROOT / p).read_bytes())
    for img in sorted((ROOT / "assets/img").glob("*.svg")):
        put(z, f"SmartEmailing_Tim7/assets/img/{img.name}", img.read_bytes())
    for v in sorted((ROOT / "assets/video").glob("*.mp4")):
        put(z, f"SmartEmailing_Tim7/assets/video/{v.name}", v.read_bytes())

# Paket SCORM 1.2 (imsmanifest.xml harus berada di akar zip)
MANIFEST = """<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="SmartEmailingTim7" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="ORG-SE">
    <organization identifier="ORG-SE">
      <title>Smart Emailing</title>
      <item identifier="ITEM-SE" identifierref="RES-SE">
        <title>Smart Emailing: Pelatihan Menulis Email Lamaran Kerja</title>
        <adlcp:masteryscore>75</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-SE" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>
"""
spath = DIST / "SmartEmailing_Tim7_SCORM.zip"
with zipfile.ZipFile(spath, "w", zipfile.ZIP_DEFLATED) as z:
    put(z, "imsmanifest.xml", MANIFEST)
    put(z, "index.html", html)

for f in (single, zpath, spath):
    print(f"OK  {f.name} ({f.stat().st_size // 1024} KB)")

# Smart Emailing — Tim 7

Modul pelatihan interaktif untuk belajar menulis email lamaran kerja yang rapi dan sopan, ditujukan untuk fresh graduate.
Bentuknya modul 16:9: sampul, menu materi, 13 scene (S01–S13), latihan soal, dan evaluasi.

## Cara membuka (offline)
- Klik dua kali `dist/SmartEmailing_Tim7_offline.html`. Semua aset ada di dalam satu file ini.
- Atau buka `index.html` di folder ini.
- Tidak butuh internet, akun, ataupun layanan luar (Google Forms, Quizizz, dan sejenisnya).

## Untuk LMS
Unggah `dist/SmartEmailing_Tim7.zip` (paket folder) atau `dist/SmartEmailing_Tim7_offline.html` (satu file).

## Publikasi lewat GitHub Desktop + GitHub Pages
1. Buka **GitHub Desktop** → **File → Add Local Repository…** → pilih folder `SmartEmailing_Tim7`.
2. Klik **Publish repository**. Hilangkan centang *Keep this code private* kalau mau dipublikasikan lewat Pages.
3. Buka repositorinya di github.com → **Settings → Pages** → *Source*: **Deploy from a branch** → Branch **main**, folder **/(root)** → **Save**.
4. Tunggu 1–2 menit. Webnya tampil di `https://<username>.github.io/SmartEmailing_Tim7/`.
5. Kalau nanti ada perubahan: jalankan `python3 tools/build.py`, lalu di GitHub Desktop isi *Summary* → **Commit to main** → **Push origin**.

## Struktur folder
```
SmartEmailing_Tim7/
├── index.html          ← halaman utama (dipakai GitHub Pages)
├── css/styles.css      ← tampilan (marun · krem · emas, bingkai 16:9)
├── js/app.js           ← isi materi, scene, aktivitas, latihan, evaluasi
├── assets/img/         ← logo dan favicon
├── tools/build.py      ← membuat paket offline di dist/
└── dist/               ← paket siap kirim (offline .html dan .zip)
```

## Isi per scene
| Kode | Halaman | Aktivitas |
|---|---|---|
| S01 | Selamat Datang | Video pembuka (animasi + teks narasi) |
| S02 | Kegunaan Email di Dunia Kerja | Klik informasi |
| S03 | Bagian-Bagian Email | Seret & letakkan |
| S04 | Subject, Salam Pembuka, dan Penutup | Studi kasus + kuis |
| S05 | Susunan Email Lamaran Kerja | Klik bagian email |
| S06 | Memperkenalkan Diri dan Mengirim CV | Simulasi menulis email |
| S07 | Kesalahan yang Sering Terjadi | Temukan 6 kesalahan |
| S08 | Praktik Menulis Email Lamaran | Form + daftar periksa + contoh jawaban |
| S09 | CC, BCC, dan Waktu Mengirim | Animasi + jam + 2 kuis |
| S10 | Follow-up ke HR | Pilih langkahmu |
| S11 | Bahasa yang Formal dan Sopan | 3 kasus pilih kalimat |
| L | Latihan Soal | 25 soal campuran + pembahasan |
| S12 | Evaluasi | 8 soal tanpa pilihan ganda, hanya nilai akhir (batas lulus 75) |
| S13 | Penutup | Rangkuman + masukan |

## Membuat ulang paket setelah mengedit
```
python3 tools/build.py
```

# Smart Emailing — Tim 7

Modul pelatihan interaktif untuk belajar menulis email lamaran kerja yang rapi dan sopan, ditujukan untuk fresh graduate.
Tata letaknya mengikuti gaya halaman pelajaran: beranda, katalog materi, 13 scene (S01–S13) dengan sidebar daftar scene, latihan soal, dan evaluasi.

## Cara membuka (offline)
- Klik dua kali `dist/SmartEmailing_Tim7_offline.html`. Semua aset ada di dalam satu file ini, tidak butuh internet.
- Tidak ada akun, Google Forms, Quizizz, atau layanan luar lainnya.

## Untuk LMS
| File | Dipakai untuk |
|---|---|
| `dist/SmartEmailing_Tim7_SCORM.zip` | **Paket SCORM 1.2.** Unggah sebagai aktivitas SCORM (Moodle: *Add an activity → SCORM package*). Status belajar dan nilai evaluasi otomatis tercatat di LMS (lulus bila nilai ≥ 75). |
| `dist/SmartEmailing_Tim7_offline.html` | Satu file HTML. Bisa diunggah sebagai *File* atau dikirim langsung. |
| `dist/SmartEmailing_Tim7.zip` | Paket folder web biasa (untuk aktivitas *Folder* / *IMS content*). |

## Web online (GitHub Pages)
https://akirasakamiyo.github.io/SmartEmailing/

## Cara update web
Setelah mengedit file di folder ini, pilih salah satu:
1. **Klik dua kali `Update ke GitHub.command`** di Finder. Paket offline, ZIP, dan SCORM dibuat ulang, lalu diunggah ke GitHub.
2. **Sinkron otomatis:** klik dua kali `Sinkron Otomatis.command` dan biarkan jendelanya terbuka. Setiap kali kamu menyimpan file, 10 detik kemudian perubahan otomatis diunggah.
3. **Lewat Terminal:** `./tools/publish.sh "pesan perubahan"`.
4. **Lewat GitHub Desktop:** jalankan `python3 tools/build.py` dulu, lalu *Commit to main* → *Push origin*.

GitHub Pages memperbarui web sekitar 1–2 menit setelah unggahan.

## Gamifikasi
- **XP**: video pembuka 20, setiap scene materi 50, setiap soal latihan benar 20, nilai evaluasi ×3, bonus lulus 100, penutup 30 (maksimal 1.450 XP).
- **Level**: 1 Pemula (0), 2 Pengirim Rapi (200), 3 Penulis Lamaran (500), 4 Komunikator Sopan (900), 5 Email Profesional (1.300).
- **9 lencana**: Langkah Pertama, Paham Dasar Email, Siap Melamar, Beretika, Rajin Berlatih, Latihan Sempurna, Lulus Evaluasi, Nilai Sempurna, Memberi Masukan.
- **Sertifikat** (`#/sertifikat`) terbuka setelah lulus evaluasi, bisa dicetak atau disimpan sebagai PDF.
- Halaman `#/pencapaian` merangkum semuanya. XP dan lencana dihitung dari progres, jadi ikut terhapus saat progres direset.

## Struktur folder
```
SmartEmailing_Tim7/
├── index.html          ← halaman utama (dipakai GitHub Pages)
├── css/styles.css      ← tampilan (marun · krem · emas)
├── js/app.js           ← isi materi, scene, aktivitas, latihan, evaluasi
├── assets/img/         ← logo dan favicon
├── tools/build.py      ← membuat paket offline, ZIP, dan SCORM di dist/
├── tools/publish.sh    ← build + commit + unggah ke GitHub
├── tools/autosync.py   ← unggah otomatis setiap file disimpan
├── Update ke GitHub.command / Sinkron Otomatis.command ← klik dua kali di Finder
└── dist/               ← paket siap kirim (offline .html, .zip, SCORM .zip)
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

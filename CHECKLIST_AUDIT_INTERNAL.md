# Checklist Audit Internal — Smart Emailing (Tim 7)

Diisi tim sebelum dikirim ke dosen (notulensi Pertemuan 6, poin 6).
Tanggal audit: ____________  Pemeriksa: ____________

## A. Ketentuan hasil akhir proyek (notulensi poin 2)
- [ ] Bisa dibuka **offline** (matikan Wi-Fi, buka `dist/SmartEmailing_Tim7_offline.html`)
- [ ] Tidak ada tautan/embed eksternal (otomatis dicek oleh `tools/build.py`)
- [ ] Semua aset dalam satu paket (`dist/SmartEmailing_Tim7.zip`)
- [ ] Materi, video pembuka, aktivitas interaktif, kuis, dan post-test ada di dalam satu website
- [ ] Kuis tidak memakai Google Forms / Quizizz / layanan luar
- [ ] Dicoba di **HP** (Chrome Android / Safari iOS) dan di laptop

## B. Flowchart & kodefikasi (poin 3)
- [ ] Setiap scene S01–S13 punya kotak sendiri di flowchart (menu Panduan → Alur belajar)
- [ ] Kode scene terlihat di setiap halaman scene
- [ ] Kode di web sama dengan kode di dokumen T2 Versi 2

## C. Interaksi storyboard (poin 5)
- [ ] Tombol **Hit** (“Lanjut”) membawa ke scene berikutnya sesuai Peta Scene
- [ ] Elemen **Show** (umpan balik, penjelasan, contoh email) muncul setelah aksi
- [ ] S12: nilai ≥ 75 → S13; nilai < 75 → kembali ke S02
- [ ] Progres tiap aktivitas tetap tersimpan setelah pindah halaman
- [ ] Tampilan 16:9 di laptop, penuh layar di HP

## D. Uji per scene
| Scene | Berjalan? | Catatan |
|---|---|---|
| S01 Video pembuka | ☐ | |
| S02 Klik informasi | ☐ | |
| S03 Drag and drop (laptop + HP) | ☐ | |
| S04 Studi kasus + quiz | ☐ | |
| S05 Hotspot email | ☐ | |
| S06 Simulasi compose | ☐ | |
| S07 Spot the mistake | ☐ | |
| S08 Praktik | ☐ | |
| S09 CC/BCC + quiz | ☐ | |
| S10 Branching scenario | ☐ | |
| S11 Bahasa formal | ☐ | |
| Latihan soal (25 soal, pembahasan muncul) | ☐ | |
| S12 Evaluasi: terkunci sebelum materi selesai, tanpa tanda benar/salah, hanya nilai akhir | ☐ | |
| S13 Rangkuman + masukan | ☐ | |

## E. Kesesuaian dengan dokumen revisi (poin 7)
- [ ] Bahasa sudah natural, tidak kaku
- [ ] Nama tokoh contoh: Syarif Udin
- [ ] Soal latihan dan evaluasi sudah dicek tim

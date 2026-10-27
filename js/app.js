'use strict';
/* =========================================================================
   SMART EMAILING — modul pelatihan interaktif (Kelompok 7)
   Beranda → materi → scene S01–S13, latihan soal,
   evaluasi tanpa pilihan ganda. Semua progres tersimpan di browser.
   ========================================================================= */

/* ---------- Utilitas ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const app = $('#app');
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wait = ms => new Promise(r => setTimeout(r, ms));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let cleanups = [];
const onLeave = fn => cleanups.push(fn);
const later = (fn, ms) => { const id = setTimeout(fn, ms); onLeave(() => clearTimeout(id)); return id; };

/* ---------- Ikon (garis + bidang warna bergeser, gaya cap) ---------- */
const P = {
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  clip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  vol: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  mute: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
  right: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  left: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  up: '<polyline points="18 15 12 9 6 15"/>',
  down: '<polyline points="6 9 12 15 18 9"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  branch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  grip: '<circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>',
  pointer: '<path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/>',
  list: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
};
const F = {
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/>', clip: '<circle cx="12" cy="12" r="6.5"/>', send: '<path d="m22 2-7 20-4-9-9-4Z"/>',
  clock: '<circle cx="12" cy="12" r="10"/>', users: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2z"/>',
  file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/>', briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14z"/>', target: '<circle cx="12" cy="12" r="10"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>', help: '<circle cx="12" cy="12" r="10"/>',
  branch: '<circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>', chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  pen: '<path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>', search: '<circle cx="11" cy="11" r="8"/>',
  inbox: '<path d="M2 12h6l2 3h4l2-3h6v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>', grip: '<rect x="5.5" y="2" width="13" height="20" rx="4"/>',
  pointer: '<path d="m9 9 5 12 1.8-5.2L21 14Z"/>', list: '<rect x="1.5" y="3" width="9" height="18" rx="2"/>', award: '<circle cx="12" cy="8" r="6"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/>', shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  type: '<rect x="3" y="3" width="18" height="5" rx="1.5"/>', layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/>', play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>', eye: '<circle cx="12" cy="12" r="5"/>', eyeoff: '<circle cx="12" cy="12" r="5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>', lock: '<rect x="4" y="11" width="16" height="10" rx="2"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>', printer: '<rect x="6" y="14" width="12" height="8"/>',
};
const icon = (n, cls = '') => `<svg class="ic i-${n} ${F[n] ? 'duo' : ''} ${cls}" viewBox="-1 -1 26 26" aria-hidden="true">${F[n] ? `<g class="f">${F[n]}</g>` : ''}<g class="s">${P[n] || ''}</g></svg>`;

/* Logo: amplop yang tutupnya membentuk centang + kilau */
const LOGO = `<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="13" fill="#7a1f2e"/><rect x="8" y="14" width="31" height="22" rx="4.5" fill="#fbf5ec"/><path class="logo-ck" d="M12 18.5 21.5 26 35.5 15.5" fill="none" stroke="#3b1119" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path class="logo-sp" d="M38 3.5 39.8 8.2 44.5 10 39.8 11.8 38 16.5 36.2 11.8 31.5 10 36.2 8.2Z" fill="#e2b04a" stroke="#7a1f2e" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

/* ---------- Penyimpanan progres ---------- */
const KEY = 'smart-emailing:v2';
const fresh = () => ({ done: {}, act: {}, lat: null, ev: null, feedback: null, sound: true, last: null });
let state = (() => { try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return fresh(); } })();
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* mode privat */ } SCORM.sync(); }

/* ---------- Koneksi LMS (SCORM 1.2) ----------
   Bila dibuka di dalam LMS, status belajar dan nilai evaluasi dikirim ke LMS.
   Bila dibuka biasa (offline / GitHub Pages), bagian ini diam saja. */
const SCORM = (() => {
  let api = null, last = '';
  try {
    let w = window;
    for (let i = 0; i < 12 && w; i++) { if (w.API) { api = w.API; break; } if (w === w.parent) break; w = w.parent; }
    if (!api && window.opener && window.opener.API) api = window.opener.API;
    if (api && String(api.LMSInitialize('')) !== 'true') api = null;
  } catch (e) { api = null; }
  const set = (k, v) => { try { api.LMSSetValue(k, String(v)); } catch (e) { /* abaikan */ } };
  if (api) window.addEventListener('beforeunload', () => { try { api.LMSCommit(''); api.LMSFinish(''); } catch (e) { /* abaikan */ } });
  return {
    on: !!api,
    sync() {
      if (!api) return;
      const ev = state.ev && state.ev.done ? state.ev.score : null;
      const status = ev === null ? 'incomplete' : ev >= KKM ? 'passed' : 'failed';
      const key = status + '|' + ev + '|' + (state.last || '');
      if (key === last) return; last = key;
      set('cmi.core.lesson_status', status);
      if (ev !== null) { set('cmi.core.score.min', 0); set('cmi.core.score.max', 100); set('cmi.core.score.raw', ev); }
      if (state.last) set('cmi.core.lesson_location', state.last);
      try { api.LMSCommit(''); } catch (e) { /* abaikan */ }
    },
  };
})();
const A = id => (state.act[id] = state.act[id] || {});
/* Migrasi: soal latihan no. 7 dan 8 diganti, jawaban lamanya dibuang */
if (state.lat && state.lat.v !== 2) { [6, 7].forEach(k => { delete state.lat.ans[k]; delete state.lat.res[k]; }); state.lat.v = 2; }

/* ---------- Suara ---------- */
let actx;
function sfx(type = 'click') {
  if (!state.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    const c = { click: [700, 700, .05, 'sine'], ok: [740, 1180, .2, 'sine'], no: [260, 150, .24, 'triangle'] }[type];
    o.type = c[3]; o.frequency.setValueAtTime(c[0], t); o.frequency.linearRampToValueAtTime(c[1], t + c[2]);
    g.gain.setValueAtTime(.07, t); g.gain.exponentialRampToValueAtTime(.0001, t + c[2] + .05);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + c[2] + .08);
  } catch (e) { /* tidak ada audio */ }
}
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
function celebrate() {
  if (reduced) return;
  const box = document.createElement('div'); box.className = 'confetti';
  const colors = ['#7a1f2e', '#e2b04a', '#f4d9cf', '#c4553f', '#fbf5ec', '#3b1119'];
  for (let i = 0; i < 44; i++) {
    const s = document.createElement('i');
    s.style.cssText = `--dx:${((Math.random() - .5) * 520).toFixed(0)}px;--dy:${-(160 + Math.random() * 240).toFixed(0)}px;--r:${(Math.random() * 720 - 360).toFixed(0)}deg;background:${colors[i % colors.length]};animation-delay:${(Math.random() * 140).toFixed(0)}ms;width:${(6 + Math.random() * 6).toFixed(0)}px;height:${(10 + Math.random() * 8).toFixed(0)}px`;
    box.appendChild(s);
  }
  document.body.appendChild(box); setTimeout(() => box.remove(), 2000);
}

/* =========================================================================
   DATA MATERI
   ========================================================================= */
const NAMA = 'Syarif Udin', NAMAF = 'SyarifUdin';
const ORDER = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12', 'S13'];
const MATERI_SCENES = ['S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11'];
const KKM = 75;

const MATERI = [
  { id: 'intro', no: '00', short: 'Pembuka', title: 'Pembuka', icon: 'inbox', scenes: ['S01'] },
  { id: 'm1', no: '01', short: 'Materi 1', title: 'Dasar Komunikasi lewat Email', icon: 'mail', scenes: ['S02', 'S03', 'S04'],
    desc: 'Kegunaan email di dunia kerja, bagian-bagian email, subject, serta salam pembuka dan penutup.' },
  { id: 'm2', no: '02', short: 'Materi 2', title: 'Menulis Email Lamaran Kerja', icon: 'briefcase', scenes: ['S05', 'S06', 'S07', 'S08'],
    desc: 'Susunan email lamaran, cara memperkenalkan diri, melampirkan CV, dan kesalahan yang sering terjadi.' },
  { id: 'm3', no: '03', short: 'Materi 3', title: 'Etika Berkirim Email', icon: 'send', scenes: ['S09', 'S10', 'S11'],
    desc: 'Kapan pakai CC dan BCC, jam yang pas untuk mengirim, cara follow-up ke HR, dan bahasa yang sopan.' },
  { id: 'akhir', no: '04', short: 'Penutup', title: 'Evaluasi & Penutup', icon: 'award', scenes: ['S12', 'S13'] },
];
const materiOf = id => MATERI.find(m => m.scenes.includes(id));

const SCENES = {
  S01: { title: 'Selamat Datang', type: 'Pengantar', wide: true,
    tujuan: 'Mengenal pelatihan ini: tujuannya apa dan materinya apa saja.',
    narasi: 'Halo, selamat datang di pelatihan Smart Emailing. Pernah kirim lamaran kerja, tapi tak kunjung dibalas? Bisa jadi masalahnya ada di email yang kamu kirim. Di sini kamu akan belajar menulis email lamaran yang rapi dan berkomunikasi dengan HR secara profesional. Materinya ada tiga: dasar komunikasi lewat email, menulis email lamaran, dan etika berkirim email. Setelah itu, kamu bisa berlatih soal, lalu mengerjakan evaluasi. Yuk, kita mulai!' },
  S02: { title: 'Kegunaan Email di Dunia Kerja', type: 'Klik informasi',
    tujuan: 'Kamu bisa menjelaskan kegunaan email di dunia kerja dan alasan komunikasi lewat email perlu dijaga tetap profesional.',
    uraian: [{ h: 'Kenapa Email Masih Penting?', p: [
      'Di dunia kerja, email masih jadi salah satu jalur komunikasi resmi. Lewat email, orang menyampaikan informasi, mengirim dokumen, melamar pekerjaan, berkoordinasi dengan rekan kerja, sampai berhubungan dengan klien.',
      'Dibanding aplikasi chat, email terasa lebih formal, tersimpan rapi, dan bisa dijadikan bukti komunikasi. Karena itu, kemampuan menulis email yang baik jadi bekal penting untuk fresh graduate dan pencari kerja.'] }],
    narasi: 'Email masih jadi jalur komunikasi resmi di dunia kerja. Klik keempat ikon di layar laptop untuk melihat kegunaannya. Dibanding chat, email lebih formal, tersimpan rapi, dan bisa jadi bukti komunikasi. Itu sebabnya menulis email dengan baik adalah keterampilan penting buat fresh graduate.' },
  S03: { title: 'Bagian-Bagian Email', type: 'Seret & letakkan',
    tujuan: 'Kamu bisa mengenali bagian-bagian email profesional.',
    uraian: [{ h: 'Lima Bagian Email Profesional', p: [
      'Email profesional punya lima bagian: <b>subject</b> (judul email), <b>salam pembuka</b>, <b>isi email</b>, <b>salam penutup</b>, dan <b>tanda tangan</b>.',
      'Tiap bagian punya tugasnya sendiri. Subject menjelaskan isi email secara singkat, sedangkan isi email memuat pesan utama yang ditulis jelas dan ringkas.'] }],
    narasi: 'Email profesional terdiri atas lima bagian. Subject menjelaskan isi email secara singkat. Salam pembuka menunjukkan rasa hormat. Isi email memuat pesan utama dengan jelas dan ringkas. Salam penutup mengakhiri email dengan sopan, lalu ditutup dengan tanda tangan. Sekarang, coba pasang kartu-kartu ini di tempat yang benar.' },
  S04: { title: 'Subject, Salam Pembuka, dan Penutup', type: 'Studi kasus + kuis',
    tujuan: 'Kamu bisa menulis subject yang efektif serta memakai salam pembuka dan penutup yang sesuai.',
    uraian: [
      { h: 'Menulis Subject yang Efektif', p: [
        'Subject adalah hal pertama yang dilihat penerima. Subject yang baik itu singkat, jelas, spesifik, dan langsung menggambarkan tujuan email.',
        `Contoh yang tepat: <q>Application for Graphic Designer Position – ${NAMA}</q>. Contoh yang kurang tepat: <q>Lamaran</q>, <q>Halo Kak</q>, atau <q>Penting</q>.`,
        'Subject yang jelas membuat emailmu lebih mungkin dibuka oleh HR atau perekrut.'] },
      { h: 'Membuka dan Menutup Email dengan Sopan', p: [
        'Salam pembuka menunjukkan rasa hormat kepada penerima, misalnya <q>Yth. Tim Rekrutmen PT ABC,</q> atau <q>Dear Hiring Manager,</q>.',
        'Salam penutup mengakhiri email dengan sopan, misalnya <q>Hormat saya,</q> atau <q>Best regards,</q> lalu diikuti nama pengirim. Salam yang tepat menunjukkan bahwa kamu paham etika berkomunikasi.'] }],
    narasi: 'Subject adalah hal pertama yang dilihat HR. Subject yang baik itu singkat, jelas, spesifik, dan sesuai tujuan email. Coba bandingkan dua kotak masuk ini. Untuk salam pembuka, kamu bisa memakai "Yth. Tim Rekrutmen PT ABC," atau "Dear Hiring Manager,". Untuk penutup, pakai "Hormat saya," atau "Best regards," lalu tulis namamu.' },
  S05: { title: 'Susunan Email Lamaran Kerja', type: 'Klik bagian email',
    tujuan: 'Kamu bisa menjelaskan fungsi email lamaran dan menyusunnya sesuai format yang profesional.',
    uraian: [
      { h: 'Apa Itu Email Lamaran Kerja?', p: [
        'Email lamaran adalah email yang kamu kirim ke perusahaan untuk memperkenalkan diri, menyampaikan minat pada posisi tertentu, sekaligus mengirim dokumen pendukung seperti CV dan portofolio.',
        'Email ini adalah kesan pertama. Dari sinilah perekrut mulai menilai kamu sebagai kandidat.'] },
      { h: 'Urutan Email Lamaran', p: [
        'Susun email lamaran dengan urutan berikut:',
        '<ol class="ol"><li>subject yang jelas</li><li>salam pembuka</li><li>perkenalan diri singkat</li><li>tujuan mengirim email</li><li>keterangan lampiran CV dan portofolio</li><li>salam penutup</li></ol>',
        'Tulis isinya singkat, padat, dan relevan supaya mudah dibaca perekrut.'] }],
    narasi: 'Email lamaran adalah caramu memperkenalkan diri, menunjukkan minat pada posisi tertentu, dan mengirim CV serta portofolio. Email inilah kesan pertamamu di mata perekrut. Urutannya: subject yang jelas, salam pembuka, perkenalan singkat, tujuan email, keterangan lampiran, lalu salam penutup. Klik tiap bagian untuk melihat fungsinya.' },
  S06: { title: 'Memperkenalkan Diri dan Mengirim CV', type: 'Simulasi',
    tujuan: 'Kamu bisa memperkenalkan diri secara profesional dan mengirim CV serta portofolio dengan benar.',
    uraian: [
      { h: 'Memperkenalkan Diri ke HR', p: [
        'Saat memperkenalkan diri, cukup sebutkan nama, latar belakang pendidikan, dan posisi yang kamu lamar. Sampaikan dengan singkat dan relevan.',
        'Tidak perlu bercerita soal hal pribadi yang tidak ada hubungannya dengan pekerjaan. Fokuslah pada kemampuan atau pengalaman yang mendukung posisi tersebut.'] },
      { h: 'Melampirkan Dokumen Pendukung', p: [
        `Lampirkan CV dan portofolio dalam format yang sesuai, misalnya PDF. Beri nama file yang rapi dan mudah dikenali, seperti <code>CV_${NAMAF}.pdf</code> atau <code>Portfolio_${NAMAF}.pdf</code>.`,
        'Sebelum menekan tombol kirim, pastikan semua lampiran sudah terunggah dan bisa dibuka.'] }],
    narasi: `Saat memperkenalkan diri, cukup sebutkan nama, latar belakang pendidikan, dan posisi yang dilamar. Fokus pada kemampuan yang mendukung posisi itu, dan tinggalkan cerita pribadi yang tidak berkaitan. Untuk lampiran, pakai format PDF dengan nama file yang rapi, misalnya CV_${NAMAF}.pdf dan Portfolio_${NAMAF}.pdf. Sebelum mengirim, pastikan semua lampiran sudah terunggah dan bisa dibuka.` },
  S07: { title: 'Kesalahan yang Sering Terjadi', type: 'Temukan kesalahan', uraianAfter: true,
    tujuan: 'Kamu bisa menemukan kesalahan yang sering muncul di email lamaran.',
    uraian: [{ h: 'Hindari Kesalahan Ini', p: [
      'Kesalahan yang sering dilakukan fresh graduate antara lain: alamat email yang tidak profesional, subject yang tidak jelas, salah menulis nama perusahaan, bahasa yang tidak formal, isi email yang terlalu panjang, dan lupa melampirkan CV atau portofolio.',
      'Kesalahan-kesalahan kecil seperti ini bisa membuat lamaranmu tidak diproses lebih lanjut.'] }],
    narasi: 'Sekarang, anggap dirimu seorang perekrut. Ada beberapa kesalahan di email ini. Klik bagian yang menurutmu salah.' },
  S08: { title: 'Praktik Menulis Email Lamaran', type: 'Praktik',
    tujuan: 'Kamu bisa membuat email lamaran untuk keperluan mencari kerja.',
    uraian: [{ h: 'Cara Mengerjakan', p: [
      'Isi setiap bagian email, lalu cek lagi tulisanmu dengan daftar periksa di samping.',
      'Praktik ini tidak dinilai otomatis. Setelah emailmu dikirim, bandingkan dengan contoh jawaban yang muncul.'] }],
    narasi: 'Saatnya praktik. Tulis email lamaran untuk lowongan di samping, dan terapkan susunan serta format yang sudah kamu pelajari.' },
  S09: { title: 'CC, BCC, dan Waktu Mengirim', type: 'Penjelasan visual + kuis',
    tujuan: 'Kamu bisa menjelaskan kegunaan CC dan BCC serta memilih waktu yang tepat untuk mengirim email.',
    uraian: [
      { h: 'Memakai CC dan BCC dengan Tepat', p: [
        '<b>CC</b> (<i>Carbon Copy</i>) dipakai untuk mengirim salinan email kepada orang lain yang perlu tahu isinya.',
        '<b>BCC</b> (<i>Blind Carbon Copy</i>) juga mengirim salinan, tetapi alamat penerimanya tidak terlihat oleh penerima lain.',
        'Pilih CC atau BCC sesuai kebutuhan, dan jaga privasi para penerima.'] },
      { h: 'Kapan Sebaiknya Mengirim Email?', p: [
        'Waktu kirim ikut menentukan apakah emailmu cepat dibaca. Kirim email profesional di jam kerja, sekitar pukul 08.00–17.00.',
        'Hindari mengirim larut malam, saat hari libur, atau di waktu yang kurang pas, kecuali memang ada keperluan yang mendesak.'] }],
    narasi: 'CC atau Carbon Copy dipakai untuk mengirim salinan ke orang lain yang perlu tahu isi email. BCC atau Blind Carbon Copy juga mengirim salinan, tetapi alamat penerimanya disembunyikan, jadi privasi tetap terjaga. Untuk waktu, kirimlah email di jam kerja, sekitar pukul delapan pagi sampai lima sore. Hindari larut malam atau hari libur, kecuali memang mendesak.' },
  S10: { title: 'Follow-up ke HR', type: 'Pilih langkahmu',
    tujuan: 'Kamu bisa menulis email follow-up ke HR dengan sopan dan profesional.',
    uraian: [{ h: 'Menanyakan Kabar Lamaran', p: [
      'Follow-up adalah email untuk menanyakan perkembangan proses rekrutmen setelah beberapa waktu. Tulislah dengan sopan, singkat, dan tidak terkesan memaksa.',
      'Biasanya follow-up dikirim sekitar <b>5–7 hari kerja</b> setelah lamaran terkirim, kalau belum ada kabar dari perusahaan.'] }],
    narasi: 'Follow-up dipakai untuk menanyakan perkembangan proses rekrutmen. Sampaikan dengan sopan, singkat, dan jangan terkesan memaksa. Biasanya follow-up dikirim sekitar lima sampai tujuh hari kerja setelah lamaran terkirim, kalau belum ada kabar. Sekarang, bantu Syarif memilih langkah yang tepat.' },
  S11: { title: 'Bahasa yang Formal dan Sopan', type: 'Pilih kalimat',
    tujuan: 'Kamu bisa memakai bahasa yang formal dan profesional di email.',
    uraian: [{ h: 'Menulis dengan Bahasa yang Profesional', p: [
      'Bahasa di email profesional harus jelas, sopan, dan mudah dipahami. Hindari bahasa gaul, singkatan tidak resmi, emoji, dan huruf kapital yang berlebihan.',
      'Gunakan kalimat efektif dan perhatikan ejaan serta tata bahasanya, supaya pesanmu tersampaikan dengan baik dan kamu terlihat profesional.'] }],
    narasi: 'Bahasa di email profesional harus jelas, sopan, dan mudah dipahami. Hindari bahasa gaul, singkatan tidak resmi, emoji, dan huruf kapital berlebihan. Perhatikan juga ejaan dan tata bahasanya. Pilih kalimat yang paling pas di setiap kasus.' },
  S12: { title: 'Evaluasi', type: 'Evaluasi akhir', wide: true,
    tujuan: 'Kamu bisa menerapkan seluruh materi untuk menyusun email lamaran yang efektif dan sopan.',
    narasi: 'Kamu sudah menyelesaikan semua materi. Sekarang saatnya evaluasi. Kerjakan dengan teliti. Nilaimu baru muncul setelah semua jawaban dikirim.' },
  S13: { title: 'Penutup', type: 'Rangkuman + masukan', wide: true,
    tujuan: 'Mengingat kembali seluruh materi dan memberi masukan untuk pelatihan ini.',
    narasi: 'Selamat, kamu sudah menyelesaikan pelatihan Smart Emailing! Ingat lima hal ini: subject yang jelas, susunan yang rapi, bahasa yang sopan, lampiran yang lengkap, dan waktu kirim yang tepat. Simpan rangkuman ini sebagai pegangan. Sebelum pergi, isi masukan singkat supaya pelatihan ini bisa terus diperbaiki. Semoga sukses mendapatkan pekerjaan impianmu!' },
};

/* ---------- Status kunci ---------- */
const materiDone = () => MATERI_SCENES.every(id => state.done[id]);
const evalPassed = () => !!(state.ev && state.ev.done && state.ev.score >= KKM);
const locked = id => (id === 'S12' && !materiDone()) || (id === 'S13' && !evalPassed());
const doneCount = () => ORDER.filter(id => state.done[id]).length;
const pct = () => Math.round(doneCount() / ORDER.length * 100);
const nextOf = id => ({ S11: '#/latihan', S12: evalPassed() ? '#/scene/S13' : null, S13: null }[id] !== undefined
  ? { S11: '#/latihan', S12: evalPassed() ? '#/scene/S13' : null, S13: null }[id]
  : '#/scene/' + ORDER[ORDER.indexOf(id) + 1]);
const prevOf = id => id === 'S12' ? '#/latihan' : (ORDER.indexOf(id) > 0 ? '#/scene/' + ORDER[ORDER.indexOf(id) - 1] : '#/materi');
const resumeHref = () => { const id = MATERI_SCENES.concat('S01').find(x => !state.done[x]); return id ? '#/scene/' + (state.done.S01 ? id : 'S01') : (evalPassed() ? '#/scene/S13' : '#/scene/S12'); };

/* =========================================================================
   KOMPONEN BERSAMA
   ========================================================================= */
function showFb(fb, ok, msg) {
  fb.hidden = false;
  fb.className = 'fb ' + (ok === true ? 'fb-ok' : ok === false ? 'fb-no' : 'fb-info');
  fb.innerHTML = `${icon(ok === true ? 'check' : ok === false ? 'x' : 'bulb')}<span>${msg}</span>`;
}
const actHead = (ic, label, counter = '') => `<div class="act-head"><span class="act-tag">${icon(ic)} ${label}</span>${counter ? `<span class="counter">${counter}</span>` : ''}</div>`;

/* Pilihan ganda dengan umpan balik; riwayat pilihan disimpan supaya tidak mengulang */
function mcq(el, { q, opts, onDone, store, key }) {
  el.innerHTML = `${q ? `<p class="q">${q}</p>` : ''}
    <div class="opts">${opts.map((o, i) => `<button type="button" class="opt" data-i="${i}"><span class="opt-l">${'ABCD'[i]}</span><span class="opt-t">${o.t}</span></button>`).join('')}</div>
    <div class="fb" hidden></div>`;
  const fb = $('.fb', el), rec = store ? (store[key] = store[key] || []) : [];
  const pick = (i, silent) => {
    const o = opts[i], b = $(`.opt[data-i="${i}"]`, el);
    showFb(fb, !!o.ok, o.fb);
    if (o.ok) { b.classList.add('ok'); $$('.opt', el).forEach(x => (x.disabled = true)); silent || sfx('ok'); onDone && onDone(silent); }
    else { b.classList.add('no'); b.disabled = true; silent || sfx('no'); }
  };
  rec.forEach(i => pick(i, true));
  el.onclick = e => {
    const b = e.target.closest('.opt'); if (!b || b.disabled) return;
    rec.push(+b.dataset.i); save(); pick(+b.dataset.i, false);
  };
}

/* =========================================================================
   NAVIGASI SAMPING (halaman scene, latihan, evaluasi)
   ========================================================================= */
/* Rute belajar: jalur perangko S01–S13 di atas halaman (pengganti sidebar) */
function routeRail(cur) {
  const groups = [...MATERI.slice(0, 4).map(m => [m.short, m.scenes]), ['Latihan', ['L']], ['Akhir', ['S12', 'S13']]];
  const seq = groups.flatMap(g => g[1]);
  const ci = Math.max(0, seq.indexOf(cur));
  const stop = id => {
    const isL = id === 'L', sc = isL ? { title: 'Latihan Soal', type: `${LATIHAN.length} soal` } : SCENES[id];
    const d = isL ? false : state.done[id], lk = isL ? false : locked(id);
    return `<a class="stop ${id === cur ? 'cur' : ''} ${d ? 'done' : ''} ${lk ? 'locked' : ''}" href="${isL ? '#/latihan' : '#/scene/' + id}" data-tip="${sc.title}" aria-label="${id} · ${sc.title}${d ? ' (selesai)' : lk ? ' (terkunci)' : ''}">
      <span class="stop-st">${d ? icon('check') : lk ? icon('lock') : id}</span></a>`;
  };
  return `<nav class="rail" aria-label="Rute belajar">
    <div class="rail-head"><span class="rail-ic">${icon('map')}</span><div><b>Rute Belajar</b><small>${doneCount()} dari 13 scene selesai</small></div><a class="rail-all" href="#/materi">${icon('grid')} Semua materi</a></div>
    <div class="rail-track" style="--fill:${(ci / (seq.length - 1) * 100).toFixed(1)}%">
      <span class="rail-line"><i></i></span>
      ${groups.map(([label, ids]) => `<div class="rail-grp"><small>${label}</small><div class="rail-stops">${ids.map(stop).join('')}</div></div>`).join('')}
    </div>
  </nav>`;
}

/* =========================================================================
   BERANDA
   ========================================================================= */
function viewHome() {
  const started = doneCount() > 0, res = resumeHref();
  const nx = (res.match(/S\d+/) || ['S01'])[0], nxs = SCENES[nx], nxm = materiOf(nx);
  const latOk = state.lat ? Object.values(state.lat.res || {}).filter(Boolean).length : 0;
  const ev = state.ev && state.ev.done ? state.ev.score : null;
  const faq = [
    ['Apa itu Smart Emailing?', 'Pelatihan singkat berbasis multimedia untuk membantu fresh graduate menulis email lamaran kerja yang rapi, sopan, dan sesuai etika komunikasi di dunia kerja.'],
    ['Untuk siapa pelatihan ini?', 'Untuk fresh graduate yang sedang bersiap melamar kerja.'],
    ['Materinya apa saja?', 'Ada tiga materi: dasar komunikasi lewat email, menulis email lamaran kerja, dan etika berkirim email. Setelah itu ada latihan soal dan evaluasi.'],
    ['Harus belajar berurutan?', 'Tidak wajib. Kamu bisa membuka scene mana saja dari halaman Materi. Tapi evaluasi baru terbuka setelah semua scene materi selesai.'],
    ['Progresku tersimpan di mana?', 'Di browser yang kamu pakai, tanpa akun. Jawaban di setiap aktivitas tidak akan hilang walau kamu pindah halaman. Kalau data browser dihapus, progres mulai dari awal.'],
    ['Bagaimana evaluasi dinilai?', `Evaluasi berisi ${EVALUASI.length} soal tanpa pilihan ganda. Selama mengerjakan tidak ada tanda benar atau salah. Nilai akhir muncul setelah semua jawaban dikirim, dan batas lulusnya ${KKM}.`],
  ];
  return `
  <section class="hero">
    <div class="wrap hero-in">
      <div class="hero-text">
        <div class="pill-tag"><span class="dot"></span>Media pembelajaran · Kelompok 7</div>
        <h1 class="hero-title">Smart <span>Emailing<svg class="swoosh" viewBox="0 0 300 26" preserveAspectRatio="none" aria-hidden="true"><path d="M5 18 C 80 5, 170 3, 295 13"/></svg></span></h1>
        <p class="hero-hook"><span class="q-mark">“</span>Lamaran tak kunjung dibalas? Bisa jadi masalahnya ada di <mark>emailnya.</mark></p>
        <p class="hero-sub">Pelatihan singkat untuk fresh graduate. Belajar menulis email lamaran yang rapi dan sopan lewat ${MATERI_SCENES.length} scene materi, ${LATIHAN.length} soal latihan, dan evaluasi akhir.</p>
        <div class="hero-cta">
          <a class="btn btn-gold btn-lg" href="${started ? res : '#/scene/S01'}">${started ? 'Lanjutkan belajar' : 'Mulai belajar'} ${icon('right')}</a>
          <a class="btn btn-ghost btn-lg" href="#/materi">Lihat materi</a>
        </div>
      </div>
      <div class="hero-art">
        <div class="mailcard" data-to="#/scene/S05" title="Susunan email lamaran (S05)">
          <div class="mc-top"><i></i><i></i><i></i></div>
          <div class="mc-row"><small>Subject</small>Application for Graphic Designer Position – ${NAMA}</div>
          <div class="mc-line w70"></div><div class="mc-line"></div><div class="mc-line w85"></div>
          <div class="mc-attach" data-to="#/scene/S06" title="Melampirkan CV (S06)">${icon('clip')} CV_${NAMAF}.pdf</div>
        </div>
        <span class="chip-f c1" data-to="#/scene/S04" title="Subject yang efektif (S04)">${icon('check')} Subject jelas</span>
        <span class="chip-f c2" data-to="#/scene/S09" title="Waktu mengirim email (S09)">${icon('clock')} 08.00–17.00</span>
        <span class="chip-f c3" data-to="#/scene/S06" title="Mengirim CV (S06)">${icon('send')} Siap dikirim</span>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-head"><div><div class="eyebrow">Mulai dari sini</div><h2 class="display-2">Kenali pelatihannya dulu</h2><p class="lead-s">Baca tujuan dan petunjuknya, lihat alurnya, lalu mulai dari materi yang paling kamu butuhkan.</p></div>
        <a class="btn btn-outline" href="#/glosarium">${icon('book')} Glosarium istilah</a></div>
      <div class="start-grid">
        ${[['01', 'Tujuan belajar', 'Apa yang akan kamu kuasai di setiap scene.', '#/tujuan', 'target'], ['02', 'Petunjuk', 'Cara memakai modul, arti kode interaksi, dan menyimpan progres.', '#/petunjuk', 'help'], ['03', 'Alur belajar', 'Flowchart dari pengantar sampai evaluasi dan penutup.', '#/alur', 'branch'], ['04', 'Peta konsep', 'Seluruh isi materi dalam satu peta. Klik untuk langsung membuka.', '#/peta', 'map']]
          .map(([n, t, d, h, ic]) => `<a class="start-card" href="${h}"><span class="sc-n">${n}</span><span class="sc-ic">${icon(ic)}</span><h3>${t}</h3><p>${d}</p><span class="sc-go">Buka ${icon('right')}</span></a>`).join('')}
      </div>
    </div>
  </section>

  <section class="sec tint">
    <div class="wrap continue-grid">
      <div class="continue">
        <div class="eyebrow light">${started ? 'Lanjutkan belajar' : 'Mulai belajar'}</div>
        <h3>${nxs.title}</h3>
        <p>${nxm.short} · <span class="scode">${nx}</span> · ${nxs.type}</p>
        <span class="bar light"><i style="width:${pct()}%"></i></span>
        <small>${doneCount()}/13 scene selesai · latihan ${latOk}/${LATIHAN.length} benar · evaluasi ${ev === null ? 'belum' : ev}</small>
        <a class="btn btn-gold" href="${started ? res : '#/scene/S01'}">${started ? 'Lanjutkan' : 'Mulai'} ${icon('right')}</a>
      </div>
      <div class="mini-list">
        <div class="eyebrow">Progres per materi</div>
        ${MATERI.map(m => `<a class="mini-row" href="#/scene/${m.scenes.find(id => !state.done[id] && !locked(id)) || m.scenes[0]}"><span class="mr-n">${m.no}</span><span class="mr-t">${m.title}</span><span class="mr-p">${m.scenes.filter(id => state.done[id]).length}/${m.scenes.length}</span></a>`).join('')}
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-head"><div><div class="eyebrow">Materi</div><h2 class="display-2">Tiga materi, sepuluh scene</h2><p class="lead-s">Setiap scene berisi penjelasan singkat dan satu aktivitas yang langsung bisa dicoba.</p></div>
        <a class="btn btn-outline" href="#/materi">Semua scene ${icon('right')}</a></div>
      <div class="mat-grid">
        ${MATERI.filter(m => /^m\d$/.test(m.id)).map(m => { const d = m.scenes.filter(id => state.done[id]).length; return `<a class="mat-card" href="#/scene/${m.scenes.find(id => !state.done[id]) || m.scenes[0]}">
          <div class="mat-top"><span class="mat-no">${m.no}</span><span class="mat-ic">${icon(m.icon)}</span></div>
          <small>${m.short}</small><h3>${m.title}</h3><p>${m.desc}</p>
          <div class="mat-scenes">${m.scenes.map(id => `<span class="${state.done[id] ? 'ok' : ''}">${id}</span>`).join('')}</div>
          <div class="mat-foot"><span class="bar"><i style="width:${d / m.scenes.length * 100}%"></i></span><b>${d}/${m.scenes.length}</b></div>
        </a>`; }).join('')}
      </div>
    </div>
  </section>

  <section class="sec tint">
    <div class="wrap">
      <div class="sec-head"><div><div class="eyebrow">Latihan & evaluasi</div><h2 class="display-2">Uji pemahamanmu</h2><p class="lead-s">Latihan untuk mengasah diri dengan pembahasan. Evaluasi untuk nilai akhir.</p></div></div>
      <div class="two-cards">
        <a class="big-card" href="#/latihan"><span class="bc-ic">${icon('pen')}</span><div><small>Latihan soal</small><h3>${LATIHAN.length} soal campuran</h3><p>Pilihan ganda, benar/salah, pasangkan, urutkan, dan kelompokkan. Setiap jawaban langsung diperiksa dan dijelaskan.</p><span class="bc-meta">${latOk} soal sudah dijawab benar</span></div></a>
        <a class="big-card dark ${materiDone() ? '' : 'locked'}" href="#/scene/S12"><span class="bc-ic">${icon(materiDone() ? 'flag' : 'lock')}</span><div><small>Evaluasi · S12</small><h3>${EVALUASI.length} soal tanpa pilihan ganda</h3><p>Soal diambil dari aktivitas di materi. Tidak ada tanda benar atau salah, hanya nilai akhir. Batas lulus ${KKM}.</p><span class="bc-meta">${ev !== null ? `Nilai terakhir: ${ev}` : materiDone() ? 'Sudah bisa dikerjakan' : `Terbuka setelah ${MATERI_SCENES.filter(id => !state.done[id]).length} scene materi lagi`}</span></div></a>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap faq-wrap">
      <div><div class="eyebrow">Yang sering ditanyakan</div><h2 class="display-2">Pertanyaan umum</h2><p class="lead-s">Masih bingung? Buka halaman petunjuk.</p><a class="btn btn-outline" href="#/petunjuk">Petunjuk</a></div>
      <div class="faq">${faq.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}<span class="plus"></span></summary><p>${a}</p></details>`).join('')}</div>
    </div>
  </section>`;
}

/* =========================================================================
   KATALOG MATERI
   ========================================================================= */
function viewMateri() {
  const row = id => { const lk = locked(id), d = state.done[id]; return `<a class="srow ${d ? 'done' : ''} ${lk ? 'locked' : ''}" href="#/scene/${id}"><span class="srow-st">${d ? icon('check') : lk ? icon('lock') : id}</span><span class="srow-t"><b>${SCENES[id].title}</b><small>${id} · ${SCENES[id].type}</small></span>${icon('right')}</a>`; };
  return `<div class="page wrap">
    <header class="page-head"><div class="eyebrow">Materi</div><h1 class="display">Semua materi</h1><p class="lead-s">Pilih scene mana saja. Hasil kerjamu di setiap aktivitas tersimpan otomatis.</p>
      <div class="page-prog"><span class="bar"><i style="width:${pct()}%"></i></span><b>${pct()}%</b><small>${doneCount()}/13 scene selesai</small></div></header>
    <div class="cat">${MATERI.map(m => `<article class="cat-card">
      <header><span class="cat-no">${m.no}</span><div><small>${m.short}</small><h2>${m.title}</h2>${m.desc ? `<p>${m.desc}</p>` : ''}</div><span class="cat-p">${m.scenes.filter(id => state.done[id]).length}/${m.scenes.length}</span></header>
      <div class="cat-list">${m.id === 'akhir' ? `<a class="srow" href="#/latihan"><span class="srow-st">L</span><span class="srow-t"><b>Latihan Soal</b><small>L · ${LATIHAN.length} soal campuran dengan pembahasan</small></span>${icon('right')}</a>` : ''}${m.scenes.map(row).join('')}</div>
    </article>`).join('')}</div>
  </div>`;
}

/* =========================================================================
   HALAMAN SCENE (gaya halaman pelajaran)
   ========================================================================= */
const uraianSections = s => s.uraian.map((u, i) => `<section class="u-sec" id="u${i}"><h2 class="sec-title">${u.h}</h2>${u.p.map(p => p.startsWith('<ol') ? p : `<p>${p}</p>`).join('')}</section>`).join('');
const uraianHTML = uraianSections;

function viewScene(id) {
  const s = SCENES[id], m = materiOf(id), i = ORDER.indexOf(id);
  const text = (s.uraian || []).map(u => u.p.join(' ')).join(' ').replace(/<[^>]+>/g, '');
  const mins = Math.max(1, Math.round(text.split(/\s+/).length / 170));
  const prev = ORDER[i - 1], next = ORDER[i + 1];
  return `<div class="lesson-wide wrap">
    ${routeRail(id)}
    <article class="sheet mail-view">
      <div class="mv-bar">
        <a class="mv-btn" href="#/materi" title="Semua materi">${icon('left')}<span>Materi</span></a>
        <span class="mv-pos">${i + 1} dari ${ORDER.length}</span>
        <span class="mv-nav">
          ${prev ? `<a class="mv-btn sq" href="#/scene/${prev}" title="Scene sebelumnya" aria-label="Scene sebelumnya">${icon('up')}</a>` : ''}
          ${next ? `<a class="mv-btn sq" href="#/scene/${next}" title="Scene berikutnya" aria-label="Scene berikutnya">${icon('down')}</a>` : ''}
        </span>
      </div>
      <header class="mv-head">
        <span class="mv-av" data-to="#/" title="Beranda">${LOGO}</span>
        <div class="mv-meta">
          <div class="mv-from"><b>Smart Emailing</b><small>kepada: kamu · ± ${mins} menit</small></div>
          <h1 class="display">${s.title}</h1>
          <div class="mv-labels"><span class="lbl" data-to="#/materi" title="Semua materi">${m.short}</span><span class="lbl code" data-to="#/alur" title="Lihat di flowchart">${id}</span><span class="lbl soft" data-to="aktivitas" title="Ke aktivitas">${icon('pointer')} ${s.type}</span></div>
        </div>
      </header>
      <div class="pin-note"><span class="pin" data-to="#/tujuan" title="Semua tujuan belajar"></span><b>Tujuan</b><p>${s.tujuan}</p></div>
      ${s.uraian ? `<section class="stepper" id="uraian"></section>` : ''}
      <section class="act-sec" id="aktivitas"><div class="act-label"><span class="act-num" data-to="aktivitas" title="Ke aktivitas">${icon(id === 'S01' ? 'inbox' : id === 'S12' ? 'flag' : id === 'S13' ? 'award' : 'pointer')}</span><div><small>${id === 'S01' ? 'Pengantar' : id === 'S12' ? 'Evaluasi akhir' : id === 'S13' ? 'Penutup' : 'Aktivitas'}</small><h2 class="sec-title">${id === 'S01' ? 'Kenali pelatihannya' : id === 'S12' ? 'Kerjakan evaluasi' : id === 'S13' ? 'Rangkuman pelatihan' : 'Ayo coba: ' + s.type.toLowerCase()}</h2></div></div><div class="act-card" id="activity"></div></section>
      <nav class="lesson-nav">${lessonNav(id)}</nav>
    </article>
  </div>`;
}

/* Materi dibaca per kartu; posisi kartu disimpan */
function renderSteps(id) {
  const box = $('#uraian'); if (!box) return;
  const s = SCENES[id], st = A(id);
  if (s.uraianAfter && !state.done[id]) {
    box.innerHTML = `<div class="step-card locked">${icon('eyeoff')}<div><b>Materi masih disembunyikan</b><p>Rangkuman kesalahan baru terbuka setelah kamu menemukan semuanya di aktivitas bawah, supaya jawabannya tidak bocor.</p><button type="button" class="btn btn-primary btn-sm" data-go-act>Ke aktivitas ${icon('down')}</button></div></div>`;
    return;
  }
  const n = s.uraian.length, k = Math.min(st.step || 0, n - 1);
  const u = s.uraian[k];
  box.innerHTML = `<div class="step-tabs" role="tablist">${s.uraian.map((x, j) => `<button type="button" role="tab" class="st-tab ${j === k ? 'cur' : ''} ${j < k ? 'past' : ''}" data-step="${j}" aria-selected="${j === k}"><span>${j + 1}</span>${x.h}</button>`).join('')}</div>
    <div class="step-card" key="${k}"><small class="sc-k">Bagian ${k + 1} dari ${n}</small><h2 class="sec-title">${u.h}</h2>${u.p.map(p => p.startsWith('<ol') ? p : `<p>${p}</p>`).join('')}</div>
    <div class="step-nav">
      <button type="button" class="btn btn-outline btn-sm" data-step="${k - 1}" ${k === 0 ? 'disabled' : ''}>${icon('left')} Sebelumnya</button>
      <span class="st-dots">${s.uraian.map((_, j) => `<i class="${j === k ? 'cur' : j < k ? 'past' : ''}"></i>`).join('')}</span>
      ${k < n - 1 ? `<button type="button" class="btn btn-primary btn-sm" data-step="${k + 1}">Berikutnya ${icon('right')}</button>` : `<button type="button" class="btn btn-gold btn-sm" data-go-act>Kerjakan aktivitas ${icon('down')}</button>`}
    </div>`;
}

function lessonNav(id) {
  const nx = nextOf(id);
  const label = id === 'S11' ? 'Ke latihan soal' : id === 'S12' ? 'Ke penutup' : 'Lanjut';
  return `<a class="btn btn-outline" href="${prevOf(id)}">${icon('left')} Sebelumnya</a>
    ${nx ? `<a class="btn btn-primary ${state.done[id] ? '' : 'is-locked'}" id="nextBtn" href="${nx}">${label} ${icon('right')}</a>` : id === 'S13' ? `<a class="btn btn-primary" href="#/">Selesai ${icon('check')}</a>` : ''}`;
}

function mountScene(id) {
  const btn = $('#nextBtn');
  if (btn) btn.addEventListener('click', e => { if (btn.classList.contains('is-locked')) { e.preventDefault(); toast('Selesaikan aktivitas di halaman ini dulu, ya.'); $('#aktivitas').scrollIntoView({ behavior: 'smooth' }); } });
  renderSteps(id);
  const ur = $('#uraian');
  if (ur) ur.addEventListener('click', e => {
    const g = e.target.closest('[data-go-act]'); if (g) { $('#aktivitas').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const b = e.target.closest('[data-step]'); if (!b || b.disabled) return;
    A(id).step = Math.max(0, +b.dataset.step); save(); sfx(); renderSteps(id);
  });
  const done = silent => {
    const freshDone = !state.done[id];
    state.done[id] = true; save(); updateBar();
    if (btn) { btn.classList.remove('is-locked'); if (freshDone && !silent) btn.classList.add('glow'); }
    if (freshDone && !silent) celebrate();
    $$('.stop').forEach(a => { if (a.getAttribute('href') === '#/scene/' + id) { a.classList.add('done'); a.querySelector('.stop-st').innerHTML = icon('check'); } });
    if (SCENES[id].uraianAfter) renderSteps(id);
  };
  ACT[id]($('#activity'), done, A(id));
}

/* =========================================================================
   AKTIVITAS PER SCENE — setiap hasil disimpan di state.act[id]
   ========================================================================= */
const ACT = {};

/* S01 — pengantar: masalah yang sering terjadi + peta materi */
ACT.S01 = (el, done, st) => {
  el.innerHTML = `<div class="intro1">
    <div class="i1-case">
      <p class="i1-q">Pernah kirim lamaran kerja, tapi tak kunjung dibalas? Bisa jadi masalahnya ada di email yang kamu kirim.</p>
      <div class="i1-mails">
        <div class="i1-mail bad"><span class="i1-tag">${icon('x')} Sebelum</span><b>syarif.keren99</b><span>lamaran!!! <em>halo kak aku mau ngelamar nih…</em></span></div>
        <div class="i1-mail good"><span class="i1-tag">${icon('check')} Sesudah</span><b>${NAMA}</b><span>Application for Graphic Designer Position – ${NAMA}</span></div>
      </div>
      <p class="muted">Di sini kamu akan belajar menulis email lamaran yang rapi dan berkomunikasi dengan HR secara profesional.</p>
    </div>
    <div class="i1-map">
      <h3>Yang akan kamu pelajari</h3>
      <ol>${MATERI.filter(m => /^m\d$/.test(m.id)).map(m => `<li><a href="#/scene/${m.scenes[0]}"><span>${m.no}</span>${m.title}</a></li>`).join('')}</ol>
      <div class="i1-post">${icon('pen')} Setelah itu, latihan soal lalu evaluasi.</div>
      <button type="button" class="btn btn-primary" data-ready>${icon('check')} Saya siap belajar</button>
    </div>
  </div>`;
  const ready = $('[data-ready]', el);
  const finish = silent => { st.ok = true; save(); ready.innerHTML = `${icon('check')} Siap! Tekan Lanjut di bawah`; ready.disabled = true; done(silent); };
  ready.onclick = () => { sfx('ok'); finish(false); };
  if (st.ok || st.played) finish(true);
};

/* S02 — klik 4 ikon di laptop */
ACT.S02 = (el, done, st) => {
  const items = [['megaphone', 'Menyampaikan informasi', 'Untuk pengumuman atau pesan resmi.'], ['file', 'Mengirim dokumen', 'Untuk mengirim CV, laporan, dan file lainnya.'], ['briefcase', 'Melamar kerja', 'Untuk memperkenalkan diri kepada perusahaan.'], ['users', 'Berkoordinasi', 'Untuk berkomunikasi dengan rekan kerja dan klien.']];
  st.seen = st.seen || [];
  el.innerHTML = `${actHead('pointer', 'Klik informasi', 'Dibuka <b>0</b> dari 4')}
  <div class="s02">
    <div class="laptop"><div class="lscreen"><div class="lbar"><i></i><i></i><i></i><span>Email di dunia kerja</span></div>
      <div class="lgrid">${items.map(([ic, t], i) => `<button type="button" class="lico" data-i="${i}"><span class="lico-c">${icon(ic)}<span class="lico-ck">${icon('check')}</span></span><span>${t}</span></button>`).join('')}</div></div><div class="lbase"></div></div>
    <div class="info-panel" aria-live="polite"><div class="ip-empty">${icon('pointer')}<p>Klik salah satu ikon di layar laptop.</p></div></div>
  </div>
  <div class="compare" hidden><b>Dibanding aplikasi chat, email itu…</b><div class="cmp-chips"><span>${icon('briefcase')} lebih formal</span><span>${icon('file')} tersimpan rapi</span><span>${icon('shield')} bisa jadi bukti komunikasi</span></div></div>`;
  const panel = $('.info-panel', el);
  const open = (i, silent) => {
    const [ic, t, d] = items[i], b = $(`.lico[data-i="${i}"]`, el);
    $$('.lico', el).forEach(x => x.classList.toggle('active', x === b)); b.classList.add('seen');
    if (!st.seen.includes(i)) { st.seen.push(i); save(); }
    panel.innerHTML = `<div class="ip-card"><span class="ip-ic">${icon(ic)}</span><h4>${t}</h4><p>${d}</p></div>`;
    $('.counter b', el).textContent = st.seen.length;
    if (st.seen.length === 4) { $('.compare', el).hidden = false; done(silent); }
    silent || sfx();
  };
  st.seen.slice().forEach(i => open(i, true));
  el.onclick = e => { const b = e.target.closest('.lico'); if (b) open(+b.dataset.i, false); };
};

/* S03 — seret & letakkan 5 bagian email */
ACT.S03 = (el, done, st) => {
  const parts = [['subject', 'Subject', 'Menjelaskan isi email secara singkat.'], ['greeting', 'Salam pembuka', 'Menunjukkan rasa hormat.'], ['body', 'Isi email', 'Memuat pesan utama, jelas dan ringkas.'], ['closing', 'Salam penutup', 'Mengakhiri email dengan sopan.'], ['signature', 'Tanda tangan', 'Nama pengirim, setelah salam penutup.']];
  st.placed = st.placed || [];
  let selected = null;
  const build = () => {
    const left = parts.filter(p => !st.placed.includes(p[0])).map(p => p[0]);
    const order = st.order && st.order.length ? st.order.filter(k => left.includes(k)) : shuffle(left.slice());
    if (!st.order) { st.order = order.slice(); save(); }
    el.innerHTML = `${actHead('grip', 'Seret & letakkan', `Terpasang <b>${st.placed.length}</b> dari 5`)}
    <p class="hint">Seret kartu ke slot yang pas. Di HP: ketuk kartu, lalu ketuk slotnya.</p>
    <div class="dnd">
      <div class="dcards">${order.map(k => `<button type="button" class="dcard" draggable="true" data-k="${k}">${icon('grip')}<span>${parts.find(p => p[0] === k)[1]}</span></button>`).join('')}</div>
      <div class="mframe"><div class="mf-top"><i></i><i></i><i></i><span>Pesan baru</span></div>
        ${parts.map(([k, t, d], i) => st.placed.includes(k)
          ? `<div class="slot slot-${k} filled" data-i="${i}"><span class="slot-n">${icon('check')}</span><span class="slot-txt"><b>${t}</b><small>${d}</small></span></div>`
          : `<div class="slot slot-${k}" data-i="${i}" tabindex="0" role="button" aria-label="Slot ${i + 1}"><span class="slot-n">${i + 1}</span><span class="ghost"><i></i><i></i><i></i></span></div>`).join('')}
      </div>
    </div>
    <div class="fb" hidden></div>
    ${st.placed.length ? `<button type="button" class="btn btn-outline btn-sm" data-reset>${icon('refresh')} Ulangi dari awal</button>` : ''}`;
    if (st.placed.length === 5) { showFb($('.fb', el), true, 'Pas! Urutan emailmu sudah rapi dan profesional.'); }
  };
  const tryPlace = (k, slot) => {
    if (!slot || slot.classList.contains('filled')) return;
    const i = +slot.dataset.i;
    if (parts[i][0] === k) {
      st.placed.push(k); save(); sfx('ok'); build();
      if (st.placed.length === 5) done(false); else showFb($('.fb', el), true, `Benar, slot ${i + 1} adalah ${parts[i][1].toLowerCase()}.`);
    } else {
      sfx('no'); slot.classList.remove('shake'); void slot.offsetWidth; slot.classList.add('shake');
      $$('.dcard', el).forEach(c => c.classList.remove('sel')); selected = null;
      showFb($('.fb', el), false, 'Belum pas. Ingat lagi, bagian mana yang pertama kali dilihat penerima?');
    }
  };
  build();
  if (st.placed.length === 5) done(true);
  el.addEventListener('click', e => {
    if (e.target.closest('[data-reset]')) { st.placed = []; st.order = null; save(); build(); return; }
    const c = e.target.closest('.dcard');
    if (c) { const on = !c.classList.contains('sel'); $$('.dcard', el).forEach(x => x.classList.remove('sel')); c.classList.toggle('sel', on); selected = on ? c.dataset.k : null; sfx(); return; }
    const s = e.target.closest('.slot');
    if (s && selected) tryPlace(selected, s); else if (s && !s.classList.contains('filled')) toast('Pilih kartunya dulu, lalu ketuk slotnya.');
  });
  el.addEventListener('keydown', e => { const s = e.target.closest('.slot'); if (s && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); s.click(); } });
  el.addEventListener('dragstart', e => { const c = e.target.closest('.dcard'); if (c) { e.dataTransfer.setData('text/plain', c.dataset.k); c.classList.add('dragging'); } });
  el.addEventListener('dragend', e => { const c = e.target.closest('.dcard'); c && c.classList.remove('dragging'); });
  el.addEventListener('dragover', e => { const s = e.target.closest('.slot'); if (s && !s.classList.contains('filled')) { e.preventDefault(); s.classList.add('over'); } });
  el.addEventListener('dragleave', e => { const s = e.target.closest('.slot'); s && s.classList.remove('over'); });
  el.addEventListener('drop', e => { const s = e.target.closest('.slot'); if (s) { e.preventDefault(); s.classList.remove('over'); tryPlace(e.dataTransfer.getData('text/plain'), s); } });
};

/* S04 — bandingkan kotak masuk + kuis subject */
ACT.S04 = (el, done, st) => {
  const row = (s, g) => `<div class="cmp-row ${g ? 'good' : ''}"><span class="iav">${g ? 'SU' : ''}</span><span>${s}</span></div>`;
  el.innerHTML = `${actHead('search', 'Studi kasus')}
  <div class="ibx-compare">
    <div class="ibx bad"><div class="ibx-h">${icon('x')} Kurang tepat</div>${['Lamaran', 'Halo Kak', 'Penting'].map(s => row(s)).join('')}</div>
    <div class="ibx good"><div class="ibx-h">${icon('check')} Tepat</div>${row(`Application for Graphic Designer Position – ${NAMA}`, true)}<p class="ibx-note">Singkat, jelas, spesifik, dan sesuai tujuan email.</p></div>
  </div>
  <div class="salam-grid">
    <div class="salam"><h4>Salam pembuka</h4><div class="code">Yth. Tim Rekrutmen PT ABC,</div><div class="code">Dear Hiring Manager,</div></div>
    <div class="salam"><h4>Salam penutup</h4><div class="code">Hormat saya,<br>${NAMA}</div><div class="code">Best regards,<br>${NAMA}</div></div>
  </div>
  <div class="quiz-box">${actHead('help', 'Kuis')}<div class="mcq"></div></div>`;
  mcq($('.mcq', el), { store: st, key: 'q', onDone: done, q: 'Kamu mau melamar posisi Marketing Staff. Subject mana yang paling pas?', opts: [
    { t: 'Lamaran', fb: 'Kurang pas. Subject ini terlalu umum, HR tidak tahu posisi apa yang kamu lamar.' },
    { t: 'Penting!!', fb: 'Kurang pas. Tidak spesifik, dan tanda serunya terkesan tidak formal.' },
    { t: 'Application for Marketing Staff – Nama Kamu', ok: true, fb: 'Tepat! Singkat, jelas, spesifik, dan langsung menunjukkan tujuan email.' },
    { t: 'Halo Kak', fb: 'Kurang pas. Ini sapaan santai, bukan subject, dan tidak menjelaskan isi email.' }] });
};

/* S05 — hotspot email lamaran */
ACT.S05 = (el, done, st) => {
  const hs = [['Subject yang jelas', 'Bagian pertama yang dilihat perekrut. Buat singkat, jelas, spesifik, dan sesuai tujuan email.'], ['Salam pembuka', 'Menunjukkan rasa hormat kepada penerima.'], ['Perkenalan diri singkat', 'Sebutkan nama dan latar belakang pendidikan secara singkat.'], ['Tujuan mengirim email', 'Sampaikan posisi yang kamu lamar.'], ['Keterangan lampiran', 'Sebutkan CV dan portofolio yang dilampirkan dalam format PDF.'], ['Salam penutup', 'Akhiri email dengan sopan, lalu tulis namamu.']];
  st.seen = st.seen || [];
  el.innerHTML = `${actHead('pointer', 'Klik bagian email', 'Dibuka <b>0</b> dari 6')}
  <div class="hs-wrap">
    <div class="mail">
      <div class="mail-meta"><span>Kepada</span>Tim Rekrutmen PT ABC</div>
      <button type="button" class="hs hs-subject" data-i="0"><span class="hs-dot">1</span><span><small>Subject</small>Application for Graphic Designer Position – ${NAMA}</span></button>
      <div class="mail-body">
        <button type="button" class="hs" data-i="1"><span class="hs-dot">2</span><span>Yth. Tim Rekrutmen PT ABC,</span></button>
        <button type="button" class="hs" data-i="2"><span class="hs-dot">3</span><span>Saya ${NAMA}, lulusan S1 Desain Komunikasi Visual.</span></button>
        <button type="button" class="hs" data-i="3"><span class="hs-dot">4</span><span>Melalui email ini, saya bermaksud melamar posisi Graphic Designer di PT ABC.</span></button>
        <button type="button" class="hs" data-i="4"><span class="hs-dot">5</span><span>Bersama email ini saya lampirkan CV dan portofolio saya sebagai bahan pertimbangan.<span class="attach-row"><span class="attach">${icon('clip')} CV_${NAMAF}.pdf</span><span class="attach">${icon('clip')} Portfolio_${NAMAF}.pdf</span></span></span></button>
        <button type="button" class="hs" data-i="5"><span class="hs-dot">6</span><span>Terima kasih atas waktu dan perhatian Bapak/Ibu.<br>Hormat saya,<br>${NAMA}</span></button>
      </div>
    </div>
    <aside class="hs-card" aria-live="polite"><div class="ip-empty">${icon('pointer')}<p>Klik titik bernomor untuk melihat fungsi tiap bagian.</p></div></aside>
  </div>`;
  const card = $('.hs-card', el);
  const open = (i, silent, showCard = true) => {
    const b = $(`.hs[data-i="${i}"]`, el); b.classList.add('seen');
    if (!st.seen.includes(i)) { st.seen.push(i); save(); }
    if (showCard) { $$('.hs', el).forEach(x => x.classList.toggle('active', x === b)); card.innerHTML = `<div class="ip-card"><span class="hs-num">${i + 1}</span><h4>${hs[i][0]}</h4><p>${hs[i][1]}</p></div><ol class="hs-list">${hs.map(([t], j) => `<li class="${st.seen.includes(j) ? 'on' : ''}">${st.seen.includes(j) ? icon('check') : '<span></span>'}${t}</li>`).join('')}</ol>`; }
    $('.counter b', el).textContent = st.seen.length;
    if (st.seen.length === 6) done(silent);
    silent || sfx();
  };
  st.seen.slice().forEach((i, k, arr) => open(i, true, k === arr.length - 1));
  el.onclick = e => { const b = e.target.closest('.hs'); if (b) open(+b.dataset.i, false); };
};

/* S06 — simulasi menulis email: pilih perkenalan + nama file */
ACT.S06 = (el, done, st) => {
  el.innerHTML = `${actHead('pen', 'Simulasi', '<b>0</b> dari 2 tepat')}
  <div class="compose">
    <div class="compose-top">${icon('pen')} Tulis Email</div>
    <div class="cf"><span>Kepada</span>Tim Rekrutmen PT ABC</div>
    <div class="cf"><span>Subject</span>Application for Graphic Designer Position – ${NAMA}</div>
    <div class="compose-body"><p>Yth. Tim Rekrutmen PT ABC,</p><p class="fill" id="fillIntro">[ pilih kalimat perkenalan di bawah ]</p><p>Bersama email ini saya lampirkan CV dan portofolio saya sebagai bahan pertimbangan.</p><p>Hormat saya,<br>${NAMA}</p></div>
    <div class="compose-attach"><span>${icon('clip')} Lampiran</span><span class="fill" id="fillFile">[ pilih file lampiran ]</span></div>
  </div>
  <div class="choice-group"><h4>1. Kalimat perkenalan yang tepat</h4><div class="mcq" id="mIntro"></div></div>
  <div class="choice-group"><h4>2. Nama file lampiran yang tepat</h4><div class="mcq" id="mFile"></div></div>
  <div class="fb" id="s06fb" hidden></div>`;
  let ok = 0;
  const hit = silent => { ok++; $('.counter b', el).textContent = ok; if (ok === 2) { showFb($('#s06fb', el), null, 'Emailmu siap dikirim. Jangan lupa cek lagi, pastikan lampirannya sudah terunggah dan bisa dibuka.'); done(silent); } };
  mcq($('#mIntro', el), { store: st, key: 'intro', opts: [
    { t: `“Saya ${NAMA}, lulusan S1 Desain Komunikasi Visual, bermaksud melamar posisi Graphic Designer.”`, ok: true, fb: 'Tepat. Singkat dan relevan: ada nama, latar belakang pendidikan, dan posisi yang dilamar.' },
    { t: '“Halo kak, aku Syarif, hobi main game, lagi nganggur nih.”', fb: 'Kurang pas. Bahasanya santai, dan isinya cerita pribadi yang tidak berhubungan dengan pekerjaan.' },
    { t: '“Saya anak pertama dari tiga bersaudara dan tinggal bersama orang tua.”', fb: 'Kurang pas. Info keluarga tidak ada hubungannya dengan pekerjaan. Fokus ke kemampuan yang mendukung posisi.' }],
    onDone: silent => { const f = $('#fillIntro', el); f.textContent = `Saya ${NAMA}, lulusan S1 Desain Komunikasi Visual, bermaksud melamar posisi Graphic Designer.`; f.classList.add('filled'); hit(silent); } });
  mcq($('#mFile', el), { store: st, key: 'file', opts: [
    { t: `CV_${NAMAF}.pdf`, ok: true, fb: 'Tepat. Formatnya PDF dan namanya rapi, mudah dikenali.' },
    { t: 'cv baru final.docx', fb: 'Kurang pas. Nama filenya tidak rapi dan formatnya bukan PDF.' },
    { t: 'scan0001.jpg', fb: 'Kurang pas. Nama file ini sulit dikenali dan formatnya bukan PDF.' }],
    onDone: silent => { const f = $('#fillFile', el); f.innerHTML = `<span class="attach">${icon('file')} CV_${NAMAF}.pdf</span>`; f.classList.add('filled'); hit(silent); } });
};

/* S07 — temukan 6 kesalahan */
ACT.S07 = (el, done, st) => {
  const segs = {
    from: ['Alamat email tidak profesional', 'Pakai alamat email yang memuat nama aslimu, bukan julukan.'],
    subject: ['Subject tidak jelas', `Subject yang baik itu spesifik, misalnya “Application for Graphic Designer Position – ${NAMA}”.`],
    company: ['Nama perusahaan salah tulis', 'Email ini untuk PT ABC, tapi di salam pembuka tertulis “PT ABD”.'],
    informal: ['Bahasa tidak formal', 'Hindari bahasa gaul, singkatan tidak resmi, dan emoji.'],
    long: ['Isi terlalu panjang', 'Isi email cukup singkat, padat, dan relevan. Cerita pribadi yang tidak berkaitan sebaiknya dibuang.'],
    attach: ['CV/portofolio tidak dilampirkan', 'Lampirkan CV dan portofolio, lalu pastikan sudah terunggah sebelum mengirim.'],
  };
  st.found = st.found || [];
  el.innerHTML = `${actHead('search', 'Temukan kesalahan', 'Ditemukan <b>0</b> dari 6')}
  <div class="spot-wrap">
    <div class="mail spot">
      <div class="mail-meta"><span>Dari</span><button type="button" class="sp" data-e="from">syarif.kerenabis99@email.com</button></div>
      <div class="mail-meta"><span>Kepada</span><button type="button" class="sp" data-ok>Tim Rekrutmen PT ABC</button></div>
      <div class="mail-meta"><span>Subject</span><button type="button" class="sp" data-e="subject">Lamaran</button></div>
      <div class="mail-body">
        <button type="button" class="sp" data-e="company">Yth. Tim Rekrutmen PT ABD,</button>
        <button type="button" class="sp" data-e="informal">Halo kak, aku Syarif nih, mau ngelamar jadi graphic designer yaa 😁</button>
        <button type="button" class="sp" data-e="long">Jadi gini, dari kecil aku memang suka gambar, terus pas sekolah sering ikut lomba, terus kuliah ambil desain, terus sempat bingung mau kerja di mana, terus temanku bilang coba saja daftar ke sini, jadi ya sudah aku coba kirim, soalnya aku juga lagi butuh kerjaan dan kantornya dekat rumah…</button>
        <button type="button" class="sp" data-ok>Terima kasih atas waktu dan perhatian Bapak/Ibu.</button>
        <button type="button" class="sp" data-ok>Hormat saya,<br>${NAMA}</button>
      </div>
      <div class="mail-attach"><span>${icon('clip')} Lampiran</span><button type="button" class="sp" data-e="attach">(tidak ada lampiran)</button></div>
    </div>
    <aside class="spot-side"><div class="fb" hidden></div><h4>Temuanmu</h4><ol class="found-list"><li class="empty">Belum ada yang ditemukan.</li></ol></aside>
  </div>`;
  const fb = $('.fb', el), list = $('.found-list', el);
  const mark = (k, silent) => {
    const b = $(`.sp[data-e="${k}"]`, el);
    if (!st.found.includes(k)) { st.found.push(k); save(); }
    const n = st.found.indexOf(k) + 1;
    b.classList.add('found'); b.insertAdjacentHTML('afterbegin', `<span class="sp-mark">${n}</span>`);
    if (n === 1) list.innerHTML = '';
    list.insertAdjacentHTML('beforeend', `<li><b>${segs[k][0]}</b><small>${segs[k][1]}</small></li>`);
    $('.counter b', el).textContent = st.found.length;
    if (!silent) { sfx('ok'); showFb(fb, true, `<b>${segs[k][0]}.</b> ${segs[k][1]}`); }
    if (st.found.length === 6) { showFb(fb, true, 'Semua kesalahan sudah ketemu! Kesalahan seperti ini bisa membuat lamaran tidak diproses lebih lanjut.'); done(silent); }
  };
  st.found.slice().forEach(k => mark(k, true));
  el.onclick = e => {
    const b = e.target.closest('.sp'); if (!b) return;
    if (b.hasAttribute('data-ok')) { showFb(fb, null, 'Bagian ini sudah benar.'); sfx(); b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); return; }
    if (!st.found.includes(b.dataset.e)) mark(b.dataset.e, false);
  };
};

/* S08 — praktik menulis email (draf & hasil disimpan) */
ACT.S08 = (el, done, st) => {
  const d = st.draft || {};
  const checks = ['Subject jelas', 'Salam sudah sesuai', 'Perkenalan singkat', 'Lampiran disebutkan', 'Bahasa formal'];
  el.innerHTML = `${actHead('pen', 'Praktik')}
  <div class="practice">
    <aside class="vacancy"><small>Lowongan</small><h4>Graphic Designer</h4><p>PT ABC</p>
      <div class="chk-h">${icon('list')} Daftar periksa</div>
      ${checks.map((c, i) => `<label class="chk"><input type="checkbox" data-c="${i}" ${d.c && d.c[i] ? 'checked' : ''}><span>${c}</span></label>`).join('')}
    </aside>
    <form class="pform" id="pform">
      <label>Subject<input name="subject" value="${esc(d.subject || '')}" placeholder="Tulis subject email…"></label>
      <label>Salam pembuka<input name="greeting" value="${esc(d.greeting || '')}" placeholder="Tulis salam pembuka…"></label>
      <label>Isi email<textarea name="body" rows="4" placeholder="Perkenalan singkat, tujuan email, dan keterangan lampiran…">${esc(d.body || '')}</textarea></label>
      <label>Salam penutup<input name="closing" value="${esc(d.closing || '')}" placeholder="Salam penutup dan nama…"></label>
      <div class="pform-foot"><span class="muted small" id="pHint"></span><button class="btn btn-primary" type="submit" id="pSend" disabled>${icon('send')} Kirim</button></div>
    </form>
  </div>
  <div class="pcompare" hidden></div>`;
  const form = $('#pform', el), send = $('#pSend', el), box = $('.pcompare', el);
  const read = () => ({ subject: form.subject.value.trim(), greeting: form.greeting.value.trim(), body: form.body.value.trim(), closing: form.closing.value.trim(), c: $$('[data-c]', el).map(x => x.checked) });
  const check = () => {
    const v = read(); st.draft = v; save();
    const filled = v.subject && v.greeting && v.body && v.closing, allc = v.c.every(Boolean);
    send.disabled = !(filled && allc);
    $('#pHint', el).textContent = !filled ? 'Isi semua bagian emailnya dulu.' : !allc ? 'Centang daftar periksa setelah kamu mengecek emailmu.' : 'Siap dikirim.';
  };
  const showCompare = v => {
    box.hidden = false;
    box.innerHTML = `<div class="pc-col"><h4>${icon('pen')} Emailmu</h4><div class="pc-mail"><p><small>Subject</small>${esc(v.subject)}</p><p>${esc(v.greeting)}</p><p>${esc(v.body).replace(/\n/g, '<br>')}</p><p>${esc(v.closing)}</p></div></div>
      <div class="pc-col model"><h4>${icon('check')} Contoh jawaban</h4><div class="pc-mail"><p><small>Subject</small>Application for Graphic Designer Position – ${NAMA}</p><p>Yth. Tim Rekrutmen PT ABC,</p><p>Saya ${NAMA}, lulusan S1 Desain Komunikasi Visual, bermaksud melamar posisi Graphic Designer di PT ABC. Bersama email ini saya lampirkan CV dan portofolio saya (CV_${NAMAF}.pdf dan Portfolio_${NAMAF}.pdf) sebagai bahan pertimbangan. Terima kasih atas waktu dan perhatian Bapak/Ibu.</p><p>Hormat saya,<br>${NAMA}</p></div></div>
      <p class="pc-note">${icon('bulb')} Bandingkan emailmu dengan contoh di atas memakai daftar periksa. Kamu boleh memperbaiki lalu mengirim ulang.</p>`;
  };
  el.addEventListener('input', check); check();
  if (st.sent) { showCompare(st.sent); done(true); }
  form.onsubmit = e => { e.preventDefault(); const v = read(); st.sent = v; save(); sfx('ok'); showCompare(v); box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); done(false); };
};

/* S09 — CC/BCC + jam (angka 12 di atas) + 2 kuis */
ACT.S09 = (el, done, st) => {
  const R = 84;
  const pt = (h, r) => { const a = (h % 12) / 12 * 2 * Math.PI - Math.PI / 2; return [100 + r * Math.cos(a), 100 + r * Math.sin(a)]; };
  /* Busur jam kerja 08.00 → 17.00 (searah jarum jam melewati angka 12) */
  const [x1, y1] = pt(8, R), [x2, y2] = pt(17, R);
  el.innerHTML = `${actHead('users', 'Penjelasan visual')}
  <div class="cc-wrap">
    <div class="cc-diagram" id="ccd">
      <svg viewBox="0 0 520 300" role="img" aria-label="Satu email dikirim ke penerima utama, CC, dan BCC">
        <path class="ln to" d="M110 150 C 250 150, 260 45, 380 45"/><path class="ln cc" d="M110 150 C 250 150, 260 110, 380 110"/><path class="ln cc" d="M110 150 C 250 150, 260 165, 380 165"/><path class="ln bcc" d="M110 150 C 250 150, 260 220, 380 220"/><path class="ln bcc" d="M110 150 C 250 150, 260 275, 380 275"/>
        <g class="node sender"><circle cx="70" cy="150" r="40"/><text x="70" y="146">Email</text><text x="70" y="164" class="sm">kamu</text></g>
        <g class="node to"><rect x="380" y="25" width="130" height="40" rx="20"/><text x="445" y="50">Kepada</text></g>
        <g class="node cc"><rect x="380" y="90" width="130" height="40" rx="20"/><text x="445" y="115">CC</text></g>
        <g class="node cc"><rect x="380" y="145" width="130" height="40" rx="20"/><text x="445" y="170">CC</text></g>
        <g class="node bcc"><rect x="380" y="200" width="130" height="40" rx="20"/><text x="445" y="225">BCC</text></g>
        <g class="node bcc"><rect x="380" y="255" width="130" height="40" rx="20"/><text x="445" y="280">BCC</text></g>
      </svg>
      <button type="button" class="btn btn-primary btn-sm" id="ccPlay">${icon('play')} Putar animasi</button>
    </div>
    <div class="cc-cards">
      <div class="cc-card"><span class="tag cc">CC</span><b>Carbon Copy</b><p>Salinan untuk orang lain yang perlu tahu isi email.</p></div>
      <div class="cc-card"><span class="tag bcc">BCC</span><b>Blind Carbon Copy</b><p>Salinan yang alamat penerimanya disembunyikan, jadi privasi tetap terjaga.</p></div>
      <div class="cc-seen" ${st.cc ? '' : 'hidden'}>${icon('eye')} Semua penerima bisa melihat <b>Kepada</b> dan <b>CC</b>. Penerima <b>BCC</b> tidak terlihat.</div>
    </div>
  </div>
  <div class="time-wrap">
    <div class="clock">
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="92" class="c-bg"/>
        <path d="M ${x1} ${y1} A ${R} ${R} 0 1 1 ${x2} ${y2}" class="c-work"/>
        ${Array.from({ length: 12 }, (_, i) => { const h = i + 1, [x, y] = pt(h, 66); const [a1, b1] = pt(h, 76), [a2, b2] = pt(h, 84); return `<line x1="${a1}" y1="${b1}" x2="${a2}" y2="${b2}" class="tick"/><text x="${x}" y="${y + 4.5}" class="c-num">${h}</text>`; }).join('')}
        <line x1="100" y1="100" x2="100" y2="52" class="hand h-hour" id="hHour"/>
        <line x1="100" y1="100" x2="100" y2="34" class="hand h-min"/>
        <circle cx="100" cy="100" r="5" class="c-pin"/>
      </svg>
      <div class="clock-dig" id="hourTxt">10.00</div>
    </div>
    <div class="time-ctl">
      <h4>${icon('clock')} Kapan sebaiknya mengirim email?</h4>
      <p class="muted small">Garis merah di jam menandai jam kerja, pukul 08.00–17.00. Geser untuk mencoba jam kirim yang lain.</p>
      <label class="range"><input type="range" min="0" max="23" value="${st.hour ?? 10}" id="hour" aria-label="Jam kirim"><span class="range-scale"><i>00</i><i>06</i><i>12</i><i>18</i><i>23</i></span></label>
      <div class="fb" id="hourFb" hidden></div>
      <div class="days">${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d, i) => `<span class="${i > 4 ? 'off' : ''}">${d}</span>`).join('')}<small>Sabtu–Minggu libur</small></div>
    </div>
  </div>
  <div class="quiz-box">${actHead('help', 'Kuis 1')}<div class="mcq" id="q1"></div></div>
  <div class="quiz-box">${actHead('help', 'Kuis 2')}<div class="mcq" id="q2"></div></div>`;
  $('#ccPlay', el).onclick = () => { const d = $('#ccd', el); d.classList.remove('play'); void d.offsetWidth; d.classList.add('play'); $('.cc-seen', el).hidden = false; st.cc = true; save(); sfx(); };
  const hour = $('#hour', el);
  const upd = () => {
    const h = +hour.value; st.hour = h; save();
    $('#hourTxt', el).textContent = String(h).padStart(2, '0') + '.00';
    $('#hHour', el).setAttribute('transform', `rotate(${(h % 12) / 12 * 360} 100 100)`);
    const ok = h >= 8 && h <= 17;
    showFb($('#hourFb', el), ok, ok ? 'Pas, ini masih jam kerja.' : h < 8 ? 'Terlalu pagi. Tunggu jam kerja dimulai, ya.' : 'Sudah lewat jam kerja. Hindari mengirim larut malam, kecuali ada keperluan mendesak.');
  };
  hour.oninput = upd; upd();
  let solved = 0; const hit = silent => { if (++solved === 2) done(silent); };
  mcq($('#q1', el), { store: st, key: 'q1', onDone: hit, q: 'Kamu mengirim pengumuman ke 20 orang yang tidak saling kenal. Fitur apa yang tepat?', opts: [
    { t: 'CC', fb: 'Kurang pas. Kalau pakai CC, semua penerima bisa melihat alamat penerima lain.' },
    { t: 'BCC', ok: true, fb: 'Tepat! Dengan BCC, alamat penerima lain tidak terlihat, jadi privasi tetap aman.' },
    { t: 'Forward', fb: 'Kurang pas. Forward itu meneruskan email, bukan menyembunyikan daftar penerima.' }] });
  mcq($('#q2', el), { store: st, key: 'q2', onDone: hit, q: 'Kapan waktu terbaik mengirim email lamaran?', opts: [
    { t: 'Jam kerja (08.00–17.00)', ok: true, fb: 'Tepat! Email profesional sebaiknya dikirim di jam kerja.' },
    { t: 'Tengah malam', fb: 'Kurang pas. Hindari mengirim email larut malam.' },
    { t: 'Hari libur', fb: 'Kurang pas. Hindari hari libur, kecuali memang mendesak.' }] });
};

/* S10 — pilih langkah follow-up */
ACT.S10 = (el, done, st) => {
  const choices = [
    { k: 'A', t: 'Kirim email follow-up yang sopan dan singkat.', ok: true },
    { k: 'B', t: 'Kirim email setiap hari sampai dibalas.', fb: 'Kurang tepat. HR bisa merasa terganggu. Follow-up cukup sekali, sopan, dan tidak memaksa.' },
    { k: 'C', t: 'Diam saja dan menunggu.', fb: 'Kurang tepat. Kamu jadi kehilangan kesempatan untuk menunjukkan minatmu.' },
  ];
  st.tried = st.tried || [];
  el.innerHTML = `${actHead('branch', 'Pilih langkahmu')}
  <div class="sc-chat"><span class="sc-av">SU</span><div class="bubble"><b>${NAMA}</b><p>Aku sudah kirim lamaran Graphic Designer ke PT ABC <b>6 hari kerja lalu</b>, tapi belum ada balasan. Sebaiknya aku ngapain, ya?</p></div></div>
  <div class="dayline">${Array.from({ length: 8 }, (_, d) => `<span class="${d >= 5 ? 'win' : ''} ${d === 6 ? 'today' : ''}">${d === 0 ? 'Kirim' : 'H+' + d}${d === 6 ? '<em>hari ini</em>' : ''}</span>`).join('')}<small>${icon('calendar')} Waktu follow-up: sekitar 5–7 hari kerja</small></div>
  <div class="branch">${choices.map(c => `<button type="button" class="bcard" data-k="${c.k}"><span class="bk">${c.k}</span><span>${c.t}</span></button>`).join('')}</div>
  <div class="bresult" aria-live="polite"></div>`;
  const res = $('.bresult', el);
  const choose = (k, silent) => {
    const c = choices.find(x => x.k === k), b = $(`.bcard[data-k="${k}"]`, el);
    if (c.ok) {
      $$('.bcard', el).forEach(x => (x.disabled = true)); b.classList.add('ok'); silent || sfx('ok');
      res.innerHTML = `<div class="fb fb-ok">${icon('check')}<span><b>Langkah yang tepat.</b> Begini contoh email follow-up-nya:</span></div>
      <div class="mail followup"><div class="mail-meta"><span>Subject</span><b>Follow-up Application for Graphic Designer – ${NAMA}</b></div>
      <div class="mail-body plain"><p>Yth. Tim Rekrutmen PT ABC,</p><p>Saya ${NAMA}, pelamar posisi Graphic Designer. Pada (tanggal) saya telah mengirimkan lamaran beserta CV dan portofolio. Mohon informasi mengenai perkembangan proses seleksi.</p><p>Terima kasih atas waktu dan perhatian Bapak/Ibu.</p><p>Hormat saya,<br>${NAMA}</p></div></div>`;
      done(silent);
    } else {
      b.classList.add('no'); b.disabled = true; silent || sfx('no');
      res.innerHTML = `<div class="fb fb-no">${icon('x')}<span>${c.fb} Coba pilih langkah lain.</span></div>`;
    }
  };
  st.tried.forEach(k => choose(k, true));
  el.onclick = e => { const b = e.target.closest('.bcard'); if (!b || b.disabled) return; st.tried.push(b.dataset.k); save(); choose(b.dataset.k, false); };
};

/* S11 — 3 kasus pilih kalimat */
ACT.S11 = (el, done, st) => {
  const cases = [
    { bad: 'Mohon info lanjutannya ya Kak, makasih 🙏', good: 'Mohon informasi mengenai perkembangan proses seleksi. Terima kasih.', wb: 'Kurang pas: ada bahasa gaul (“info”, “ya Kak”, “makasih”) dan emoji.', wg: 'Tepat: jelas, sopan, dan mudah dipahami.' },
    { bad: 'Sy kirim lamaran ya, tolong dicek!!!', good: 'Saya telah mengirimkan lamaran. Mohon dapat diperiksa. Terima kasih.', wb: 'Kurang pas: ada singkatan tidak resmi (“Sy”) dan tanda seru berlebihan.', wg: 'Tepat: kalimatnya efektif, ejaannya benar.' },
    { bad: 'SELAMAT PAGI PAK, SAYA MAU DAFTAR KERJA', good: 'Selamat pagi, Bapak/Ibu. Saya bermaksud melamar posisi Graphic Designer.', wb: 'Kurang pas: semuanya huruf kapital, dan bahasanya kurang formal.', wg: 'Tepat: sopan, formal, dan menyebut posisi yang dilamar.' },
  ];
  st.picks = st.picks || [];
  st.order = st.order || cases.map(() => Math.random() < .5 ? ['good', 'bad'] : ['bad', 'good']); save();
  let idx = Math.min(st.picks.length, 2);
  const render = () => {
    const c = cases[idx], picked = st.picks[idx];
    el.innerHTML = `${actHead('type', 'Pilih kalimat', `Kasus <b>${idx + 1}</b> dari 3`)}
    <div class="steps">${cases.map((_, i) => `<button type="button" class="step ${i < st.picks.length ? 'past' : ''} ${i === idx ? 'cur' : ''}" data-go="${i}" ${i > st.picks.length ? 'disabled' : ''} aria-label="Kasus ${i + 1}"></button>`).join('')}</div>
    <p class="q">Kalimat mana yang paling pas untuk email profesional?</p>
    <div class="vs">${st.order[idx].map(k => `<button type="button" class="vs-card ${picked ? (k === 'good' ? 'ok' : 'no') : ''}" data-k="${k}" ${picked ? 'disabled' : ''}>${icon('mail')}<span>“${k === 'good' ? c.good : c.bad}”</span></button>`).join('<span class="vs-or">atau</span>')}</div>
    <div class="fb" hidden></div><div class="vs-next"></div>`;
    if (picked) after(picked === 'good', true);
  };
  const after = (good, silent) => {
    const c = cases[idx];
    showFb($('.fb', el), good, good ? c.wg : `${c.wb} Yang lebih pas: “${c.good}”`);
    const score = st.picks.filter(p => p === 'good').length;
    $('.vs-next', el).innerHTML = idx < 2 ? `<button type="button" class="btn btn-primary btn-sm" data-next>Kasus berikutnya ${icon('right')}</button>` : `<div class="fb fb-info">${icon('award')}<span>Selesai! Kamu memilih <b>${score} dari 3</b> kalimat dengan tepat.</span></div>`;
    if (st.picks.length === 3) done(silent);
  };
  render();
  el.onclick = e => {
    const go = e.target.closest('[data-go]'); if (go && !go.disabled) { idx = +go.dataset.go; render(); return; }
    if (e.target.closest('[data-next]')) { idx = Math.min(idx + 1, 2); render(); sfx(); return; }
    const b = e.target.closest('.vs-card'); if (!b || b.disabled) return;
    const good = b.dataset.k === 'good';
    st.picks[idx] = b.dataset.k; save(); sfx(good ? 'ok' : 'no');
    $$('.vs-card', el).forEach(x => { x.disabled = true; x.classList.add(x.dataset.k === 'good' ? 'ok' : 'no'); });
    after(good, false);
  };
};

/* =========================================================================
   MESIN SOAL (dipakai latihan & evaluasi)
   Tipe: mcq, match, order, sort, spot, hour
   ========================================================================= */
function qInit(q, ans) {
  if (ans !== undefined && ans !== null) return ans;
  if (q.type === 'order') { let o; do { o = shuffle(q.items.map((_, i) => i)); } while (o.every((v, i) => v === i)); return o; }
  if (q.type === 'match') return q.pairs.map(() => '');
  if (q.type === 'sort') return q.items.map(() => -1);
  if (q.type === 'spot') return q.segs.map(() => false);
  if (q.type === 'hour') return 12;
  return null;
}
function qScore(q, a) {
  if (a === null || a === undefined) return 0;
  switch (q.type) {
    case 'mcq': return a === q.a ? 1 : 0;
    case 'order': return a.filter((v, i) => v === i).length / a.length;
    case 'match': return q.pairs.filter((p, i) => a[i] === p[1]).length / q.pairs.length;
    case 'sort': return q.items.filter((it, i) => a[i] === it[1]).length / q.items.length;
    case 'spot': return q.segs.filter((sg, i) => !!a[i] === !!sg[1]).length / q.segs.length;
    case 'hour': return a >= 8 && a <= 17 ? 1 : 0;
  }
  return 0;
}
function qAnswered(q, a) {
  if (a === null || a === undefined) return false;
  if (q.type === 'match') return a.every(Boolean);
  if (q.type === 'sort') return a.every(v => v >= 0);
  return true;
}
/* Render satu soal. mode: 'latihan' (ada pemeriksaan & pembahasan) atau 'ujian' (tanpa umpan balik) */
function qRender(box, q, a, { mode, checked, onChange }) {
  const lock = mode === 'latihan' && checked;
  let body = '';
  if (q.type === 'mcq') body = `<div class="opts">${q.opts.map((t, i) => `<button type="button" class="opt ${a === i ? 'picked' : ''} ${lock ? (i === q.a ? 'ok' : a === i ? 'no' : '') : ''}" data-i="${i}" ${lock ? 'disabled' : ''}><span class="opt-l">${'ABCD'[i]}</span><span class="opt-t">${t}</span></button>`).join('')}</div>`;
  if (q.type === 'order') body = `<ol class="olist">${a.map((v, pos) => `<li class="${lock ? (v === pos ? 'ok' : 'no') : ''}"><span class="o-n">${pos + 1}</span><span class="o-t">${q.items[v]}</span>${lock ? '' : `<span class="o-btn"><button type="button" data-up="${pos}" ${pos === 0 ? 'disabled' : ''} aria-label="Naikkan">${icon('up')}</button><button type="button" data-down="${pos}" ${pos === a.length - 1 ? 'disabled' : ''} aria-label="Turunkan">${icon('down')}</button></span>`}</li>`).join('')}</ol>`;
  if (q.type === 'match') { const opts = [...new Set(q.pairs.map(p => p[1]))].sort(); body = `<div class="mlist">${q.pairs.map((p, i) => `<label class="mrow ${lock ? (a[i] === p[1] ? 'ok' : 'no') : ''}"><span>${p[0]}</span><select data-m="${i}" ${lock ? 'disabled' : ''}><option value="">— pilih —</option>${opts.map(o => `<option ${a[i] === o ? 'selected' : ''}>${o}</option>`).join('')}</select></label>`).join('')}</div>`; }
  if (q.type === 'sort') body = `<div class="slist">${q.items.map((it, i) => `<div class="srow2 ${lock ? (a[i] === it[1] ? 'ok' : 'no') : ''}"><span class="s-t">${it[0]}</span><span class="seg2">${q.buckets.map((bk, b) => `<button type="button" data-s="${i}" data-b="${b}" class="${a[i] === b ? 'on' : ''}" ${lock ? 'disabled' : ''}>${bk}</button>`).join('')}</span></div>`).join('')}</div>`;
  if (q.type === 'spot') body = `<div class="mail spot spot-q">${q.segs.map((sg, i) => `<button type="button" class="sp ${a[i] ? 'marked' : ''}" data-sp="${i}">${sg[0]}</button>`).join('')}</div><p class="muted small">Ketuk bagian yang menurutmu salah. Ketuk lagi untuk membatalkan.</p>`;
  if (q.type === 'hour') body = `<div class="hour-q"><div class="clock-dig big">${String(a).padStart(2, '0')}.00</div><label class="range"><input type="range" min="0" max="23" value="${a}" data-hour aria-label="Jam kirim"><span class="range-scale"><i>00</i><i>06</i><i>12</i><i>18</i><i>23</i></span></label></div>`;
  box.innerHTML = `<p class="q">${q.q}</p>${body}`;
  const set = v => { onChange(v); };
  box.onclick = e => {
    const o = e.target.closest('.opt'); if (o && !o.disabled) { set(+o.dataset.i); return; }
    const up = e.target.closest('[data-up]'); if (up) { const p = +up.dataset.up, n = a.slice(); [n[p - 1], n[p]] = [n[p], n[p - 1]]; set(n); return; }
    const dn = e.target.closest('[data-down]'); if (dn) { const p = +dn.dataset.down, n = a.slice(); [n[p + 1], n[p]] = [n[p], n[p + 1]]; set(n); return; }
    const s = e.target.closest('[data-s]'); if (s && !s.disabled) { const n = a.slice(); n[+s.dataset.s] = +s.dataset.b; set(n); return; }
    const sp = e.target.closest('[data-sp]'); if (sp) { const n = a.slice(); n[+sp.dataset.sp] = !n[+sp.dataset.sp]; set(n); }
  };
  box.onchange = e => { const m = e.target.closest('[data-m]'); if (m) { const n = a.slice(); n[+m.dataset.m] = m.value; set(n); } };
  box.oninput = e => { const h = e.target.closest('[data-hour]'); if (h) { $('.clock-dig', box).textContent = String(h.value).padStart(2, '0') + '.00'; onChange(+h.value, true); } };
}

/* ---------- Bank soal LATIHAN (soal baru, berbeda dari aktivitas di materi) ---------- */
const LATIHAN = [
  { type: 'mcq', topic: 'Kegunaan email', q: 'Dibanding aplikasi chat, apa kelebihan email di dunia kerja?', opts: ['Lebih santai dan boleh pakai emoji', 'Lebih formal, tersimpan rapi, dan bisa jadi bukti komunikasi', 'Pesannya otomatis hilang setelah dibaca', 'Hanya bisa dipakai untuk mengirim dokumen'], a: 1, why: 'Email lebih formal, tersimpan rapi, dan bisa dijadikan bukti komunikasi.' },
  { type: 'mcq', topic: 'Bagian email', q: 'Urutan bagian email profesional yang benar adalah …', opts: ['Salam pembuka → subject → isi → tanda tangan → salam penutup', 'Isi → subject → salam penutup → salam pembuka → tanda tangan', 'Subject → salam pembuka → isi → salam penutup → tanda tangan', 'Tanda tangan → subject → isi → salam pembuka → salam penutup'], a: 2, why: 'Urutannya subject, salam pembuka, isi, salam penutup, lalu tanda tangan.' },
  { type: 'mcq', topic: 'Subject', q: 'Subject yang baik itu …', opts: ['Panjang dan menceritakan seluruh isi email', 'Singkat, jelas, spesifik, dan sesuai tujuan email', 'Diberi kata “Penting!!” supaya cepat dibuka', 'Diisi sapaan seperti “Halo Kak”'], a: 1, why: 'Subject yang baik singkat, jelas, spesifik, dan menggambarkan tujuan email.' },
  { type: 'mcq', topic: 'Susunan lamaran', q: 'Mana yang TIDAK perlu ada di email lamaran?', opts: ['Perkenalan diri singkat', 'Keterangan lampiran CV dan portofolio', 'Cerita tentang keluarga dan hobi', 'Salam penutup'], a: 2, why: 'Cerita pribadi yang tidak berhubungan dengan pekerjaan sebaiknya tidak ditulis.' },
  { type: 'mcq', topic: 'Lampiran', q: 'Nama file CV yang paling rapi adalah …', opts: ['cv_fix_banget_revisi2.docx', 'IMG_2041.jpg', `CV_${NAMAF}.pdf`, 'lamaran baru.zip'], a: 2, why: 'Pakai format PDF dengan nama file yang rapi dan mudah dikenali.' },
  { type: 'mcq', topic: 'Kesalahan umum', q: 'Mana yang termasuk kesalahan saat mengirim email lamaran?', opts: ['Menulis subject yang spesifik', 'Memakai bahasa formal', 'Menulis nama perusahaan dengan benar', 'Lupa melampirkan CV atau portofolio'], a: 3, why: 'Lupa melampirkan CV atau portofolio bisa membuat lamaran tidak diproses.' },
  { type: 'mcq', topic: 'CC', q: 'Kapan sebaiknya kamu memakai CC?', opts: ['Saat ada pihak lain yang perlu tahu isi email, misalnya atasanmu', 'Saat ingin menyembunyikan alamat para penerima', 'Saat menulis subject email', 'Saat melampirkan CV dan portofolio'], a: 0, why: 'CC dipakai untuk mengirim salinan email kepada pihak lain yang perlu mengetahui isinya. Untuk menyembunyikan penerima, pakai BCC.' },
  { type: 'mcq', topic: 'Waktu kirim', q: 'Kenapa waktu mengirim email perlu diperhatikan?', opts: ['Karena email yang dikirim malam hari otomatis terhapus', 'Karena waktu kirim memengaruhi kemungkinan email dibaca penerima', 'Karena email hanya bisa dikirim saat jam kerja', 'Karena waktu kirim tidak berpengaruh apa pun'], a: 1, why: 'Waktu pengiriman memengaruhi kemungkinan email dibaca. Itulah sebabnya email profesional dikirim di jam kerja.' },
  { type: 'mcq', topic: 'Follow-up', q: 'Kalau belum ada kabar, kapan biasanya follow-up dikirim?', opts: ['Satu jam setelah lamaran dikirim', 'Sekitar 5–7 hari kerja setelah lamaran dikirim', 'Setiap hari sampai dibalas', 'Tidak perlu follow-up sama sekali'], a: 1, why: 'Follow-up biasanya dikirim sekitar 5–7 hari kerja setelah lamaran terkirim.' },
  { type: 'mcq', topic: 'Bahasa', q: 'Kalimat mana yang paling pas untuk email profesional?', opts: ['Kak, gimana lamaran aku? 🙏', 'TOLONG SEGERA DIBALAS', 'gmn kabar lamaran sy', 'Mohon maaf mengganggu, saya ingin menanyakan perkembangan lamaran saya. Terima kasih.'], a: 3, why: 'Kalimat yang jelas dan sopan, tanpa singkatan, emoji, atau kapital berlebihan.' },
  { type: 'mcq', topic: 'Salam pembuka', q: 'Apa fungsi salam pembuka di email?', opts: ['Menunjukkan rasa hormat kepada penerima', 'Menjelaskan isi email secara singkat', 'Menyebutkan lampiran yang dikirim', 'Menunjukkan nama pengirim'], a: 0, why: 'Salam pembuka dipakai untuk menunjukkan rasa hormat kepada penerima.' },
  { type: 'mcq', topic: 'Perkenalan', q: 'Apa saja yang cukup disebutkan saat memperkenalkan diri di email lamaran?', opts: ['Nama, hobi, dan alamat rumah', 'Nama, latar belakang pendidikan, dan posisi yang dilamar', 'Nama orang tua dan jumlah saudara', 'Alasan kenapa sedang menganggur'], a: 1, why: 'Cukup sebutkan nama, latar belakang pendidikan, dan posisi yang dilamar.' },
  { type: 'mcq', topic: 'Lampiran', q: 'Format file yang disarankan untuk CV dan portofolio adalah …', opts: ['JPG hasil foto layar', 'PDF', 'Link tanpa keterangan', 'Dokumen yang belum disimpan'], a: 1, why: 'CV dan portofolio sebaiknya dikirim dalam format PDF.' },
  { type: 'mcq', topic: 'Email lamaran', q: 'Kenapa email lamaran disebut “kesan pertama”?', opts: ['Karena dikirim paling pagi', 'Karena perekrut mulai menilai kandidat dari email tersebut', 'Karena hanya dibaca satu kali', 'Karena harus dikirim sebelum wawancara'], a: 1, why: 'Email lamaran adalah kesan pertama yang memengaruhi penilaian perekrut.' },
  { type: 'mcq', topic: 'Salam penutup', q: 'Salam penutup mana yang paling tepat?', opts: ['“Udah gitu aja, makasih.”', '“Hormat saya,” lalu nama pengirim', '“Ditunggu balasannya ASAP!!”', '“Bye 👋”'], a: 1, why: 'Salam penutup yang sopan, misalnya “Hormat saya,” lalu diikuti nama pengirim.' },
  { type: 'mcq', topic: 'Follow-up', q: 'Bagaimana sebaiknya nada email follow-up?', opts: ['Tegas dan sedikit mendesak', 'Sopan, singkat, dan tidak memaksa', 'Panjang supaya HR paham', 'Santai seperti chat dengan teman'], a: 1, why: 'Email follow-up harus sopan, singkat, dan tidak terkesan memaksa.' },
  { type: 'mcq', topic: 'Benar atau salah', q: '“CC dipakai untuk mengirim salinan email kepada orang yang perlu tahu isinya.”', opts: ['Benar', 'Salah'], a: 0, why: 'Benar. Itulah kegunaan CC (Carbon Copy).' },
  { type: 'mcq', topic: 'Benar atau salah', q: '“Mengirim email lamaran tengah malam tidak masalah, asalkan isinya rapi.”', opts: ['Benar', 'Salah'], a: 1, why: 'Salah. Hindari mengirim email larut malam, kecuali ada keperluan mendesak.' },
  { type: 'mcq', topic: 'Benar atau salah', q: '“Isi email lamaran sebaiknya panjang supaya perekrut tahu semua tentang kita.”', opts: ['Benar', 'Salah'], a: 1, why: 'Salah. Isi email sebaiknya singkat, padat, dan relevan.' },
  { type: 'mcq', topic: 'Benar atau salah', q: '“Sebelum mengirim, pastikan semua lampiran sudah terunggah dan bisa dibuka.”', opts: ['Benar', 'Salah'], a: 0, why: 'Benar. Lampiran yang gagal terunggah bisa membuat lamaranmu tidak diproses.' },
  { type: 'match', topic: 'Istilah', q: 'Pasangkan istilah dengan artinya.', pairs: [['Subject', 'Judul singkat isi email'], ['CC', 'Salinan yang penerimanya terlihat'], ['BCC', 'Salinan yang penerimanya disembunyikan'], ['Follow-up', 'Menanyakan kabar proses rekrutmen']], why: 'Subject = judul email; CC = salinan terlihat; BCC = salinan tersembunyi; follow-up = menanyakan perkembangan lamaran.' },
  { type: 'match', topic: 'Contoh & bagian', q: 'Pasangkan contoh tulisan dengan bagian emailnya.', pairs: [['“Yth. Tim Rekrutmen PT ABC,”', 'Salam pembuka'], [`“Hormat saya, ${NAMA}”`, 'Salam penutup'], [`“Application for Graphic Designer Position – ${NAMA}”`, 'Subject'], [`“CV_${NAMAF}.pdf”`, 'Lampiran']], why: 'Yth. … = salam pembuka; Hormat saya = salam penutup; Application for … = subject; CV_… .pdf = lampiran.' },
  { type: 'order', topic: 'Email follow-up', q: 'Urutkan isi email follow-up dari atas ke bawah.', items: ['Yth. Tim Rekrutmen PT ABC,', `Saya ${NAMA}, pelamar posisi Graphic Designer.`, 'Saya telah mengirimkan lamaran beserta CV dan portofolio pada (tanggal).', 'Mohon informasi mengenai perkembangan proses seleksi.', 'Terima kasih atas waktu dan perhatian Bapak/Ibu.', `Hormat saya, ${NAMA}`], why: 'Salam pembuka → perkenalan → keterangan lamaran → pertanyaan → terima kasih → penutup.' },
  { type: 'order', topic: 'Sebelum kirim', q: 'Urutkan langkah sebelum menekan tombol kirim, dari yang pertama.', items: ['Tulis subject yang jelas', 'Tulis salam pembuka dan isi email', 'Lampirkan CV dan portofolio (PDF)', 'Cek lagi lampiran sudah terunggah', 'Kirim di jam kerja'], why: 'Subject → salam dan isi → lampiran → cek lampiran → kirim di jam kerja.' },
  { type: 'sort', topic: 'Kesalahan vs kebiasaan baik', q: 'Kelompokkan: mana kebiasaan baik dan mana kesalahan?', buckets: ['Kebiasaan baik', 'Kesalahan'], items: [['Subject spesifik sesuai posisi', 0], ['Alamat email berisi julukan', 1], ['Isi email singkat dan relevan', 0], ['Salah menulis nama perusahaan', 1], ['Mengirim di jam kerja', 0], ['Lupa melampirkan CV', 1]], why: 'Kesalahan umum: alamat email tidak profesional, salah tulis nama perusahaan, dan lupa lampiran.' },
];

/* ---------- Bank soal EVALUASI (dari aktivitas materi, tanpa pilihan ganda) ---------- */
const EVALUASI = [
  { type: 'order', q: 'Susun bagian-bagian email profesional dari atas ke bawah.', items: ['Subject', 'Salam pembuka', 'Isi email', 'Salam penutup', 'Tanda tangan'] },
  { type: 'match', q: 'Pasangkan bagian email lamaran dengan fungsinya.', pairs: [['Perkenalan diri', 'Menyebut nama dan pendidikan'], ['Tujuan email', 'Menyebut posisi yang dilamar'], ['Keterangan lampiran', 'Menyebut CV dan portofolio'], ['Salam penutup', 'Mengakhiri email dengan sopan']] },
  { type: 'sort', q: 'Kelompokkan file berikut: mana yang layak dilampirkan?', buckets: ['Layak', 'Tidak layak'], items: [[`CV_${NAMAF}.pdf`, 0], ['cv baru final.docx', 1], [`Portfolio_${NAMAF}.pdf`, 0], ['scan0001.jpg', 1]] },
  { type: 'spot', q: 'Tandai bagian email ini yang salah.', segs: [['Dari: syarif.kerenabis99@email.com', true], ['Kepada: Tim Rekrutmen PT ABC', false], ['Subject: Lamaran', true], ['Yth. Tim Rekrutmen PT ABC,', false], ['Halo kak, aku mau ngelamar yaa 😁', true], ['Hormat saya, Syarif Udin', false]] },
  { type: 'match', q: 'Pilih fitur yang tepat untuk setiap situasi.', pairs: [['Atasanmu perlu tahu isi email yang kamu kirim ke klien', 'CC'], ['Pengumuman ke 20 orang yang tidak saling kenal', 'BCC'], ['Penerima utama email lamaranmu', 'Kepada']] },
  { type: 'hour', q: 'Atur jam yang tepat untuk mengirim email lamaran.' },
  { type: 'order', q: 'Lamaran belum dibalas. Urutkan langkah yang tepat.', items: ['Kirim lamaran di jam kerja', 'Tunggu sekitar 5–7 hari kerja', 'Belum ada kabar dari perusahaan', 'Kirim satu email follow-up yang sopan dan singkat'] },
  { type: 'sort', q: 'Kelompokkan kalimat berikut: formal atau tidak formal?', buckets: ['Formal', 'Tidak formal'], items: [['Mohon informasi mengenai perkembangan proses seleksi.', 0], ['Sy kirim lamaran ya, tolong dicek!!!', 1], ['Selamat pagi, Bapak/Ibu.', 0], ['Mohon info lanjutannya ya Kak 🙏', 1], ['SAYA MAU DAFTAR KERJA', 1], ['Terima kasih atas waktu dan perhatian Bapak/Ibu.', 0]] },
];

/* =========================================================================
   LAYAR: LATIHAN SOAL (ada pembahasan, hasil disimpan)
   ========================================================================= */
function viewLatihan() { return `<div class="lesson-wide wrap">${routeRail('L')}<div id="quiz"></div></div>`; }
function mountLatihan() {
  const L = state.lat = state.lat || { i: 0, ans: {}, res: {}, v: 2 }; save();
  const box = $('#quiz');
  const render = () => {
    const i = L.i, q = LATIHAN[i], checked = L.res[i] !== undefined, a = qInit(q, L.ans[i]);
    if (L.ans[i] === undefined && q.type !== 'mcq') { L.ans[i] = a; save(); }
    const benar = Object.values(L.res).filter(Boolean).length, dijawab = Object.keys(L.res).length;
    const ok = materiDone();
    box.innerHTML = `    <article class="sheet">
      <div class="eyebrow">Latihan & Evaluasi · <span class="scode">L</span> · Latihan soal</div>
      <h1 class="display">Latihan Soal</h1>
      <p class="meta">${LATIHAN.length} soal campuran · jawab, periksa, lalu baca pembahasannya</p>
      <div class="lat-panel">
        <div class="score-box"><b>${benar}</b><span>benar dari ${dijawab} soal yang sudah diperiksa</span></div>
        <div class="lat-nums"><div class="qgrid wide">${LATIHAN.map((_, k) => `<button type="button" class="qn ${k === i ? 'cur' : ''} ${L.res[k] === true ? 'ok' : L.res[k] === false ? 'no' : ''}" data-go="${k}">${k + 1}</button>`).join('')}</div>
          <div class="legend-s"><span><i class="lg ok"></i>benar</span><span><i class="lg no"></i>belum tepat</span><button type="button" class="link-btn" data-reset>${icon('refresh')} Ulangi latihan</button></div></div>
      </div>
      <section class="act-sec"><div class="act-head"><span class="act-tag">${icon('pen')} ${q.topic}</span><span class="counter">Soal <b>${i + 1}</b> dari ${LATIHAN.length}</span></div>
        <div class="act-card"><div id="qbox"></div><div class="fb" id="qfb" hidden></div>
        <div class="quiz-foot">
          <button type="button" class="btn btn-outline btn-sm" data-prev ${i === 0 ? 'disabled' : ''}>${icon('left')} Sebelumnya</button>
          ${checked ? '' : `<button type="button" class="btn btn-primary btn-sm" data-check ${qAnswered(q, a) ? '' : 'disabled'}>Periksa jawaban</button>`}
          <button type="button" class="btn btn-outline btn-sm" data-next ${i === LATIHAN.length - 1 ? 'disabled' : ''}>Berikutnya ${icon('right')}</button>
        </div></div>
      </section>
      <nav class="lesson-nav">
        <a class="btn btn-outline" href="#/scene/S11">${icon('left')} Kembali ke materi</a>
        <a class="btn btn-primary ${ok ? '' : 'is-locked'}" href="#/scene/S12" id="nextBtn">${ok ? '' : icon('lock')} Ke evaluasi ${icon('right')}</a>
      </nav>
    </article>`;
    qRender($('#qbox', box), q, a, { mode: 'latihan', checked, onChange: (v, soft) => { L.ans[i] = v; save(); if (!soft) render(); else { const c = $('[data-check]', box); if (c) c.disabled = false; } } });
    if (checked) showFb($('#qfb', box), L.res[i], `${L.res[i] ? 'Benar!' : 'Belum tepat.'} ${q.why}`);
  };
  render();
  box.addEventListener('click', e => {
    const nb = e.target.closest('#nextBtn'); if (nb && nb.classList.contains('is-locked')) { e.preventDefault(); toast('Evaluasi terbuka setelah semua scene materi selesai.'); return; }
    const go = e.target.closest('[data-go]'); if (go) { L.i = +go.dataset.go; save(); render(); return; }
    if (e.target.closest('[data-prev]')) { L.i = Math.max(0, L.i - 1); save(); render(); return; }
    if (e.target.closest('[data-next]')) { L.i = Math.min(LATIHAN.length - 1, L.i + 1); save(); render(); return; }
    if (e.target.closest('[data-check]')) { const q = LATIHAN[L.i], ok = qScore(q, L.ans[L.i]) === 1; L.res[L.i] = ok; save(); sfx(ok ? 'ok' : 'no'); render(); updateBar(); if (Object.keys(L.res).length === LATIHAN.length) toast('Semua soal latihan sudah kamu kerjakan!'); return; }
    if (e.target.closest('[data-reset]')) { if (!confirm('Ulangi latihan dari awal? Jawaban latihan akan dihapus.')) return; state.lat = { i: 0, ans: {}, res: {}, v: 2 }; save(); updateBar(); mountLatihan(); }
  });
}

/* =========================================================================
   S12 — EVALUASI: tanpa umpan balik per soal, hanya nilai akhir
   ========================================================================= */
ACT.S12 = (el, done, st) => {
  if (!materiDone()) {
    const left = MATERI_SCENES.filter(id => !state.done[id]);
    el.innerHTML = `<div class="lockbox"><a href="#/scene/${left[0]}" title="Lanjutkan materi">${icon('lock')}</a><h3>Evaluasi masih terkunci</h3><p class="muted">Selesaikan dulu semua scene materi. Tinggal ${left.length} lagi:</p>
      <div class="rec-links">${left.map(id => `<a class="rec-link" href="#/scene/${id}">${id} · ${SCENES[id].title}</a>`).join('')}</div></div>`;
    return;
  }
  const E = state.ev = state.ev || { i: 0, ans: {}, done: false }; save();
  const N = EVALUASI.length;
  const TYPE = { order: ['list', 'Urutkan'], match: ['branch', 'Pasangkan'], sort: ['layers', 'Kelompokkan'], spot: ['search', 'Tandai kesalahan'], hour: ['clock', 'Atur jam'] };
  const touched = k => !!(E.touched && E.touched[k]);
  let dir = 0, justSealed = -1, mode = 'q';
  const anim = (sel, frames, ms) => { const c = $(sel, el); if (!c || reduced) return; try { c.animate(frames, { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' }); } catch (e) { /* tanpa animasi */ } };
  const stamps = cur => `<div class="stamps" role="list">${EVALUASI.map((q, k) => `<button type="button" role="listitem" class="stamp ${k === cur ? 'cur' : ''} ${touched(k) ? 'sealed' : ''} ${k === justSealed ? 'just' : ''}" data-go="${k}" title="Soal ${k + 1} · ${TYPE[q.type][1]}"><span class="st-n">${k + 1}</span>${icon(TYPE[q.type][0])}</button>`).join('')}</div>`;

  const intro = () => {
    mode = 'intro';
    el.innerHTML = `<div class="ev-intro2">
      <div class="ev-stats"><div><b>${N}</b><span>soal</span></div><div><b>${KKM}</b><span>batas lulus</span></div><div><b>${icon('eyeoff')}</b><span>tanpa tanda benar/salah</span></div></div>
      <p>Soalnya diambil dari aktivitas di materi. Ada lima jenis soal, arahkan kursor untuk melihat contohnya:</p>
      <div class="type-tiles">${Object.entries(TYPE).map(([k, [ic, t]]) => `<div class="tt" tabindex="0"><div class="tt-in"><div class="tt-f">${icon(ic)}<b>${t}</b></div><div class="tt-b">${{ order: 'Susun bagian email dari atas ke bawah.', match: 'Pasangkan bagian email dengan fungsinya.', sort: 'Pisahkan mana yang layak dan tidak.', spot: 'Ketuk bagian email yang salah.', hour: 'Geser jam kirim yang tepat.' }[k]}</div></div></div>`).join('')}</div>
      <p class="muted">Selama mengerjakan, tidak ada tanda benar atau salah. Jawabanmu tersimpan otomatis, dan nilai akhir muncul setelah semua jawaban dikirim.</p>
      <button type="button" class="btn btn-primary btn-lg" data-start>Mulai evaluasi ${icon('right')}</button></div>`;
  };

  const render = () => {
    mode = 'q';
    const i = E.i, q = EVALUASI[i], a = qInit(q, E.ans[i]);
    if (E.ans[i] === undefined) { E.ans[i] = a; save(); }
    const answered = EVALUASI.filter((_, k) => touched(k)).length;
    el.innerHTML = `<div class="ev-top"><div><small>Soal ${i + 1} dari ${N} · ${TYPE[q.type][1]}</small><b>${answered}/${N} terjawab</b></div><span class="ev-saved" id="evSaved">${icon('check')} Tersimpan</span></div>
      ${stamps(i)}
      <div class="ev-deck"><div class="ev-card"><div id="qbox"></div></div></div>
      <div class="quiz-foot">
        <button type="button" class="btn btn-outline" data-prev ${i === 0 ? 'disabled' : ''}>${icon('left')} Sebelumnya</button>
        ${i < N - 1 ? `<button type="button" class="btn btn-primary" data-next>Berikutnya ${icon('right')}</button>` : `<button type="button" class="btn btn-gold" data-review>${icon('list')} Periksa lembar jawaban</button>`}
      </div>`;
    qRender($('#qbox', el), q, a, { mode: 'ujian', onChange: (v, soft) => {
      const first = !touched(i);
      E.ans[i] = v; E.touched = E.touched || {}; E.touched[i] = true; save();
      if (!soft) { dir = 0; justSealed = first ? i : -1; render(); }
      const sv = $('#evSaved', el); if (sv) { sv.classList.remove('show'); void sv.offsetWidth; sv.classList.add('show'); }
    } });
    if (dir) anim('.ev-card', [{ opacity: 0, transform: `translateX(${dir * 90}px) rotate(${dir * 2}deg)` }, { opacity: 1, transform: 'none' }], 480);
    justSealed = -1;
  };

  const review = () => {
    mode = 'review';
    const answered = EVALUASI.filter((_, k) => touched(k)).length;
    el.innerHTML = `<div class="ev-top"><div><small>Lembar jawaban</small><b>${answered}/${N} terjawab</b></div></div>
      <p class="muted">Amplop tertutup berarti soal sudah kamu jawab. Klik amplop untuk kembali ke soalnya.</p>
      <div class="envs">${EVALUASI.map((q, k) => `<button type="button" class="env ${touched(k) ? 'sealed' : 'open'}" data-go="${k}"><span class="env-ic">${icon(touched(k) ? 'mail' : 'inbox')}</span><b>Soal ${k + 1}</b><small>${touched(k) ? 'Terjawab' : 'Belum dijawab'}</small></button>`).join('')}</div>
      <div class="quiz-foot"><button type="button" class="btn btn-outline" data-back>${icon('left')} Kembali mengerjakan</button><button type="button" class="btn btn-primary btn-lg" data-submit>${icon('send')} Kirim semua jawaban</button></div>`;
    anim('.envs', [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], 450);
  };

  const result = (animated) => {
    mode = 'result';
    const pass = E.score >= KKM;
    el.innerHTML = `<div class="ev-result ${pass ? 'pass' : 'fail'}">
      <div class="ring big" style="--p:${animated ? 0 : E.score}"><b>${animated ? 0 : E.score}</b><small>nilai akhir</small></div>
      <div><div class="badge ${pass ? 'ok' : 'no'}">${pass ? icon('check') + ' Lulus' : icon('refresh') + ' Perlu mengulang'}</div>
        <h3>${pass ? 'Selamat, kamu lulus evaluasi!' : 'Nilaimu belum mencapai batas lulus.'}</h3>
        <p class="muted">${pass ? 'Kamu bisa lanjut ke penutup.' : `Batas lulusnya ${KKM}. Pelajari lagi materinya mulai dari Materi 1, lalu kerjakan ulang evaluasinya.`}</p>
        <div class="row-btns">${pass ? `<a class="btn btn-primary" href="#/scene/S13">Ke penutup ${icon('right')}</a>` : `<a class="btn btn-primary" href="#/scene/S02">${icon('book')} Pelajari lagi materinya</a><button type="button" class="btn btn-outline" data-retry>${icon('refresh')} Kerjakan ulang</button>`}</div>
      </div></div>`;
    if (animated) {
      const ring = $('.ring', el), b = $('.ring b', el), t0 = performance.now();
      setTimeout(() => ring.style.setProperty('--p', E.score), 60);
      const step = t => { const k = Math.min(1, (t - t0) / 1200); b.textContent = Math.round(E.score * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
      later(() => { b.textContent = E.score; ring.style.setProperty('--p', E.score); }, 1500);
      if (pass) celebrate();
    }
  };

  const submit = () => {
    /* Hanya soal yang benar-benar dijawab yang dinilai (jawaban bawaan tidak diberi poin) */
    const total = EVALUASI.reduce((sum, q, k) => sum + (touched(k) ? qScore(q, E.ans[k]) : 0), 0);
    E.score = Math.round(total / N * 100); E.done = true; save(); updateBar();
    el.innerHTML = `<div class="sending"><span class="plane">${icon('send')}</span><b>Mengirim jawaban…</b></div>`;
    sfx('click');
    later(() => { sfx(E.score >= KKM ? 'ok' : 'no'); result(true); if (E.score >= KKM) done(false); }, reduced ? 0 : 1100);
  };

  const goTo = k => { if (k < 0 || k >= N || (k === E.i && mode === 'q')) return; dir = k >= E.i ? 1 : -1; E.i = k; save(); sfx(); render(); };
  if (E.done) { result(false); if (E.score >= KKM) done(true); }
  else if (E.started) render(); else intro();

  el.onclick = e => {
    if (e.target.closest('[data-start]')) { E.started = true; save(); sfx(); dir = 1; render(); return; }
    if (e.target.closest('[data-retry]')) { state.ev = { i: 0, ans: {}, done: false, started: true }; save(); ACT.S12(el, done, st); return; }
    const g = e.target.closest('[data-go]'); if (g) { goTo(+g.dataset.go); return; }
    if (e.target.closest('[data-prev]')) { goTo(E.i - 1); return; }
    if (e.target.closest('[data-next]')) { goTo(E.i + 1); return; }
    if (e.target.closest('[data-review]')) { sfx(); review(); return; }
    if (e.target.closest('[data-back]')) { dir = -1; render(); return; }
    if (e.target.closest('[data-submit]')) submit();
  };
  const onKey = e => {
    if (mode !== 'q' || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight' && E.i < N - 1) { e.preventDefault(); goTo(E.i + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(E.i - 1); }
  };
  document.addEventListener('keydown', onKey);
  onLeave(() => document.removeEventListener('keydown', onKey));
};

/* S13 — rangkuman + masukan */
ACT.S13 = (el, done) => {
  if (!evalPassed()) { el.innerHTML = `<div class="lockbox"><a href="#/scene/S12" title="Ke evaluasi">${icon('lock')}</a><h3>Penutup masih terkunci</h3><p class="muted">Halaman ini terbuka setelah kamu lulus evaluasi.</p><a class="btn btn-primary" href="#/scene/S12">Ke evaluasi ${icon('right')}</a></div>`; return; }
  const fb = state.feedback;
  const thanks = f => `<div class="thanks"><a href="#/" title="Beranda">${icon('check')}</a><h3>Terima kasih atas masukanmu!</h3><p class="muted">Nilai ${f.rate}/5${f.saran ? ` · “${esc(f.saran)}”` : ''}</p></div>`;
  el.innerHTML = `<div class="infog" id="infog">
    <div class="ig-head"><a class="brand-mark sm" href="#/" title="Beranda">${LOGO}</a><div><b>SMART EMAILING</b><small>Rangkuman pelatihan</small></div></div>
    <div class="ig-grid">
      <div class="ig"><h4 data-to="#/scene/S03" title="Buka S03">${icon('layers')} Bagian email</h4><ol><li>Subject</li><li>Salam pembuka</li><li>Isi email</li><li>Salam penutup</li><li>Tanda tangan</li></ol></div>
      <div class="ig"><h4 data-to="#/scene/S08" title="Buka S08">${icon('list')} Cek sebelum kirim</h4><ul class="ticks"><li>Subject jelas</li><li>Salam sesuai</li><li>Perkenalan singkat</li><li>Lampiran disebutkan</li><li>Bahasa formal</li></ul></div>
      <div class="ig"><h4 data-to="#/scene/S09" title="Buka S09">${icon('users')} CC dan BCC</h4><p><b>CC</b>: salinan, penerimanya terlihat.</p><p><b>BCC</b>: salinan, penerimanya disembunyikan.</p></div>
      <div class="ig"><h4 data-to="#/scene/S09" title="Buka S09">${icon('clock')} Waktu kirim</h4><p class="ig-big">08.00–17.00</p><p>Di jam kerja. Hindari larut malam dan hari libur.</p></div>
      <div class="ig"><h4 data-to="#/scene/S10" title="Buka S10">${icon('calendar')} Follow-up</h4><p class="ig-big">5–7 hari kerja</p><p>Kalau belum ada kabar. Sopan, singkat, tidak memaksa.</p></div>
      <div class="ig"><h4 data-to="#/scene/S11" title="Buka S11">${icon('type')} Bahasa</h4><p>Jelas dan sopan. Tanpa bahasa gaul, singkatan, emoji, atau kapital berlebihan.</p></div>
    </div>
  </div>
  <div class="row-btns"><button type="button" class="btn btn-outline btn-sm" data-print>${icon('printer')} Simpan rangkuman (PDF)</button></div>
  <div class="feedback" id="fbBox">${fb ? thanks(fb) : `<h3>Beri masukan</h3><form id="fbForm">
    <div class="stars" role="radiogroup" aria-label="Nilai 1 sampai 5">${[1, 2, 3, 4, 5].map(n => `<label><input type="radio" name="rate" value="${n}"><span>${icon('star')}</span><em>${n}</em></label>`).join('')}</div>
    <label class="saran">Saran<textarea name="saran" rows="2" placeholder="Apa yang bisa diperbaiki dari pelatihan ini?"></textarea></label>
    <button class="btn btn-primary btn-sm" type="submit">${icon('send')} Kirim masukan</button></form>`}</div>`;
  $('[data-print]', el).onclick = () => { document.body.classList.add('print-infog'); window.print(); setTimeout(() => document.body.classList.remove('print-infog'), 500); };
  const form = $('#fbForm', el);
  if (form) form.onsubmit = e => { e.preventDefault(); const r = form.querySelector('input[name=rate]:checked'); if (!r) { toast('Pilih nilai 1–5 dulu, ya.'); return; } state.feedback = { rate: +r.value, saran: form.saran.value.trim() }; save(); sfx('ok'); $('#fbBox', el).innerHTML = thanks(state.feedback); };
  done(false);
};

/* =========================================================================
   LAYAR PANDUAN
   ========================================================================= */
const GLOSARIUM = [
  ['BCC (Blind Carbon Copy)', 'Mengirim salinan email dengan alamat penerima yang disembunyikan dari penerima lain.', 'S09'],
  ['CC (Carbon Copy)', 'Mengirim salinan email kepada orang lain yang perlu tahu isinya. Alamatnya terlihat oleh semua penerima.', 'S09'],
  ['CV dan portofolio', 'Dokumen pendukung lamaran. Kirim dalam format PDF dengan nama file yang rapi.', 'S06'],
  ['Email lamaran kerja', 'Email untuk memperkenalkan diri, menyampaikan minat pada posisi tertentu, dan mengirim CV serta portofolio.', 'S05'],
  ['Evaluasi', 'Soal akhir tanpa pilihan ganda. Terbuka setelah semua materi selesai, dan hanya menampilkan nilai akhir.', 'S12'],
  ['Follow-up', 'Email untuk menanyakan kabar proses rekrutmen, biasanya 5–7 hari kerja setelah lamaran dikirim.', 'S10'],
  ['Isi email', 'Bagian yang memuat pesan utama, ditulis jelas dan ringkas.', 'S03'],
  ['Jam kerja', 'Waktu yang pas untuk mengirim email profesional, sekitar pukul 08.00–17.00.', 'S09'],
  ['Lampiran', 'File yang ikut dikirim bersama email, misalnya CV dan portofolio.', 'S06'],
  ['Salam pembuka', 'Kalimat pembuka yang menunjukkan rasa hormat, misalnya “Yth. Tim Rekrutmen PT ABC,”.', 'S04'],
  ['Salam penutup', 'Kalimat penutup yang sopan, misalnya “Hormat saya,” lalu diikuti nama.', 'S04'],
  ['Subject', 'Judul email. Bagian pertama yang dilihat penerima, jadi harus singkat, jelas, dan spesifik.', 'S04'],
  ['Tanda tangan', 'Nama pengirim di bagian paling bawah email.', 'S03'],
];
const pageWrap = (eyebrow, title, inner) => `<div class="page wrap"><article class="sheet wide"><div class="eyebrow">Panduan · ${eyebrow}</div><h1 class="display">${title}</h1>${inner}</article></div>`;

function viewTujuan() {
  return pageWrap('Tujuan belajar', 'Yang akan kamu kuasai', `
    <div class="goal-main"><p>Setelah mengikuti pelatihan ini, peserta mampu <b>merancang email lamaran kerja yang efektif</b>, sesuai susunan dan etika komunikasi profesional di dunia kerja.</p><small>Sasaran: fresh graduate</small></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kode</th><th>Topik</th><th>Tujuan</th></tr></thead><tbody>
      ${ORDER.map(id => `<tr><td><a href="#/scene/${id}">${id}</a></td><td>${SCENES[id].title}</td><td>${SCENES[id].tujuan}</td></tr>`).join('')}
      <tr><td><a href="#/latihan">L</a></td><td>Latihan Soal</td><td>Menguji pemahaman lewat ${LATIHAN.length} soal campuran beserta pembahasannya.</td></tr>
    </tbody></table></div>`);
}
function viewPetunjuk() {
  const kode = [['Normal', 'Tombol', 'Tampilan awal sebelum disentuh.'], ['Hover', 'Tombol', 'Tampilan saat kursor ada di atas tombol (hanya di laptop).'], ['Hit', 'Tombol', 'Diklik atau diketuk untuk lanjut ke tahap berikutnya.'], ['Swipe', 'Objek', 'Digeser atau digulir.'], ['Seret & letakkan', 'Objek', 'Seret lalu lepaskan. Di HP: ketuk kartu, lalu ketuk slotnya.'], ['Show', 'Objek', 'Penjelasan atau umpan balik yang muncul setelah suatu aksi.']];
  return pageWrap('Petunjuk', 'Cara memakai modul ini', `
    <div class="how">${[['inbox', 'Mulai dari pengantar', 'S01 menjelaskan tujuan dan tiga materi.', '#/scene/S01'], ['book', 'Baca materinya', 'Materi di setiap scene dibaca per kartu. Pindah kartu dengan tombol Berikutnya.', '#/materi'], ['pointer', 'Kerjakan aktivitasnya', 'Tombol Lanjut aktif setelah aktivitas di halaman itu selesai.', '#/scene/S02'], ['grid', 'Bebas pindah halaman', 'Buka menu untuk lompat ke scene mana saja. Hasilmu tidak akan hilang.', '#/peta'], ['pen', 'Latihan soal', `Ada ${LATIHAN.length} soal campuran dengan pembahasan.`, '#/latihan'], ['flag', 'Evaluasi', `Terbuka setelah semua materi selesai. Batas lulus ${KKM}, dan nilainya baru muncul di akhir.`, '#/scene/S12']].map(([ic, t, d, h]) => `<a class="how-item" href="${h}"><span class="how-ic">${icon(ic)}</span><div><b>${t}</b><p>${d}</p></div></a>`).join('')}</div>
    <h2 class="h2">Kode interaksi</h2>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kode</th><th>Untuk</th><th>Artinya</th></tr></thead><tbody>${kode.map(([a, b, c]) => `<tr><td><b>${a}</b></td><td>${b}</td><td>${c}</td></tr>`).join('')}</tbody></table></div>
    <h2 class="h2">Progres tersimpan otomatis</h2>
    <p class="muted">Jawaban setiap aktivitas, latihan, evaluasi, dan masukanmu tersimpan di browser ini. Kalau mau mulai dari awal:</p>
    <button type="button" class="btn btn-outline btn-sm" id="resetBtn">${icon('trash')} Hapus semua progres</button>`);
}
function mountPetunjuk() { $('#resetBtn').onclick = () => { if (!confirm('Hapus semua progres, jawaban, dan nilai di browser ini?')) return; const snd = state.sound; state = fresh(); state.sound = snd; save(); updateBar(); toast('Progres sudah dihapus.'); }; }

function viewAlur() {
  const node = (id, cls = '') => `<a class="fnode ${cls} ${state.done[id] ? 'ok' : ''}" href="#/scene/${id}"><span class="fcode">${id}</span><b>${SCENES[id].title}</b></a>`;
  const arrow = '<span class="farrow" aria-hidden="true"></span>';
  return pageWrap('Alur belajar', 'Flowchart', `
    <p class="muted small">Setiap scene punya kotak sendiri lengkap dengan kodenya. Klik kotak untuk membuka scene.</p>
    <div class="flow">
      <div class="frow"><span class="fterm">Mulai</span>${arrow}<div class="fgroup"><span class="fg-l">Pembuka</span>${node('S01')}</div></div>
      ${MATERI.filter(m => /^m\d$/.test(m.id)).map(m => `<div class="frow">${arrow}<div class="fgroup"><span class="fg-l">${m.short} · ${m.title}</span>${m.scenes.map(node).join(arrow)}</div></div>`).join('')}
      <div class="frow">${arrow}<a class="fnode" href="#/latihan"><span class="fcode">L</span><b>Latihan Soal</b></a>${arrow}<span class="fdecide">Semua materi selesai?</span>${arrow}${node('S12', 'dark')}${arrow}<span class="fdecide">Nilai ≥ ${KKM}?</span></div>
      <div class="frow split"><div class="fbranch ok"><span class="fb-l">Ya</span>${node('S13')}${arrow}<span class="fterm">Selesai</span></div><div class="fbranch no"><span class="fb-l">Tidak</span><a class="fnode" href="#/scene/S02"><span class="fcode">S02</span><b>Ulangi dari Materi 1</b></a></div></div>
    </div>`);
}
function viewPeta() {
  const topics = { m1: [['Kegunaan email di dunia kerja', 'S02'], ['Bagian-bagian email', 'S03'], ['Subject yang efektif', 'S04'], ['Salam pembuka dan penutup', 'S04']], m2: [['Fungsi dan susunan email lamaran', 'S05'], ['Memperkenalkan diri', 'S06'], ['Melampirkan CV dan portofolio', 'S06'], ['Kesalahan yang sering terjadi', 'S07'], ['Praktik menulis email lamaran', 'S08']], m3: [['CC dan BCC', 'S09'], ['Waktu mengirim email', 'S09'], ['Follow-up ke HR', 'S10'], ['Bahasa formal dan sopan', 'S11']] };
  return pageWrap('Peta konsep', 'Seluruh isi dalam satu peta', `
    <div class="cmap"><a class="cm-root" href="#/scene/S01">${icon('mail')}<b>Smart Emailing</b></a>
      <div class="cm-cols">${MATERI.filter(m => topics[m.id]).map(m => `<div class="cm-col"><a class="cm-m" href="#/scene/${m.scenes[0]}"><span>${m.no}</span><b>${m.title}</b></a><ul>${topics[m.id].map(([t, id]) => `<li><a class="cm-t ${state.done[id] ? 'done' : ''}" href="#/scene/${id}">${t}<small>${id}</small></a></li>`).join('')}</ul></div>`).join('')}</div>
      <div class="cm-end"><a href="#/latihan">${icon('pen')} Latihan soal</a><a href="#/scene/S12">${icon('flag')} Evaluasi</a><a href="#/scene/S13">${icon('award')} Penutup</a></div>
    </div>`);
}
function viewGlosarium() {
  return pageWrap('Glosarium', 'Istilah penting', `
    <label class="search">${icon('search')}<input id="gq" type="search" placeholder="Cari istilah…" aria-label="Cari istilah"></label>
    <dl class="gloss">${GLOSARIUM.map(([t, d, id]) => `<div class="g-item" data-t="${(t + ' ' + d).toLowerCase()}"><dt>${t}</dt><dd>${d} <a href="#/scene/${id}">${id} ${icon('right')}</a></dd></div>`).join('')}</dl>
    <p class="muted" id="gEmpty" hidden>Istilah tidak ditemukan.</p>`);
}
function mountGlosarium() { $('#gq').oninput = e => { const q = e.target.value.trim().toLowerCase(); let n = 0; $$('.g-item').forEach(g => { const s = !q || g.dataset.t.includes(q); g.hidden = !s; n += s; }); $('#gEmpty').hidden = n > 0; }; }

/* =========================================================================
   ROUTER
   ========================================================================= */
const PAGES = {
  '': { v: viewHome, title: '' },
  materi: { v: viewMateri, title: 'Materi', nav: 'materi' },
  menu: { v: viewMateri, title: 'Materi', nav: 'materi' },
  latihan: { v: viewLatihan, m: mountLatihan, title: 'Latihan soal', nav: 'latihan' },
  tujuan: { v: viewTujuan, title: 'Tujuan belajar', nav: 'panduan' },
  petunjuk: { v: viewPetunjuk, m: mountPetunjuk, title: 'Petunjuk', nav: 'panduan' },
  alur: { v: viewAlur, title: 'Alur belajar', nav: 'panduan' },
  peta: { v: viewPeta, title: 'Peta konsep', nav: 'panduan' },
  glosarium: { v: viewGlosarium, m: mountGlosarium, title: 'Glosarium', nav: 'panduan' },
};

let routeToken = 0, firstRoute = true, lastKey = null;

/* =========================================================================
   TRANSISI ANTAR-HALAMAN — berbeda menurut tujuan, tetap halus
   ========================================================================= */
const GUIDE = ['tujuan', 'petunjuk', 'alur', 'peta', 'glosarium'];
function pickTransition(from, to) {
  if (from === to) return null;
  if (to === 'S12') return 'curtain';
  if (to === 'S13') return 'circle';
  const fi = ORDER.indexOf(from), ti = ORDER.indexOf(to);
  if (ti >= 0 && fi >= 0) return ti > fi ? 'slideL' : 'slideR';
  if (ti >= 0) return 'wipe';
  if (to === 'latihan') return 'flip';
  if (to === '') return 'zoom';
  if (to === 'materi' || to === 'menu') return 'rise';
  if (GUIDE.includes(to)) return 'blur';
  return 'zoom';
}
const EASE = 'cubic-bezier(.2, .8, .2, 1)';
const T_EXIT = {
  slideL: [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(-90px)' }],
  slideR: [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(90px)' }],
  wipe: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-18px)' }],
  flip: [{ opacity: 1, transform: 'perspective(1400px) rotateY(0)' }, { opacity: 0, transform: 'perspective(1400px) rotateY(16deg)' }],
  zoom: [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.94)' }],
  rise: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-14px)' }],
  blur: [{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(6px)' }],
  circle: [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.98)' }],
};
const T_ENTER = {
  slideL: [{ opacity: 0, transform: 'translateX(140px)' }, { opacity: 1, transform: 'translateX(0)' }],
  slideR: [{ opacity: 0, transform: 'translateX(-140px)' }, { opacity: 1, transform: 'translateX(0)' }],
  wipe: [{ opacity: .4, clipPath: 'inset(0 0 100% 0 round 24px)' }, { opacity: 1, clipPath: 'inset(0 0 0% 0 round 0px)' }],
  flip: [{ opacity: 0, transform: 'perspective(1400px) rotateY(-22deg) translateX(-40px)' }, { opacity: 1, transform: 'perspective(1400px) rotateY(0) translateX(0)' }],
  zoom: [{ opacity: 0, transform: 'scale(1.08)' }, { opacity: 1, transform: 'scale(1)' }],
  rise: [{ opacity: 0, transform: 'translateY(80px)' }, { opacity: 1, transform: 'translateY(0)' }],
  blur: [{ opacity: 0, filter: 'blur(18px)', transform: 'translateY(20px) scale(.98)' }, { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' }],
  circle: [{ clipPath: 'circle(0% at 50% 35%)' }, { clipPath: 'circle(150% at 50% 35%)' }],
};
const T_DUR = { slideL: 700, slideR: 700, wipe: 850, flip: 800, zoom: 700, rise: 750, blur: 750, circle: 1000 };
async function pageExit(t) {
  try {
    const an = app.animate(T_EXIT[t], { duration: 260, easing: 'ease-in', fill: 'forwards' });
    await Promise.race([an.finished, wait(320)]);
  } catch (e) { /* browser lama: tanpa animasi */ }
}
function pageEnter(t) {
  try {
    $$('.rail, .side, .sheet > *, .hero-text > *, .hero-art, .start-card, .mat-card, .cat-card').forEach(e => (e.style.animation = 'none'));
    app.getAnimations().forEach(a => a.cancel());
    const an = app.animate(T_ENTER[t], { duration: T_DUR[t], easing: EASE });
    /* Cadangan: bila timeline tertahan (tab tersembunyi/iframe), lepas animasinya agar konten tetap terlihat */
    later(() => an.cancel(), T_DUR[t] + 300);
  } catch (e) { app.getAnimations && app.getAnimations().forEach(a => a.cancel()); }
}
async function route() {
  const token = ++routeToken;
  cleanups.forEach(fn => fn()); cleanups = [];
  closeMenu();
  const [page = '', arg] = location.hash.replace(/^#\/?/, '').split('/');
  const isScene = page === 'scene' && SCENES[arg];
  const curtain = $('#curtain');
  const key = isScene ? arg : (PAGES[page] ? page : '');
  const tr = firstRoute || reduced ? null : pickTransition(lastKey, key);
  if (tr === 'curtain') {
    $('.cur-code', curtain).textContent = arg;
    $('.cur-title', curtain).textContent = SCENES[arg].title;
    curtain.className = 'curtain cover';
    await wait(420); if (token !== routeToken) return;
  } else if (tr) {
    await pageExit(tr); if (token !== routeToken) return;
  }
  lastKey = key;
  if (app.getAnimations) app.getAnimations().forEach(a => a.cancel());
  firstRoute = false;
  let navKey = '';
  if (isScene) {
    state.last = arg; save();
    app.innerHTML = viewScene(arg);
    mountScene(arg);
    navKey = arg === 'S12' ? 'evaluasi' : 'materi';
    document.title = `${arg} · ${SCENES[arg].title} — Smart Emailing`;
  } else {
    const p = PAGES[page] || PAGES[''];
    app.innerHTML = p.v(); p.m && p.m();
    navKey = p.nav || '';
    document.title = p.title ? `${p.title} — Smart Emailing` : 'Smart Emailing — Pelatihan Menulis Email Profesional';
  }
  if (!isScene && !page) navKey = 'home';
  $$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === navKey));
  requestAnimationFrame(() => moveInd(activeTab()));
  setTimeout(() => { if (!indPos) moveInd(activeTab(), true); }, 120);
  /* Rute belajar: geser otomatis supaya scene sekarang berada di tengah */
  const trk = $('.rail-track'), curStop = trk && $('.stop.cur', trk);
  if (curStop) trk.scrollLeft = curStop.closest('.rail-grp').offsetLeft + curStop.offsetLeft - trk.clientWidth / 2 + curStop.offsetWidth / 2;
  $('#readLine').style.width = '0%';
  document.body.classList.toggle('is-home', !isScene && !page);
  window.scrollTo({ top: 0, behavior: 'instant' });
  app.focus({ preventScroll: true });
  updateBar();
  /* Cadangan agar konten tetap tampil walau animasi tertahan */
  document.body.classList.remove('settled'); later(() => document.body.classList.add('settled'), 1400);
  if (tr && tr !== 'curtain') pageEnter(tr);
  if (curtain.classList.contains('cover')) { curtain.className = 'curtain cover leave'; setTimeout(() => { if (token === routeToken) curtain.className = 'curtain'; }, 600); }
}

function updateBar() {
  const p = pct(), C = 2 * Math.PI * 16;
  const ring = $('#progRing'); ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C * (1 - p / 100);
  $('#progText').textContent = p + '%';
  const sb = $('#soundBtn');
  sb.innerHTML = icon(state.sound ? 'vol' : 'mute');
  sb.setAttribute('aria-label', state.sound ? 'Matikan efek suara' : 'Nyalakan efek suara'); sb.title = sb.getAttribute('aria-label');
  /* Badge ala notifikasi email */
  const belum = LATIHAN.length - Object.keys((state.lat && state.lat.res) || {}).length;
  const bl = $('#badgeLat'); bl.textContent = belum > 0 ? belum : ''; bl.classList.toggle('on', belum > 0); bl.title = belum > 0 ? `${belum} soal latihan belum dikerjakan` : '';
  const be = $('#badgeEv'); be.className = 'tbadge ' + (evalPassed() ? 'on ok' : !materiDone() ? 'on lock' : '');
  be.innerHTML = evalPassed() ? icon('check') : !materiDone() ? icon('lock') : '';
  be.title = evalPassed() ? 'Evaluasi sudah lulus' : !materiDone() ? 'Terbuka setelah semua materi selesai' : '';
  if (!$('#progPop').hidden) renderPop();
}
function renderPop() {
  const latOk = state.lat ? Object.values(state.lat.res || {}).filter(Boolean).length : 0;
  const ev = state.ev && state.ev.done ? state.ev.score : null;
  $('#progPop').innerHTML = `<div class="pp-h"><b>Progres kamu</b><small>${doneCount()} dari 13 scene selesai</small></div>
    ${MATERI.map(m => { const d = m.scenes.filter(id => state.done[id]).length; return `<div class="pp-row"><span>${m.short}</span><span class="bar"><i style="width:${d / m.scenes.length * 100}%"></i></span><b>${d}/${m.scenes.length}</b></div>`; }).join('')}
    <div class="pp-sub"><span>${icon('pen')} Latihan</span><b>${latOk}/${LATIHAN.length} benar</b></div>
    <div class="pp-sub"><span>${icon('flag')} Evaluasi</span><b>${ev !== null ? 'Nilai ' + ev : materiDone() ? 'Siap dikerjakan' : 'Terkunci'}</b></div>
    <a class="btn btn-primary btn-sm" href="${doneCount() ? resumeHref() : '#/scene/S01'}">${doneCount() ? 'Lanjutkan belajar' : 'Mulai belajar'} ${icon('right')}</a>`;
}
function togglePop(force) {
  const pop = $('#progPop'), open = force !== undefined ? force : pop.hidden;
  if (open) renderPop();
  pop.hidden = !open; $('#progBtn').setAttribute('aria-expanded', String(open));
}
/* Penanda tab yang meluncur mengikuti kursor */
/* Penanda tab berbentuk manik: saat pindah, ujung depannya melesat duluan lalu ujung belakang menyusul,
   jadi manik terlihat memanjang mengikuti arah perjalanan */
let indPos = null;
function moveInd(el, instant) {
  const ind = $('#tabInd'), tabs = $('#navLinks');
  if (!el || getComputedStyle(ind).display === 'none') { ind.style.opacity = 0; indPos = null; return; }
  const r = el.getBoundingClientRect(), t = tabs.getBoundingClientRect();
  const to = { x: r.left - t.left, w: r.width }, from = indPos;
  indPos = to;
  ind.style.opacity = 1; ind.style.width = to.w + 'px'; ind.style.transform = `translateX(${to.x}px)`;
  if (!from || instant || reduced || (Math.abs(from.x - to.x) < 1 && Math.abs(from.w - to.w) < 1)) return;
  const kanan = to.x > from.x;
  const mid = kanan
    ? { x: from.x + (to.x - from.x) * .2, r: to.x + to.w * .9 }
    : { x: to.x + to.w * .1, r: from.x + from.w - (from.x + from.w - to.x - to.w) * .2 };
  ind.getAnimations().forEach(a => a.cancel());
  try {
    ind.animate([
      { transform: `translateX(${from.x}px) scaleY(1)`, width: from.w + 'px' },
      { transform: `translateX(${mid.x}px) scaleY(.84)`, width: (mid.r - mid.x) + 'px', offset: .42 },
      { transform: `translateX(${to.x + (kanan ? 3 : -3)}px) scaleY(1.04)`, width: to.w + 'px', offset: .78 },
      { transform: `translateX(${to.x}px) scaleY(1)`, width: to.w + 'px' },
    ], { duration: 560, easing: 'cubic-bezier(.45, 0, .2, 1)' });
    /* Cadangan: bila tab sedang tidak digambar, animasi dihentikan supaya manik tidak tertinggal */
    const anim = ind.getAnimations().pop(); setTimeout(() => { if (anim && anim.playState === 'running') anim.cancel(); }, 800);
  } catch (e) { /* tanpa animasi */ }
}
const activeTab = () => $('#navLinks a.active');
function closeMenu() { togglePop(false); }

/* ---------- Mulai ---------- */
$('#brandMark').innerHTML = LOGO;
$$('.t-ic').forEach(e => { e.innerHTML = icon(e.dataset.ic); });
/* Klik tab: manik langsung berangkat tanpa menunggu transisi halaman; panah ← → berpindah tab */
$$('#navLinks a').forEach(a => a.addEventListener('click', () => { $$('#navLinks a').forEach(x => x.classList.toggle('active', x === a)); moveInd(a); }));
$('#navLinks').addEventListener('keydown', e => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const links = $$('#navLinks a'), cur = links.indexOf(document.activeElement); if (cur < 0) return;
  e.preventDefault();
  const nx = links[(cur + (e.key === 'ArrowRight' ? 1 : -1) + links.length) % links.length];
  nx.focus(); nx.click();
});
/* Mode terang / gelap */
function paintThemeBtns() {
  const dark = document.documentElement.dataset.theme === 'dark';
  $$('[data-theme-toggle]').forEach(b => { b.innerHTML = `<span class="tb-ic tb-sun">${icon('sun')}</span><span class="tb-ic tb-moon">${icon('moon')}</span>`; b.setAttribute('aria-label', dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'); b.title = b.getAttribute('aria-label'); b.setAttribute('aria-pressed', String(dark)); });
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = dark ? '#150a0d' : '#3b1119';
}
function setTheme(next, btn) {
  const apply = () => { document.documentElement.dataset.theme = next; try { localStorage.setItem('smart-emailing:theme', next); } catch (e) { /* mode privat */ } paintThemeBtns(); };
  const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  if (reduced || !document.startViewTransition) { document.documentElement.classList.add('theme-fade'); apply(); setTimeout(() => document.documentElement.classList.remove('theme-fade'), 450); return; }
  const vt = document.startViewTransition(apply);
  vt.ready.then(() => document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] }, { duration: 650, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
}
paintThemeBtns();
$$('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => { sfx(); setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', b); }));
$('#progBtn').onclick = e => { e.stopPropagation(); togglePop(); };
document.addEventListener('click', e => { if (!$('#progPop').hidden && !e.target.closest('#progPop')) togglePop(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') togglePop(false); });
window.addEventListener('resize', () => moveInd(activeTab(), true));
$('.curtain-in').insertAdjacentHTML('afterbegin', `<span class="cur-logo">${LOGO}</span>`);
$('#soundBtn').onclick = () => { state.sound = !state.sound; save(); updateBar(); sfx(); toast(state.sound ? 'Efek suara aktif.' : 'Efek suara dimatikan.'); };
/* Semua ikon bisa diklik: memantul + bunyi klik (ubin dekoratif juga) */
const ICON_TILE = '.sc-ic, .mat-ic, .bc-ic, .rail-ic, .act-num, .ip-ic, .how-ic, .mv-av, .env-ic, .ib-ic, .mcol-ic, .lico-c, .avatar, .pin, .tag, .brand-mark, .sc-av, .iav, .hs-num, .bk, .opt-l, .o-n, .lockbox > .ic, .thanks > .ic, .ig h4 .ic, .goal-box .ic, .narasi-h .ic, .act-tag .ic, .box-h, .tt-f .ic';
document.addEventListener('pointerdown', e => {
  const tile = e.target.closest(ICON_TILE), ic = e.target.closest('.ic') || (tile && tile.querySelector('.ic'));
  const target = tile || ic; if (!target || reduced) return;
  try { target.animate([{ transform: 'scale(1)' }, { transform: 'scale(.82) rotate(-6deg)' }, { transform: 'scale(1.12) rotate(4deg)' }, { transform: 'scale(1)' }], { duration: 480, easing: 'cubic-bezier(.3, 1.4, .5, 1)' }); } catch (err) { /* tanpa animasi */ }
  if (tile && !e.target.closest('a, button, label, input, select, textarea')) sfx();
}, { passive: true });
/* Ikon tanpa tautan tetap punya tujuan: halaman (#/...) atau bagian di halaman yang sama */
const jumpTo = t => { if (t.startsWith('#')) { location.hash = t; return; } const d = document.getElementById(t); if (d) d.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); };
const markTo = () => $$('[data-to]:not([tabindex])').forEach(e => { e.tabIndex = 0; e.setAttribute('role', 'link'); });
document.addEventListener('click', e => { const t = e.target.closest('[data-to]'); if (t && !e.target.closest('a, button')) jumpTo(t.dataset.to); });
document.addEventListener('keydown', e => { const t = e.target.closest && e.target.closest('[data-to]'); if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); jumpTo(t.dataset.to); } });
new MutationObserver(markTo).observe(document.body, { childList: true, subtree: true });
window.addEventListener('hashchange', route);
window.addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - innerHeight; $('#nav').classList.toggle('scrolled', scrollY > 8); $('#readLine').style.width = (max > 0 ? scrollY / max * 100 : 0) + '%'; }, { passive: true });
route();

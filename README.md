# Manajemen Tugas Kuliah (Frontend)

Tugas 6 — Bab 6 React Dasar. Aplikasi React untuk mencatat, memantau, dan
menyelesaikan tugas kuliah. Entitas utama: **Tugas**.

## Menjalankan

```bash
npm install
npm run dev
```

Buka <http://localhost:5173>.

## Struktur

```
src/
├── App.jsx                      # state daftar tugas (array) + handler
├── main.jsx
├── index.css
├── data/
│   └── tugasAwal.js             # data awal tugas
└── components/
    ├── Header.jsx               # judul aplikasi + tanggal hari ini
    ├── RingkasanTugas.jsx       # ringkasan jumlah data + progres
    ├── FormTambahTugas.jsx      # form controlled + tombol "Tambah"
    ├── DaftarTugas.jsx          # render .map() daftar + empty state
    └── KartuTugas.jsx           # kartu untuk tiap item tugas
```

Atribut entitas Tugas: `id`, `judul`, `mataKuliah`, `deadline`, `prioritas`
(`Tinggi` / `Sedang` / `Rendah`), `selesai`.

## Fitur

- Daftar tugas disimpan sebagai state array di `App.jsx`, ditampilkan dengan
  `.map()` dan `key={tugas.id}`.
- Form controlled dengan validasi sederhana dan tombol **Tambah**.
- Conditional rendering: muncul teks **"Belum ada data Tugas"** saat daftar kosong.
- Tandai selesai / batalkan, serta hapus tugas. Ringkasan dan progres ikut berubah.

## Rencana commit

```bash
git init
git add .
git commit -m "Setup project React dengan Vite"
git remote add origin <URL_REPO_GITHUB>
git branch -M main
git push -u origin main

# setelah fitur dirapikan / ditambah
git add .
git commit -m "Tambah component KartuTugas, state, dan form input"
git push
```

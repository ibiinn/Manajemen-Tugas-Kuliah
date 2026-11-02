# Manajemen Tugas Kuliah (Frontend)

Tugas 6 — Bab 6 React Dasar. Aplikasi React untuk mencatat, memantau, dan
menyelesaikan tugas kuliah. Entitas utama: **Tugas**.

## Menjalankan

```bash
npm install
npm run dev
```

Buka <http://localhost:5173>.

Atribut entitas Tugas: `id`, `judul`, `mataKuliah`, `deadline`, `prioritas`
(`Tinggi` / `Sedang` / `Rendah`), `selesai`.

## Fitur

- Daftar tugas disimpan sebagai state array di `App.jsx`, ditampilkan dengan
  `.map()` dan `key={tugas.id}`.
- Form controlled dengan validasi sederhana dan tombol **Tambah**.
- Conditional rendering: muncul teks **"Belum ada data Tugas"** saat daftar kosong.
- Tandai selesai / batalkan, serta hapus tugas. Ringkasan dan progres ikut berubah.# Manajemen-Tugas-Kuliah

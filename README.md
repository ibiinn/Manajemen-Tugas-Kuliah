# Student API

**Nama proyek:** Student API

**Deskripsi:** REST API sederhana untuk mengelola data mahasiswa (student).
Aplikasi ini dibuat dengan Express.js dan menyimpan data secara permanen di
PostgreSQL melalui Prisma ORM. Endpoint yang tersedia meliputi CRUD data
student, filter berdasarkan jurusan/angkatan/kata kunci, dan statistik jumlah
student per jurusan serta per angkatan.

Project ini adalah lanjutan dari REST API pada tugas sebelumnya. Penyimpanan
data yang tadinya memakai MySQL dengan query SQL manual sekarang dipindah ke
Prisma Client, tanpa mengubah kode controller yang sudah ada.

## Instruksi tugas

1. **Server PostgreSQL lokal dan database**

   PostgreSQL 16 dijalankan lewat Docker dengan nama container
   `tpwb-postgres` dan database `db_student`. Container memakai port host 5433
   supaya tidak bentrok dengan PostgreSQL lain di port 5432.

   ```bash
   docker run -d --name tpwb-postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=db_student \
     -p 5433:5432 postgres:16-alpine
   ```

2. **Model Prisma sesuai entitas utama**

   Entitas utama aplikasi ini adalah student, jadi modelnya ada di
   `prisma/schema.prisma` dengan nama `Student`.

3. **Migrasi awal**

   Migrasi dijalankan dengan `npx prisma migrate dev --name init`. File
   migrasinya ada di `prisma/migrations/20261125104949_init/migration.sql` dan
   tabel `students` sudah terbentuk di database.

4. **PrismaService sebagai provider**

   `src/config/prisma.js` berisi class `PrismaService` yang mewarisi
   `PrismaClient`. Service API memakai instance tersebut untuk semua operasi
   database, sedangkan controller tetap memanggil fungsi service dengan nama
   yang sama seperti sebelumnya.

5. **CRUD dengan Prisma Client dan data permanen**

   Create, read, update, dan delete sudah memakai Prisma Client. Data tetap ada
   setelah server dimatikan dan dinyalakan lagi (bukti ada di bagian
   [Data tersimpan permanen](#data-tersimpan-permanen)).

6. **Query lanjutan (nilai tambah)**

   Ada endpoint `GET /api/students/stats` yang memakai `count` dan `groupBy`,
   serta filter `where` pada `GET /api/students?jurusan=...&angkatan=...&search=...`.

## Teknologi

- Node.js dan Express 4
- PostgreSQL 16 (Docker)
- Prisma 6
- Postman dan Newman untuk pengujian

## Struktur folder

```
tpwb/
├── .env.example
├── package.json
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
│       └── 20261125104949_init/migration.sql
├── postman/
│   └── Student-API.postman_collection.json
├── docs/
│   ├── hasil-newman.txt
│   └── screenshots/
└── src/
    ├── app.js
    ├── config/prisma.js
    └── modules/student/
        ├── student.routes.js
        ├── student.controller.js
        └── student.service.js
```

## Model Prisma

Isi `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Student {
  id        Int      @id @default(autoincrement())
  nim       String   @unique @db.VarChar(15)
  nama      String   @db.VarChar(100)
  jurusan   String   @db.VarChar(50)
  angkatan  Int
  email     String   @db.VarChar(100)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("students")
}
```

Nama tabel di database tetap `students` dan kolom tanggal tetap `created_at`
karena memakai `@@map` dan `@map`. Field `nim` diberi `@unique` supaya NIM ganda
ditolak oleh database.

## PrismaService

```js
class PrismaService extends PrismaClient {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async testConnection() {
    await this.$queryRaw`SELECT 1`;
    console.log('Terhubung ke database PostgreSQL melalui Prisma');
  }
}
```

Class ini hanya dibuat satu instance di `src/config/prisma.js`, jadi koneksi
tidak dibuka ulang di setiap request. `src/app.js` memanggil `onModuleInit()`
saat server menyala dan `onModuleDestroy()` saat menerima SIGINT/SIGTERM.

Controller tidak diubah. Dua handler lama tetap memanggil fungsi service yang
sama dan mengembalikan bentuk JSON yang sama, termasuk field `created_at`.
Service yang menyesuaikan nama field dari Prisma:

```js
function toStudentResponse(student) {
  const { createdAt, ...rest } = student;
  return { ...rest, created_at: createdAt };
}
```

## Cara menjalankan

1. Jalankan PostgreSQL seperti perintah Docker pada poin 1 di atas.

2. Salin `.env.example` menjadi `.env`, lalu sesuaikan kalau perlu.

   ```env
   PORT=3000
   DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/db_student?schema=public"
   ```

3. Install dependency, jalankan migrasi, isi data awal, lalu nyalakan server.

   ```bash
   npm install
   npx prisma migrate dev
   npm run db:seed
   npm start
   ```

4. Server berjalan di `http://localhost:3000`. Kalau koneksi database berhasil,
   log-nya seperti ini:

   ```
   Server berjalan di http://localhost:3000
   Terhubung ke database PostgreSQL melalui Prisma
   ```

Script lain di `package.json`:

- `npm run dev` untuk jalan dengan auto-reload
- `npm run db:migrate` untuk membuat migrasi baru
- `npm run db:deploy` untuk menerapkan migrasi yang sudah ada
- `npm run db:seed` untuk mengisi ulang data awal
- `npm run db:studio` untuk membuka Prisma Studio

Cek isi tabel lewat psql:

```bash
docker exec -it tpwb-postgres psql -U postgres -d db_student \
  -c "SELECT id, nim, nama, jurusan, angkatan FROM students ORDER BY id;"
```

## Endpoint

| Method | URL | Keterangan |
| --- | --- | --- |
| GET | `/api/students` | Ambil semua data, bisa pakai `?jurusan=`, `?angkatan=`, `?search=` |
| GET | `/api/students/stats` | Total data dan rekap per jurusan/angkatan |
| GET | `/api/students/:id` | Ambil satu data |
| POST | `/api/students` | Tambah data |
| PUT | `/api/students/:id` | Ubah data |
| DELETE | `/api/students/:id` | Hapus data |

Contoh `GET /api/students`:

```json
{
  "success": true,
  "message": "Berhasil mengambil data student",
  "total": 5,
  "data": [
    {
      "id": 1,
      "nim": "103022300001",
      "nama": "Ahmad Fauzi",
      "jurusan": "Informatika",
      "angkatan": 2023,
      "email": "ahmad.fauzi@student.telkomuniversity.ac.id",
      "created_at": "2026-11-25T10:49:52.294Z"
    }
  ]
}
```

Contoh body `POST /api/students`:

```json
{
  "nim": "103022300006",
  "nama": "Rina Maharani",
  "jurusan": "Sistem Informasi",
  "angkatan": 2024,
  "email": "rina.maharani@student.telkomuniversity.ac.id"
}
```

Response berhasil berisi status 201 dan data yang baru disimpan. Kalau NIM sudah
dipakai, statusnya 409. Kalau ada field yang kosong atau tidak valid, statusnya
400 dengan daftar error.

Status code yang dipakai:

- 200 untuk baca, ubah, dan hapus yang berhasil
- 201 untuk tambah data
- 400 untuk body yang tidak lengkap atau tidak valid
- 404 kalau id tidak ditemukan
- 409 kalau NIM sudah terdaftar
- 500 kalau terjadi error di server atau database

## Filter dan statistik

Filter `jurusan` dan `search` memakai `contains` dengan `mode: 'insensitive'`,
sedangkan `angkatan` dicocokkan persis. Contoh query yang dibentuk service:

```js
where: {
  jurusan: { contains: 'informatika', mode: 'insensitive' },
  angkatan: 2023,
}
```

Endpoint statistik memakai `count` dan dua `groupBy`, lalu hasilnya dirapikan
menjadi `total`, `perJurusan`, dan `perAngkatan`:

```json
{
  "success": true,
  "message": "Berhasil mengambil statistik student",
  "data": {
    "total": 5,
    "perJurusan": [
      { "jurusan": "Informatika", "jumlah": 2 }
    ],
    "perAngkatan": [
      { "angkatan": 2023, "jumlah": 3 }
    ]
  }
}
```

## Data tersimpan permanen

Uji yang dilakukan:

1. Tambah satu data baru lewat `POST /api/students`, response 201 dengan id 10.
2. Matikan server, lalu jalankan `npm start` lagi.
3. `GET /api/students/10` masih mengembalikan data yang sama dengan status 200.
4. Hapus data uji lewat `DELETE /api/students/10` supaya database kembali berisi
   5 data seed.

Karena data masih ada setelah restart, berarti penyimpanan sudah memakai
PostgreSQL, bukan array di memori.

## Hasil pengujian

Collection Postman berisi 13 request dengan assertion, dijalankan lewat Newman:

```bash
npx newman run postman/Student-API.postman_collection.json
```

Hasilnya 13 request, 25 assertion, dan 0 gagal. Output lengkap ada di
[`docs/hasil-newman.txt`](docs/hasil-newman.txt).

## Screenshot

Semua gambar disimpan di folder `docs/screenshots/` dengan nama file di bawah
ini. Pengujian endpoint dilakukan lewat halaman uji lokal yang memanggil server
langsung, bukan lewat tampilan Postman.

### Tahapan pengerjaan

**1. PostgreSQL berjalan**

![Container PostgreSQL aktif](docs/screenshots/01-postgres-berjalan.png)

**2. Migrasi Prisma**

![Output migrasi Prisma](docs/screenshots/02-migrasi-prisma.png)

**3. Tabel students**

![Isi tabel students](docs/screenshots/03-tabel-students.png)

**4. GET semua data**

![GET semua student](docs/screenshots/04-uji-get-all.png)

**5. POST data baru**

![POST student](docs/screenshots/05-uji-create.png)

**6. PUT data**

![PUT student](docs/screenshots/06-uji-update.png)

**7. DELETE data**

![DELETE student](docs/screenshots/07-uji-delete.png)

**8. Statistik**

![Statistik student](docs/screenshots/08-uji-stats.png)

### Tampilan desktop dan mobile

**Desktop**

![Tampilan desktop](docs/screenshots/09-tampilan-desktop.png)

**Mobile**

![Tampilan mobile](docs/screenshots/10-tampilan-mobile.png)

## Catatan kalau ada error

- `P1001: Can't reach database server`: container belum jalan, coba
  `docker start tpwb-postgres` dan cek port di `DATABASE_URL`.
- `P1000: Authentication failed`: user atau password di `DATABASE_URL` salah.
- `EADDRINUSE :3000`: port 3000 dipakai proses lain, ubah `PORT` di `.env`.
- `P3005: database schema is not empty`: database sudah berisi tabel lama,
  jalankan `npx prisma migrate reset` (data akan dihapus).
- `@prisma/client did not initialize`: jalankan `npx prisma generate`.
- Data kosong atau `total: 0`: seed belum dijalankan, jalankan
  `npm run db:seed`.

## Perubahan dari tugas sebelumnya

- `mysql2` dan `pool` diganti `@prisma/client` dan `PrismaService`.
- Query SQL manual diganti Prisma Client (`findMany`, `findUnique`, `create`,
  `update`, `delete`).
- Tabel yang tadinya dibuat lewat `sql/schema.sql` sekarang dibuat lewat
  migrasi Prisma.
- Yang tadinya baru ada GET, sekarang CRUD lengkap ditambah filter dan
  statistik.
- Seed yang tadinya memakai `INSERT` sekarang memakai `upsert` di
  `prisma/seed.js`.

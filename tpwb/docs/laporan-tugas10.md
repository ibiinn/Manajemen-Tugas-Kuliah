# Tugas 10 - Implementasi REST API + PostgreSQL + ORM (Prisma)

| | |
| --- | --- |
| Nama | [Nama Kamu] |
| NIM | [NIM] |
| Kelas | [Kelas] |
| Mata Kuliah | [Nama Mata Kuliah] |
| Link Repository | [URL repo GitHub] |

## 1. Deskripsi proyek

Student API adalah REST API sederhana untuk mengelola data mahasiswa.
Aplikasi dibuat dengan Express.js dan menyimpan data secara permanen di
PostgreSQL menggunakan Prisma ORM. Fitur yang tersedia meliputi CRUD data
student, filter berdasarkan jurusan/angkatan/kata kunci, serta statistik jumlah
student per jurusan dan per angkatan.

Proyek ini merupakan lanjutan dari REST API tugas sebelumnya. Penyimpanan yang
tadinya memakai MySQL dan query SQL manual dipindahkan ke Prisma Client.
Controller tetap menjadi lapisan HTTP (validasi input, status code, dan bentuk
response) dan tidak mengimpor `PrismaClient` secara langsung; seluruh query
database ada di service.

## 2. Teknologi

- Node.js dan Express 4
- PostgreSQL 16 (Docker, port 5433)
- Prisma 6
- Postman dan Newman

## 3. Struktur folder

```
tpwb/
├── .env.example
├── package.json
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/20261125104949_init/migration.sql
├── postman/
│   └── Student-API.postman_collection.json
├── docs/
│   ├── hasil-newman.txt
│   ├── laporan-tugas10.md
│   └── screenshots/
└── src/
    ├── app.js
    ├── config/prisma.js
    └── modules/student/
        ├── student.controller.js
        ├── student.routes.js
        └── student.service.js
```

## 4. Langkah pengerjaan

1. Menjalankan PostgreSQL 16 lewat Docker dengan nama container
   `tpwb-postgres` dan database `db_student`.
2. Membuat model `Student` pada `prisma/schema.prisma`.
3. Menjalankan `npx prisma migrate dev --name init` sehingga tabel `students`
   terbentuk di database.
4. Membuat `PrismaService` di `src/config/prisma.js` sebagai provider koneksi,
   lalu memakainya di `student.service.js`.
5. Menguji CRUD dan memastikan data tetap ada setelah server di-restart.

Perintah menjalankan PostgreSQL:

```bash
docker run -d --name tpwb-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=db_student \
  -p 5433:5432 postgres:16-alpine
```

Kalau container sudah pernah dibuat, cukup `docker start tpwb-postgres`.

Konfigurasi database ada di `.env`, yang disalin dari `.env.example`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/db_student?schema=public"
```

Port host 5433 dipakai supaya tidak bentrok dengan PostgreSQL lain di port 5432.

Perintah instalasi, migrasi, seed, dan menjalankan server:

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm start
```

## 5. Model Prisma

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
ditolak oleh database. File migrasi hasil perintah di atas ada di
`prisma/migrations/20261125104949_init/migration.sql`.

## 6. PrismaService

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

`src/config/prisma.js` membuat satu instance `PrismaService` yang dipakai
bersama, jadi koneksi tidak dibuka ulang di setiap request. `src/app.js`
memanggil `onModuleInit()` saat server menyala, dan `onModuleDestroy()` saat
menerima SIGINT/SIGTERM (Ctrl+C).

Service yang menyesuaikan nama field dari Prisma supaya bentuk response tidak
berubah:

```js
function toStudentResponse(student) {
  if (!student) return null;

  const { createdAt, ...rest } = student;
  return { ...rest, created_at: createdAt };
}
```

Satu penyesuaian di controller adalah pengecekan kode error unik Prisma
(`P2002`) agar NIM duplikat dijawab dengan status 409.

## 7. Operasi CRUD dan query lanjutan

Contoh pengambilan data dengan filter:

```js
const students = await prisma.student.findMany({
  where: buildWhere(filters),
  orderBy: { id: 'asc' },
});
```

Contoh query lanjutan untuk statistik:

```js
const total = await prisma.student.count();
const perJurusan = await prisma.student.groupBy({
  by: ['jurusan'],
  _count: { _all: true },
});
const perAngkatan = await prisma.student.groupBy({
  by: ['angkatan'],
  _count: { _all: true },
});
```

Endpoint yang tersedia:

| Method | URL | Keterangan |
| --- | --- | --- |
| GET | `/api/students` | Ambil semua data, bisa pakai `?jurusan=`, `?angkatan=`, `?search=` |
| GET | `/api/students/stats` | Total data dan rekap per jurusan/angkatan |
| GET | `/api/students/:id` | Ambil satu data |
| POST | `/api/students` | Tambah data |
| PUT | `/api/students/:id` | Ubah data |
| DELETE | `/api/students/:id` | Hapus data |

Contoh body `POST /api/students`:

```json
{
  "nim": "103022300098",
  "nama": "Rina Maharani",
  "jurusan": "Sistem Informasi",
  "angkatan": 2024,
  "email": "rina.maharani@student.telkomuniversity.ac.id"
}
```

Response saat berhasil (201 Created):

```json
{
  "success": true,
  "message": "Berhasil menambahkan data student",
  "data": {
    "id": 10,
    "nim": "103022300098",
    "nama": "Rina Maharani",
    "jurusan": "Sistem Informasi",
    "angkatan": 2024,
    "email": "rina.maharani@student.telkomuniversity.ac.id",
    "created_at": "2026-11-25T10:55:12.120Z"
  }
}
```

Status code yang dipakai:

| Status | Kondisi |
| --- | --- |
| 200 | Baca, ubah, dan hapus berhasil |
| 201 | Data baru berhasil ditambahkan |
| 400 | Body tidak lengkap atau tidak valid |
| 404 | Id tidak ditemukan |
| 409 | NIM sudah terdaftar |
| 500 | Error di server atau database |

## 8. Bukti pengujian

Collection Postman dijalankan dengan Newman:

```bash
npx newman run postman/Student-API.postman_collection.json
```

Hasilnya 13 request, 25 assertion, dan 0 gagal. Output lengkap ada di
`docs/hasil-newman.txt`. Skenario yang diuji:

1. Health check `GET /` (200).
2. Ambil semua student (200).
3. Filter jurusan, angkatan, dan kata kunci (200).
4. Statistik student (200).
5. Detail student yang ada (200) dan yang tidak ada (404).
6. Tambah data (201), NIM duplikat (409), dan data tidak valid (400).
7. Ubah data (200).
8. Hapus data (200), lalu pastikan data sudah tidak ada (404).

Uji persistensi:

1. `POST /api/students` menghasilkan data baru dengan id 10 dan status 201.
2. Server dimatikan, lalu dijalankan ulang dengan `npm start`.
3. `GET /api/students/10` tetap mengembalikan data yang sama dengan status 200.
4. Data uji dihapus kembali agar database berisi 5 data seed.

Karena data masih ada setelah restart, penyimpanan sudah memakai PostgreSQL,
bukan array di memori.

## 9. Lampiran screenshot

### Tahapan pengerjaan

1. Container PostgreSQL berjalan.

![Container PostgreSQL berjalan](screenshots/01-postgres-berjalan.png)

2. Migrasi Prisma berhasil.

![Output migrasi Prisma](screenshots/02-migrasi-prisma.png)

3. Tabel `students` beserta isinya.

![Isi tabel students](screenshots/03-tabel-students.png)

4. `GET /api/students` (200).

![GET semua student](screenshots/04-uji-get-all.png)

5. `POST /api/students` (201).

![POST student](screenshots/05-uji-create.png)

6. `PUT /api/students/:id` (200).

![PUT student](screenshots/06-uji-update.png)

7. `DELETE /api/students/:id` (200).

![DELETE student](screenshots/07-uji-delete.png)

8. `GET /api/students/stats` (200).

![Statistik student](screenshots/08-uji-stats.png)

### Tampilan desktop dan mobile

9. Tampilan desktop.

![Tampilan desktop](screenshots/09-tampilan-desktop.png)

10. Tampilan mobile.

![Tampilan mobile](screenshots/10-tampilan-mobile.png)

Semua gambar ada di folder `docs/screenshots/`.

## 10. Kesimpulan

REST API Student berhasil dihubungkan ke PostgreSQL menggunakan Prisma ORM.
Seluruh operasi CRUD berjalan melalui Prisma Client dan data tetap tersimpan
setelah server di-restart. Controller tetap menjadi lapisan HTTP tanpa
mengimpor Prisma Client, karena seluruh query database dipindahkan ke service
dan `PrismaService`. Filter `where` dan statistik `count`/`groupBy` ditambahkan
sebagai fitur nilai tambah.

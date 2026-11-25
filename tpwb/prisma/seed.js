const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const students = [
  {
    nim: '103022300001',
    nama: 'Ahmad Fauzi',
    jurusan: 'Informatika',
    angkatan: 2023,
    email: 'ahmad.fauzi@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022300002',
    nama: 'Bunga Lestari',
    jurusan: 'Informatika',
    angkatan: 2023,
    email: 'bunga.lestari@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022300003',
    nama: 'Citra Ayu',
    jurusan: 'Sistem Informasi',
    angkatan: 2023,
    email: 'citra.ayu@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022300004',
    nama: 'Dimas Pratama',
    jurusan: 'Teknologi Informasi',
    angkatan: 2022,
    email: 'dimas.pratama@student.telkomuniversity.ac.id',
  },
  {
    nim: '103022300005',
    nama: 'Eka Saputra',
    jurusan: 'Rekayasa Perangkat Lunak',
    angkatan: 2022,
    email: 'eka.saputra@student.telkomuniversity.ac.id',
  },
];

async function main() {
  for (const student of students) {
    await prisma.student.upsert({
      where: { nim: student.nim },
      update: student,
      create: student,
    });
  }

  const total = await prisma.student.count();
  console.log(`Seed selesai. Total student di database: ${total}`);
}

main()
  .catch((error) => {
    console.error('Seed gagal:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

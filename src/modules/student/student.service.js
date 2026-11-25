const prisma = require('../../config/prisma');

// createdAt dari Prisma diubah jadi created_at supaya bentuk response tetap sama.
function toStudentResponse(student) {
  if (!student) return null;

  const { createdAt, ...rest } = student;
  return { ...rest, created_at: createdAt };
}

function buildWhere({ jurusan, angkatan, search } = {}) {
  const where = {};

  if (jurusan) {
    where.jurusan = { contains: jurusan, mode: 'insensitive' };
  }

  const angkatanNumber = Number(angkatan);
  if (angkatan !== undefined && angkatan !== '' && Number.isInteger(angkatanNumber)) {
    where.angkatan = angkatanNumber;
  }

  if (search) {
    where.OR = [
      { nama: { contains: search, mode: 'insensitive' } },
      { nim: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  return where;
}

async function getAllStudents(filters) {
  const students = await prisma.student.findMany({
    where: buildWhere(filters),
    orderBy: { id: 'asc' },
  });

  return students.map(toStudentResponse);
}

async function getStudentById(id) {
  const studentId = Number(id);
  if (!Number.isInteger(studentId)) return null;

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  return toStudentResponse(student);
}

async function createStudent(data) {
  const student = await prisma.student.create({
    data: {
      nim: data.nim,
      nama: data.nama,
      jurusan: data.jurusan,
      angkatan: Number(data.angkatan),
      email: data.email,
    },
  });

  return toStudentResponse(student);
}

async function updateStudent(id, data) {
  const studentId = Number(id);
  if (!Number.isInteger(studentId)) return null;

  const existing = await prisma.student.findUnique({ where: { id: studentId } });
  if (!existing) return null;

  const student = await prisma.student.update({
    where: { id: studentId },
    data: {
      ...(data.nim !== undefined && { nim: data.nim }),
      ...(data.nama !== undefined && { nama: data.nama }),
      ...(data.jurusan !== undefined && { jurusan: data.jurusan }),
      ...(data.angkatan !== undefined && { angkatan: Number(data.angkatan) }),
      ...(data.email !== undefined && { email: data.email }),
    },
  });

  return toStudentResponse(student);
}

async function deleteStudent(id) {
  const studentId = Number(id);
  if (!Number.isInteger(studentId)) return null;

  const existing = await prisma.student.findUnique({ where: { id: studentId } });
  if (!existing) return null;

  const student = await prisma.student.delete({ where: { id: studentId } });
  return toStudentResponse(student);
}

// Statistik jumlah student per jurusan dan angkatan.
async function getStudentStats() {
  const [total, perJurusan, perAngkatan] = await Promise.all([
    prisma.student.count(),
    prisma.student.groupBy({
      by: ['jurusan'],
      _count: { _all: true },
      orderBy: { jurusan: 'asc' },
    }),
    prisma.student.groupBy({
      by: ['angkatan'],
      _count: { _all: true },
      orderBy: { angkatan: 'desc' },
    }),
  ]);

  return {
    total,
    perJurusan: perJurusan.map((item) => ({
      jurusan: item.jurusan,
      jumlah: item._count._all,
    })),
    perAngkatan: perAngkatan.map((item) => ({
      angkatan: item.angkatan,
      jumlah: item._count._all,
    })),
  };
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
};

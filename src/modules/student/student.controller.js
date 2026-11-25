const studentService = require('./student.service');

const REQUIRED_FIELDS = ['nim', 'nama', 'jurusan', 'angkatan', 'email'];
const ALLOWED_FIELDS = REQUIRED_FIELDS;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function isValidAngkatan(value) {
  const angkatan = Number(value);
  return Number.isInteger(angkatan) && angkatan >= 1900 && angkatan <= 2100;
}

function isValidEmail(value) {
  return isNonEmptyString(value) && value.includes('@');
}

function validateCreatePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Body request harus berupa object JSON'];
  }

  const errors = [];
  const missing = REQUIRED_FIELDS.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ''
  );

  if (missing.length > 0) {
    errors.push(`Field wajib belum diisi: ${missing.join(', ')}`);
  }

  if (!missing.includes('nim') && !isNonEmptyString(body.nim)) {
    errors.push('nim harus berupa string yang tidak kosong');
  }

  if (!missing.includes('angkatan') && !isValidAngkatan(body.angkatan)) {
    errors.push('angkatan harus berupa angka tahun yang valid (contoh: 2023)');
  }

  if (!missing.includes('email') && !isValidEmail(body.email)) {
    errors.push('email tidak valid');
  }

  return errors;
}

function validateUpdatePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Body request harus berupa object JSON'];
  }

  const providedFields = ALLOWED_FIELDS.filter((field) => body[field] !== undefined);

  if (providedFields.length === 0) {
    return [`Tidak ada field yang diubah. Field yang tersedia: ${ALLOWED_FIELDS.join(', ')}`];
  }

  const errors = [];

  for (const field of ['nim', 'nama', 'jurusan', 'email']) {
    if (body[field] !== undefined && !isNonEmptyString(body[field])) {
      errors.push(`${field} harus berupa string yang tidak kosong`);
    }
  }

  if (body.email !== undefined && !isValidEmail(body.email)) {
    errors.push('email tidak valid');
  }

  if (body.angkatan !== undefined && !isValidAngkatan(body.angkatan)) {
    errors.push('angkatan harus berupa angka tahun yang valid (contoh: 2023)');
  }

  return errors;
}

function isUniqueConstraintError(error) {
  return error.code === 'P2002';
}

async function getStudents(req, res) {
  try {
    const students = await studentService.getAllStudents(req.query);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data student',
      total: students.length,
      data: students,
    });
  } catch (error) {
    console.error('[GET /api/students]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data student',
    });
  }
}

async function getStudentById(req, res) {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student dengan id ${id} tidak ditemukan`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail student',
      data: student,
    });
  } catch (error) {
    console.error('[GET /api/students/:id]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail student',
    });
  }
}

async function createStudent(req, res) {
  try {
    const errors = validateCreatePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Data student tidak valid',
        errors,
      });
    }

    const student = await studentService.createStudent(req.body);

    return res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan data student',
      data: student,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return res.status(409).json({
        success: false,
        message: `NIM ${req.body.nim} sudah terdaftar`,
      });
    }

    console.error('[POST /api/students]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan data student',
    });
  }
}

async function updateStudent(req, res) {
  try {
    const errors = validateUpdatePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Data student tidak valid',
        errors,
      });
    }

    const { id } = req.params;
    const student = await studentService.updateStudent(id, req.body);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student dengan id ${id} tidak ditemukan`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil memperbarui data student',
      data: student,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return res.status(409).json({
        success: false,
        message: `NIM ${req.body.nim} sudah terdaftar`,
      });
    }

    console.error('[PUT /api/students/:id]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui data student',
    });
  }
}

async function deleteStudent(req, res) {
  try {
    const { id } = req.params;
    const student = await studentService.deleteStudent(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student dengan id ${id} tidak ditemukan`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil menghapus data student',
      data: student,
    });
  } catch (error) {
    console.error('[DELETE /api/students/:id]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus data student',
    });
  }
}

async function getStudentStats(req, res) {
  try {
    const stats = await studentService.getStudentStats();

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil statistik student',
      data: stats,
    });
  } catch (error) {
    console.error('[GET /api/students/stats]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik student',
    });
  }
}

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
};

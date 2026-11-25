require('dotenv').config();

const express = require('express');
const cors = require('cors');

const studentRoutes = require('./modules/student/student.routes');
const prismaService = require('./config/prisma');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Student API berjalan. Coba GET /api/students',
    endpoints: [
      'GET /api/students',
      'GET /api/students/stats',
      'GET /api/students/:id',
      'POST /api/students',
      'PUT /api/students/:id',
      'DELETE /api/students/:id',
    ],
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

const server = app.listen(PORT, async () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  try {
    await prismaService.onModuleInit();
    await prismaService.testConnection();
  } catch (error) {
    console.error('Gagal terhubung ke database:', error.message);
  }
});

async function shutdown(signal) {
  console.log(`\n${signal} diterima, menutup server dan koneksi database...`);
  server.close(async () => {
    await prismaService.onModuleDestroy();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

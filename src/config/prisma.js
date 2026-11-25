const { PrismaClient } = require('@prisma/client');

// Satu instance Prisma Client dipakai bersama supaya koneksi tidak dibuka
// ulang di setiap request.
class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error'],
    });
  }

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

const globalForPrisma = globalThis;

const prismaService = globalForPrisma.__prismaService ?? new PrismaService();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prismaService = prismaService;
}

module.exports = prismaService;
module.exports.PrismaService = PrismaService;

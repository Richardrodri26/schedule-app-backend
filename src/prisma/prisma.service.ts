import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // 🔹 Conexión inicial a la base de datos
    await this.$connect();
    console.log('✅ Prisma conectado a la base de datos');
  }

  async onModuleDestroy() {
    // 🔹 Desconexión limpia cuando se apaga la app
    await this.$disconnect();
    console.log('❌ Prisma desconectado de la base de datos');
  }

  // 🔹 Método opcional para ejecutar transacciones manualmente
  async transaction<T>(callback: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(callback);
  }
}

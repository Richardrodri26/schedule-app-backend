import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 🔹 Hace que PrismaService esté disponible en toda la app sin tener que importarlo en cada módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 🔹 Exporta el servicio para que otros módulos puedan usarlo
})
export class PrismaModule {}

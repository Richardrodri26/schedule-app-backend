import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envs } from '@src/config/envs';
import { PrismaService } from '@src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 🧩 Registro de usuario (Admin o Teacher)
   */
  async register(data: { username: string; password: string; }) {
    const { username, password } = data;

    const existing = await this.prisma.user.findUnique({ where: { username } });
    if (existing) {
      throw new BadRequestException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = await this.signToken(user.id, user.username);
    return { user, token };
  }

  /**
   * 🔑 Login
   */
  async login(data: { username: string; password: string }) {
    const { username, password } = data;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const token = await this.signToken(user.id, user.username);
    return { user, token };
  }

  /**
   * 🔏 Generar JWT
   */
  async signToken(userId: string, username: string) {
    const payload = { sub: userId, userId, username };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: envs.jwtSecret,
    });

    return token;
  }

  /**
   * 🧠 Validar usuario por ID (usado por estrategias JWT)
   */
  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('Token inválido');
    return user;
  }
}

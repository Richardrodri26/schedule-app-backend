import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import tryCatch from '@src/common/functions/tryCatch';
import { PaginationDto } from '@src/common/dto/pagination.dto';
import { paginatePrisma } from '@src/common/functions/paginate-prisma';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const [error, user] = await tryCatch(this.prisma.user.create({
      data: createUserDto,
    }));

    if (error) {
      throw new InternalServerErrorException(`Error al crear el usuario: ${error.message}`);
    }

    return user;
  }

  async findAll(paginationDto: PaginationDto) {
    // Usamos paginatePrisma para encapsular count/find y transformación de resultados
    return paginatePrisma(
      paginationDto,
      () => this.prisma.user.count(),
      ({ skip, take }) => this.prisma.user.findMany({ skip, take }),
      ({ password, ...u }) => u,
    );
  }

  async findOne(id: string) {
    const [error, user] = await tryCatch(this.prisma.user.findUnique({
      where: { id },
    }));

    if (error) {
      throw new InternalServerErrorException('Error al buscar el usuario: ' + error.message);
    }

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    };

    const { password, ...userWithoutPassword } = user; // Excluir password

    return userWithoutPassword;

  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.findOne(id);

    const [error, updatedUser] = await tryCatch(this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    }));

    if (error) {
      throw new InternalServerErrorException('Error al actualizar el usuario: ' + error.message);
    }

    const { password, ...userWithoutPassword } = updatedUser!; // Excluir password

    return userWithoutPassword;

  }

  async remove(id: string) {
    this.findOne(id);

    const [error, deletedUser] = await tryCatch(this.prisma.user.delete({
      where: { id },
    }));

    if (error) {
      throw new InternalServerErrorException('Error al eliminar el usuario: ' + error.message);
    }

    const { password, ...userWithoutPassword } = deletedUser!; // Excluir password

    return userWithoutPassword;

  }
}

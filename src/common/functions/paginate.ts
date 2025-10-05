import { BadRequestException } from '@nestjs/common';

export type PaginateResult<T> = {
  data: T[];
  metadata: {
    page: number;
    total: number;
    lastPage: number;
  };
};

export interface PaginateOptions {
  page?: number;
  limit?: number;
}

/**
 * Helper genérico para paginación compatible con Prisma-style clients.
 *
 * - `countFn` debe devolver el total de elementos (number)
 * - `findFn` debe aceptar un objeto con skip & take y devolver los elementos
 */
export async function paginate<T = any>(
  options: PaginateOptions,
  countFn: () => Promise<number>,
  findFn: (args: { skip: number; take: number }) => Promise<T[]>,
): Promise<PaginateResult<T>> {
  const { page = 1, limit = 10 } = options || {};

  const total = await countFn();
  const lastPage = Math.max(1, Math.ceil(total / limit));

  if (page > lastPage) {
    throw new BadRequestException('Page number exceeds total pages available');
  }

  const data = await findFn({ skip: (page - 1) * limit, take: limit });

  return {
    data,
    metadata: {
      page,
      total,
      lastPage,
    },
  };
}

import { InternalServerErrorException } from '@nestjs/common';
import tryCatch from './tryCatch';
import { paginate, PaginateResult, PaginateOptions } from './paginate';

/**
 * Helper específico para Prisma: encapsula el count + find en un patrón seguro con tryCatch,
 * llama al helper genérico `paginate` y permite transformar cada elemento.
 *
 * - `countFn`: () => Promise<number>
 * - `findFn`: (args) => Promise<T[]>  (prisma.findMany signature)
 * - `transform`: (item) => U  (ej: eliminar password)
 */
export async function paginatePrisma<T = any, U = T>(
  options: PaginateOptions,
  countFn: () => Promise<number>,
  findFn: (args: { skip: number; take: number }) => Promise<T[]>,
  transform: (item: T) => U = (i => i as unknown as U),
): Promise<PaginateResult<U>> {
  const [countError, total] = await tryCatch(() => countFn());

  if (countError) {
    throw new InternalServerErrorException('Error al contar elementos: ' + countError.message);
  }

  return paginate(
    options,
    async () => total!,
    async ({ skip, take }) => {
      const [findError, items] = await tryCatch(() => findFn({ skip, take }));

      if (findError) {
        throw new InternalServerErrorException('Error al obtener elementos: ' + findError.message);
      }

      const safeItems = items || [];
      return safeItems.map(transform);
    },
  );
}

/**
 * Ejecuta una función (sincrónica o asíncrona) o una promesa y captura su resultado/errores
 * devolviendo una tupla [error, result].
 *
 * Uso:
 * const [err, res] = await tryCatch(() => doSomething());
 * const [err, res] = await tryCatch(promise);
 *
 * Contrato:
 * - input: una función que devuelve T o una Promise<T>, o directamente una Promise<T>
 * - output: Promise<[Error | null, T | undefined]>
 *
 * Maneja funciones síncronas que pueden lanzar y promesas que pueden rechazar.
 */

export type TryCatchResult<T> = [Error | null, T | undefined];

export async function tryCatch<T = any>(
  fnOrPromise: (() => T | Promise<T>) | Promise<T>,
): Promise<TryCatchResult<T>> {
  try {
    const result =
      typeof (fnOrPromise as any) === 'function'
        ? await (fnOrPromise as () => T | Promise<T>)()
        : await (fnOrPromise as Promise<T>);
    return [null, result];
  } catch (error: unknown) {
    if (error instanceof Error) return [error, undefined];
    // Normalizar a Error si viene otro tipo
    return [new Error(String(error)), undefined];
  }
}

export default tryCatch;

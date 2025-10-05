import tryCatch from './tryCatch';

describe('tryCatch utility', () => {
  it('should return result for an async function', async () => {
    const [err, res] = await tryCatch(async () => {
      return 42;
    });
    expect(err).toBeNull();
    expect(res).toBe(42);
  });

  it('should capture thrown error from sync function', async () => {
    const [err, res] = await tryCatch(() => {
      throw new Error('boom');
    });
    expect(err).toBeInstanceOf(Error);
    expect(err?.message).toBe('boom');
    expect(res).toBeUndefined();
  });

  it('should capture rejected promise', async () => {
    const p = Promise.reject(new Error('rejected'));
    const [err, res] = await tryCatch(p);
    expect(err).toBeInstanceOf(Error);
    expect(err?.message).toBe('rejected');
    expect(res).toBeUndefined();
  });
});

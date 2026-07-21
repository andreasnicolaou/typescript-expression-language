import { ArrayCache } from './array-cache';

describe('ArrayCache', () => {
  test('evicts the least recently used item at capacity', () => {
    const cache = new ArrayCache<string, number>(2);
    cache.set('first', 1);
    cache.set('second', 2);

    expect(cache.get('first')).toBe(1);

    cache.set('third', 3);

    expect(cache.get('first')).toBe(1);
    expect(cache.get('second')).toBeUndefined();
    expect(cache.get('third')).toBe(3);
    expect(cache.size).toBe(2);
  });

  test.each([0, -1, 1.5])('rejects an invalid maximum item count of %s', (maxItems) => {
    expect(() => new ArrayCache(maxItems)).toThrow('The maximum number of cache items must be a positive integer.');
  });

  test('supports undefined values', () => {
    const cache = new ArrayCache<string, undefined>(2);
    cache.set('key', undefined);
    cache.set('second', undefined);

    expect(cache.get('key')).toBeUndefined();
    cache.set('third', undefined);

    expect(cache.get('second')).toBeUndefined();
    expect(cache.size).toBe(2);
  });
});

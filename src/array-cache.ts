export class ArrayCache<K, V> {
  private readonly values = new Map<K, V>();

  public constructor(private readonly maxItems = 500) {
    if (!Number.isInteger(maxItems) || maxItems <= 0) {
      throw new RangeError('The maximum number of cache items must be a positive integer.');
    }
  }

  public get(key: K): V | undefined {
    if (!this.values.has(key)) {
      return undefined;
    }

    const value = this.values.get(key);
    this.values.delete(key);
    this.values.set(key, value as V);

    return value;
  }

  public set(key: K, value: V): void {
    this.values.delete(key);

    while (this.values.size >= this.maxItems) {
      const oldestKey = this.values.keys().next().value as K;
      this.values.delete(oldestKey);
    }

    this.values.set(key, value);
  }

  public get size(): number {
    return this.values.size;
  }
}

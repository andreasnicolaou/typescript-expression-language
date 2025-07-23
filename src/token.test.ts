import { Token } from './token';

describe('Token tests', () => {
  describe('toString', () => {
    test('should format with cursor, type, and value when cursor is present', () => {
      const token = new Token('name', 'foo', 7);
      expect(token.toString()).toBe('  7 NAME        foo');
    });
    test('should format with spaces for cursor when cursor is undefined', () => {
      const token = new Token('operator', '+');
      expect(token.toString()).toBe('    OPERATOR    +');
    });
    test('should pad type and cursor correctly for short values', () => {
      const token = new Token('number', 3, 1);
      expect(token.toString()).toBe('  1 NUMBER      3');
    });
    test('should handle null value', () => {
      const token = new Token('punctuation', null, 2);
      expect(token.toString()).toBe('  2 PUNCTUATION null');
    });
  });

  describe('test', () => {
    test('should return true for matching type and value', () => {
      const token = new Token('name', 'foo');
      expect(token.test('name', 'foo')).toBe(true);
    });
    test('should return true for matching type and null value (value not checked)', () => {
      const token = new Token('name', 'foo');
      expect(token.test('name')).toBe(true);
    });
    test('should return false for non-matching type', () => {
      const token = new Token('name', 'foo');
      expect(token.test('number', 'foo')).toBe(false);
    });
    test('should return false for non-matching value', () => {
      const token = new Token('name', 'foo');
      expect(token.test('name', 'bar')).toBe(false);
    });
    test('should handle null value in token', () => {
      const token = new Token('punctuation', null);
      expect(token.test('punctuation')).toBe(true);
      expect(token.test('punctuation', null)).toBe(true);
      expect(token.test('punctuation', '.')).toBe(false);
    });
    test('should handle number value', () => {
      const token = new Token('number', 42);
      expect(token.test('number', '42')).toBe(true);
      expect(token.test('number', '43')).toBe(false);
    });
  });
});

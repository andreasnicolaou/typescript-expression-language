import { SyntaxError } from './syntax-error';
import { Token } from './token';
import { TokenStream } from './token-stream';

describe('TokenStream tests', () => {
  test('should throw if constructed with no tokens', () => {
    expect(() => new TokenStream([], 'expr')).toThrow('TokenStream requires at least one token.');
  });

  test('should set current to first token', () => {
    const t = new Token('name', 'foo', 1);
    const ts = new TokenStream([t], 'foo');
    expect(ts.current).toBe(t);
    expect(ts.position).toBe(0);
  });

  test('toString should join tokens with newline', () => {
    const t1 = new Token('name', 'foo', 1);
    const t2 = new Token('number', 42, 2);
    const ts = new TokenStream([t1, t2], 'foo 42');
    expect(ts.toString()).toBe(`${t1.toString()}\n${t2.toString()}`);
  });

  test('next should advance and update current', () => {
    const t1 = new Token('name', 'foo', 1);
    const t2 = new Token('number', 42, 2);
    const ts = new TokenStream([t1, t2], 'foo 42');
    ts.next();
    expect(ts.current).toBe(t2);
    expect(ts.position).toBe(1);
  });

  test('next should throw SyntaxError at end', () => {
    const t1 = new Token('name', 'foo', 1);
    const ts = new TokenStream([t1], 'foo');
    expect(() => ts.next()).toThrow(SyntaxError);
  });

  test('expect should throw SyntaxError if type/value mismatch', () => {
    const t1 = new Token('name', 'foo', 1);
    const ts = new TokenStream([t1], 'foo');
    expect(() => ts.expect('number', 'bar')).toThrow(SyntaxError);
  });

  test('expect should advance if type/value match', () => {
    const t1 = new Token('name', 'foo', 1);
    const t2 = new Token('number', 42, 2);
    const ts = new TokenStream([t1, t2], 'foo 42');
    ts.expect('name', 'foo');
    expect(ts.current).toBe(t2);
    expect(ts.position).toBe(1);
  });

  test('isEOF should return true for EOF_TYPE', () => {
    const t = new Token(Token.EOF_TYPE, null, 3);
    const ts = new TokenStream([t], '');
    expect(ts.isEOF()).toBe(true);
  });

  test('getExpression should return original expression', () => {
    const t = new Token('name', 'foo', 1);
    const ts = new TokenStream([t], 'foo');
    expect(ts.getExpression()).toBe('foo');
  });

  test('expect should throw with custom message and value', () => {
    const t1 = new Token('name', 'foo', 1);
    const ts = new TokenStream([t1], 'foo');
    expect(() => ts.expect('number', 'bar', 'Custom error')).toThrow(/Custom error/);
  });

  test('expect should throw with type mismatch only', () => {
    const t1 = new Token('name', 'foo', 1);
    const ts = new TokenStream([t1], 'foo');
    expect(() => ts.expect('number')).toThrow(SyntaxError);
  });

  test('expect should throw with value but no message', () => {
    const t1 = new Token('name', 'foo', 1);
    const ts = new TokenStream([t1], 'foo');
    expect(() => ts.expect('name', 'bar')).toThrow(SyntaxError);
  });

  test('TokenStream sets default expression to empty string', () => {
    const t = new Token('name', 'foo', 1);
    const ts = new TokenStream([t]);
    expect(ts.expression).toBe('');
  });
});

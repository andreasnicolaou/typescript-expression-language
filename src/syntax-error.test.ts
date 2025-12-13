import { SyntaxError } from './syntax-error';

describe('SyntaxError', () => {
  test('should create SyntaxError with basic message', () => {
    const error = new SyntaxError('Test error', 10, 'foo + bar');
    expect(error.message).toContain('Test error');
    expect(error.message).toContain('around position 10');
    expect(error.message).toContain('foo + bar');
  });

  test('should create SyntaxError without cursor or expression', () => {
    const error = new SyntaxError('Test error');
    expect(error.message).toBe('Test error.');
  });

  test('should handle SyntaxError with subject and proposals', () => {
    const error = new SyntaxError('Unknown function', 5, 'fooo()', 'fooo', ['foo', 'bar', 'baz']);
    expect(error.message).toContain('Unknown function');
    expect(error.message).toContain('Did you mean "foo"?');
  });

  test('should handle SyntaxError with subject but no close proposals', () => {
    const error = new SyntaxError('Unknown function', 5, 'verydifferentstring()', 'verydifferentstring', [
      'foo',
      'bar',
      'baz',
    ]);
    expect(error.message).toContain('Unknown function');
    expect(error.message).not.toContain('Did you mean');
  });

  test('should handle SyntaxError with empty proposals array', () => {
    const error = new SyntaxError('Test error', 5, 'expression', 'subject', []);
    expect(error.message).toContain('Test error');
    expect(error.message).not.toContain('Did you mean');
  });

  test('should handle SyntaxError with null subject', () => {
    const error = new SyntaxError('Test error', 5, 'expression', null, ['foo', 'bar']);
    expect(error.message).toContain('Test error');
    expect(error.message).not.toContain('Did you mean');
  });

  test('should handle SyntaxError with null proposals', () => {
    const error = new SyntaxError('Test error', 5, 'expression', 'subject', null);
    expect(error.message).toContain('Test error');
    expect(error.message).not.toContain('Did you mean');
  });

  test('should choose closest proposal using levenshtein distance', () => {
    const error = new SyntaxError('Unknown function', 5, 'fooo()', 'fooo', ['foo', 'foobar', 'completely_different']);
    expect(error.message).toContain('Did you mean "foo"?');
  });
});

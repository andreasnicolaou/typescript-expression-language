import { Compiler } from './compiler';

describe('Compiler', () => {
  let compiler!: Compiler;

  beforeEach(() => {
    compiler = new Compiler({});
  });

  test('should retrieve the correct function', () => {
    const functions = {
      testFunction: (): string => 'test',
    };
    const fnCompiler = new Compiler(functions);
    expect(fnCompiler.getFunction('testFunction')).toBe(functions.testFunction);
  });

  test('should retrieve the current source code', () => {
    expect(compiler.getSource()).toBe('');
    compiler.raw('some code');
    expect(compiler.getSource()).toBe('some code');
  });

  test('should reset the current source', () => {
    compiler.raw('some code');
    expect(compiler.getSource()).toBe('some code');
    compiler.reset();
    expect(compiler.getSource()).toBe('');
  });

  test('raw should append a raw string to the source', () => {
    compiler.raw('code snippet');
    expect(compiler.getSource()).toBe('code snippet');
  });

  test('string should append a quoted string with escaped characters', () => {
    compiler.string('example "text"');
    expect(compiler.getSource()).toBe('"example \\"text\\""');
  });

  test('repr should handle various value types correctly', () => {
    compiler.repr(42);
    expect(compiler.getSource()).toBe('42');

    compiler.reset().repr(true);
    expect(compiler.getSource()).toBe('true');

    compiler.reset().repr(null);
    expect(compiler.getSource()).toBe('null');

    compiler.reset().repr('text');
    expect(compiler.getSource()).toBe('"text"');

    compiler.reset().repr([1, 2, 3]);
    expect(compiler.getSource()).toBe('[1, 2, 3]');

    compiler.reset().repr({ key: 'value' });
    expect(compiler.getSource()).toBe('{"key":"value"}');
  });

  test('repr should output raw value when isIdentifier is true', () => {
    compiler.repr('foo', true);
    expect(compiler.getSource()).toBe('foo');
    compiler.reset().repr('bar', true);
    expect(compiler.getSource()).toBe('bar');
    compiler.reset().repr(123, true);
    expect(compiler.getSource()).toBe('123');
  });
});

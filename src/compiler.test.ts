import { Compiler } from './compiler';

describe('Compiler', () => {
  test('should retrieve the correct function', () => {
    const functions = {
      testFunction: (): string => 'test',
    };
    const compiler = new Compiler(functions);
    expect(compiler.getFunction('testFunction')).toBe(functions.testFunction);
  });

  test('should retrieve the current source code', () => {
    const compiler = new Compiler({});
    expect(compiler.getSource()).toBe('');
    compiler.raw('some code');
    expect(compiler.getSource()).toBe('some code');
  });

  test('should reset the current source', () => {
    const compiler = new Compiler({});
    compiler.raw('some code');
    expect(compiler.getSource()).toBe('some code');
    compiler.reset();
    expect(compiler.getSource()).toBe('');
  });

  test('raw should append a raw string to the source', () => {
    const compiler = new Compiler({});
    compiler.raw('code snippet');
    expect(compiler.getSource()).toBe('code snippet');
  });

  test('string should append a quoted string with escaped characters', () => {
    const compiler = new Compiler({});
    compiler.string('example "text"');
    expect(compiler.getSource()).toBe('"example \\"text\\""');
  });

  test('repr should handle various value types correctly', () => {
    const compiler = new Compiler({});

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
});

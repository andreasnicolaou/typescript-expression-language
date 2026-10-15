/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConstantFunctionProvider } from './constant-function-provider';
import { ExpressionLanguage } from './expression-language';

const evaluateCompiled = (code: string, constant: (name: string) => unknown): unknown =>
  new Function('constant', `return ${code};`)(constant);

describe('ConstantFunctionProvider', () => {
  let expressionLanguage!: ExpressionLanguage;

  beforeEach(() => {
    (globalThis as any).Status = {
      ACTIVE: { name: 'ACTIVE', code: 1 },
      INACTIVE: { name: 'INACTIVE', code: 0 },
    };
    (globalThis as any).Config = { API_URL: 'https://example.test', SECRET: 's3cr3t' };
    (globalThis as any).Roles = class Roles {
      public static readonly ROLE_ADMIN = 'admin';
      public static readonly ROLE_USER = 'user';
      public static readonly OTHER = 'other';
    };
    expressionLanguage = new ExpressionLanguage(null, [
      new ConstantFunctionProvider(['Math.PI', 'Config.API_URL', 'Status.*', 'Roles::ROLE_*']),
    ]);
  });

  afterEach(() => {
    delete (globalThis as any).Status;
    delete (globalThis as any).Config;
    delete (globalThis as any).Roles;
  });

  test.each([
    ['constant("Math.PI")', Math.PI],
    ['constant("Config.API_URL")', 'https://example.test'],
    ['constant("Status.ACTIVE").code', 1],
    ['constant("Roles::ROLE_ADMIN")', 'admin'],
    ['enum("Status.INACTIVE").name', 'INACTIVE'],
  ])('should evaluate the allowed constant in %s', (expression, expected) => {
    expect(expressionLanguage.evaluate(expression)).toBe(expected);
  });

  test.each([
    ['constant("process.env.HOME")', 'Constant "process.env.HOME" is not allowed.'],
    ['constant("Config.SECRET")', 'Constant "Config.SECRET" is not allowed.'],
    ['constant("Config")', 'Constant "Config" is not allowed.'],
    ['constant("Roles::OTHER")', 'Constant "Roles::OTHER" is not allowed.'],
    ['constant("Status.ACTIVE.code")', 'Constant "Status.ACTIVE.code" is not allowed.'],
    ['constant("Status")', 'Constant "Status" is not allowed.'],
    ['constant("math.PI")', 'Constant "math.PI" is not allowed.'],
    ['constant("Math.PIE")', 'Constant "Math.PIE" is not allowed.'],
    ['constant("MathXPI")', 'Constant "MathXPI" is not allowed.'],
    ['enum("Config.SECRET")', 'Enum case "Config.SECRET" is not allowed.'],
  ])('should refuse the constant in %s', (expression, message) => {
    expect(() => expressionLanguage.evaluate(expression)).toThrow(message);
  });

  test('should not let "*" match across "::"', () => {
    const el = new ExpressionLanguage(null, [new ConstantFunctionProvider(['Ro*'])]);
    expect(() => el.evaluate('constant("Roles::ROLE_ADMIN")')).toThrow('Constant "Roles::ROLE_ADMIN" is not allowed.');
  });

  test('should match one segment per "*"', () => {
    const el = new ExpressionLanguage(null, [new ConstantFunctionProvider(['Status.*.*', '*.API_URL'])]);
    expect(el.evaluate('constant("Status.ACTIVE.code")')).toBe(1);
    expect(el.evaluate('constant("Config.API_URL")')).toBe('https://example.test');
    expect(() => el.evaluate('constant("Status.ACTIVE")')).toThrow('Constant "Status.ACTIVE" is not allowed.');
    expect(() => el.evaluate('constant("process.env.API_URL")')).toThrow(
      'Constant "process.env.API_URL" is not allowed.'
    );
  });

  test.each([
    ['constant("Status.constructor")', 'Constant "Status.constructor" is not allowed.'],
    ['constant("Status.__proto__")', 'Constant "Status.__proto__" is not allowed.'],
    ['constant("Roles::prototype")', 'Constant "Roles::prototype" is not allowed.'],
    ['constant("Config.constructor.name")', 'Constant "Config.constructor.name" is not allowed.'],
    ['enum("Status.constructor")', 'Enum case "Status.constructor" is not allowed.'],
  ])('should never allow a prototype segment, as in %s', (expression, message) => {
    const el = new ExpressionLanguage(null, [new ConstantFunctionProvider(['Status.*', 'Roles::*', 'Config.*.*'])]);
    expect(() => el.evaluate(expression)).toThrow(message);
    expect(() =>
      el.evaluate(expression.replace(/\("([^"]+)"\)/, '(name)'), { name: /"([^"]+)"/.exec(expression)![1] })
    ).toThrow(message);
  });

  test('should refuse every constant when none is allowed', () => {
    const el = new ExpressionLanguage(null, [new ConstantFunctionProvider([])]);
    expect(() => el.evaluate('constant("Math.PI")')).toThrow('Constant "Math.PI" is not allowed.');
  });

  test('should check a name computed at runtime', () => {
    expect(expressionLanguage.evaluate('constant(prefix ~ "PI")', { prefix: 'Math.' })).toBe(Math.PI);
    expect(() => expressionLanguage.evaluate('constant(prefix ~ "HOME")', { prefix: 'process.env.' })).toThrow(
      'Constant "process.env.HOME" is not allowed.'
    );
  });

  test('should keep the errors of the unrestricted functions for an allowed name', () => {
    (globalThis as any).Config.LIST = [1, 2];
    const el = new ExpressionLanguage(null, [new ConstantFunctionProvider(['Missing.*', 'Config.LIST'])]);
    expect(() => el.evaluate('constant("Missing.VALUE")')).toThrow("Constant 'Missing.VALUE' is not defined");
    expect(() => el.evaluate('enum("Config.LIST")')).toThrow(
      'The string "Config.LIST" is not the name of a valid enum case.'
    );
    expect(() => el.evaluate('constant(1)')).toThrow('constant() expects parameter 1 to be string');
    expect(() => el.evaluate('enum(1)')).toThrow('enum() expects parameter 1 to be string');
  });

  test('should reject an allowed constant that is not a non-empty string', () => {
    expect(() => new ConstantFunctionProvider([''])).toThrow('An allowed constant must be a non-empty string.');
    expect(() => new ConstantFunctionProvider([1 as any])).toThrow('An allowed constant must be a non-empty string.');
  });

  test.each([
    ['Config', '"Config" is an object, use "Config.*" to allow its properties.'],
    ['Math', '"Math" is an object, use "Math.*" to allow its properties.'],
    ['Roles', '"Roles" is a class name, use "Roles::*" to allow its constants.'],
    ['globalThis::process', '"globalThis::process" is an object, use "globalThis.process.*" to allow its properties.'],
    ['globalThis::Date', '"globalThis::Date" is a class name, use "globalThis.Date::*" to allow its constants.'],
  ])('should reject %s, which names an object rather than a constant', (constant, message) => {
    expect(() => new ConstantFunctionProvider([constant])).toThrow(TypeError);
    expect(() => new ConstantFunctionProvider([constant])).toThrow(message);
  });

  test('should accept an enum case, an array, a name not defined yet and the constants of a class', () => {
    (globalThis as any).Config.LIST = [1, 2];
    const el = new ExpressionLanguage(null, [
      new ConstantFunctionProvider([
        'Status.ACTIVE',
        'Status::INACTIVE',
        'Config.LIST',
        'Later.VALUE',
        'Roles::*',
        'Roles::ROLE_ADMIN',
        'Config.*',
      ]),
    ]);
    (globalThis as any).Later = { VALUE: 'later' };
    try {
      expect(el.evaluate('enum("Status.ACTIVE").code')).toBe(1);
      expect(el.evaluate('enum("Status::INACTIVE").code')).toBe(0);
      expect(el.evaluate('constant("Config.LIST")')).toEqual([1, 2]);
      expect(el.evaluate('constant("Later.VALUE")')).toBe('later');
    } finally {
      delete (globalThis as any).Later;
    }
  });

  test('should escape regular expression characters in the allowed names', () => {
    const el = new ExpressionLanguage(null, [new ConstantFunctionProvider(['Config.(API_URL|SECRET)'])]);
    expect(() => el.evaluate('constant("Config.SECRET")')).toThrow('Constant "Config.SECRET" is not allowed.');
  });

  describe('compile()', () => {
    const resolve = (name: string): unknown => {
      const [path, member] = name.split('::');
      const value = path.split('.').reduce((obj: any, key) => obj[key], globalThis);
      return member === undefined ? value : value[member];
    };

    test('should compile an allowed literal to a plain call', () => {
      expect(expressionLanguage.compile('constant("Math.PI")', [])).toBe('constant("Math.PI")');
      expect(evaluateCompiled(expressionLanguage.compile('enum("Status.ACTIVE")', []), resolve)).toBe(
        (globalThis as any).Status.ACTIVE
      );
    });

    test.each([
      ['constant("Config.SECRET")', 'Constant "Config.SECRET" is not allowed.'],
      ['enum("Config.SECRET")', 'Enum case "Config.SECRET" is not allowed.'],
    ])('should compile a refused literal in %s to code that throws', (expression, message) => {
      const code = expressionLanguage.compile(expression, []);
      expect(code).not.toContain('constant(');
      expect(() => evaluateCompiled(code, resolve)).toThrow(message);
    });

    test.each([
      ['constant(name)', 'Constant'],
      ['enum(name)', 'Enum case'],
    ])('should check a computed name in %s at runtime', (expression, kind) => {
      const code = expressionLanguage.compile(expression, ['name']);
      const run = (name: string): unknown =>
        new Function('constant', 'name', `return ${code};`)(resolve, name) as unknown;
      expect(run('Status.ACTIVE')).toBe((globalThis as any).Status.ACTIVE);
      expect(() => run('Config.SECRET')).toThrow(`${kind} "Config.SECRET" is not allowed.`);
      expect(() => run('Status.constructor')).toThrow(`${kind} "Status.constructor" is not allowed.`);
    });

    test('should compile a prototype segment in a literal to code that throws', () => {
      const code = expressionLanguage.compile('constant("Status.constructor")', []);
      expect(code).not.toContain('constant(');
      expect(() => evaluateCompiled(code, resolve)).toThrow('Constant "Status.constructor" is not allowed.');
    });

    test('should escape a refused literal in the compiled code', () => {
      const code = expressionLanguage.compile('constant("</script><!--")', []);
      expect(code).not.toMatch(/[<>]/);
      expect(() => evaluateCompiled(code, resolve)).toThrow('Constant "</script><!--" is not allowed.');
    });
  });
});

describe('built-in constant() and enum() deprecation', () => {
  let emitWarning!: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    emitWarning = jest.spyOn(process, 'emitWarning').mockImplementation(() => undefined);
  });

  afterEach(() => {
    emitWarning.mockRestore();
  });

  const load = (): typeof import('./index') => jest.requireActual('./index');

  test.each(['constant', 'enum'])('should report the built-in %s() as deprecated once', (name) => {
    const { ExpressionLanguage: FreshExpressionLanguage } = load();
    const el = new FreshExpressionLanguage();
    el.lint(`${name}("Math.PI")`, []);
    el.lint(`${name}("Math.E")`, []);
    expect(emitWarning).toHaveBeenCalledTimes(1);
    expect(emitWarning).toHaveBeenCalledWith(
      `Using the built-in "${name}()" expression function is deprecated, register a "ConstantFunctionProvider" listing the allowed constants instead.`,
      'DeprecationWarning'
    );
  });

  test('should not report the functions of a ConstantFunctionProvider', () => {
    const { ExpressionLanguage: FreshExpressionLanguage, ConstantFunctionProvider: FreshProvider } = load();
    const el = new FreshExpressionLanguage(null, [new FreshProvider(['Math.PI'])]);
    expect(el.evaluate('constant("Math.PI")')).toBe(Math.PI);
    expect(emitWarning).not.toHaveBeenCalled();
  });

  test('should not report a function that is not called', () => {
    const { ExpressionLanguage: FreshExpressionLanguage } = load();
    new FreshExpressionLanguage().evaluate('max(1, 2)');
    expect(emitWarning).not.toHaveBeenCalled();
  });

  test('should fall back to console.warn without process.emitWarning', () => {
    const { ExpressionLanguage: FreshExpressionLanguage } = load();
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const original = process.emitWarning;
    (process as any).emitWarning = undefined;
    try {
      new FreshExpressionLanguage().lint('constant("Math.PI")', []);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('DeprecationWarning: Using the built-in "constant()"'));
    } finally {
      process.emitWarning = original;
      warn.mockRestore();
    }
  });
});

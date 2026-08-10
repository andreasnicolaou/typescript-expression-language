import { round } from 'locutus/php/math/round';
import { ExpressionLanguage, type ExpressionFunctionProvider } from '../expression-language';
import { ArrayProvider, DateProvider, MathProvider, StringProvider } from './index';

type EvaluatorCase = readonly [name: string, args: unknown[], expected: unknown];

const providers: ExpressionFunctionProvider[] = [
  new MathProvider(),
  new StringProvider(),
  new ArrayProvider(),
  new DateProvider(),
];

const invoke = (provider: ExpressionFunctionProvider, name: string, args: unknown[]): unknown => {
  const expressionFunction = provider.getFunctions().find((fn) => fn.getName() === name);
  if (!expressionFunction) {
    throw new Error(`Provider does not expose ${name}().`);
  }
  return expressionFunction.getEvaluator()(Object.create(null), ...args);
};

describe('providers', () => {
  test('expose the documented Locutus function sets', () => {
    expect(providers.map((provider) => provider.getFunctions().map((fn) => fn.getName()))).toEqual([
      ['abs', 'ceil', 'floor', 'round', 'sqrt', 'pow'],
      [
        'strtolower',
        'strtoupper',
        'strlen',
        'trim',
        'ltrim',
        'rtrim',
        'ucfirst',
        'lcfirst',
        'ucwords',
        'strrev',
        'explode',
        'str_replace',
        'substr',
      ],
      [
        'count',
        'implode',
        'array_keys',
        'array_values',
        'array_merge',
        'array_reverse',
        'array_unique',
        'array_sum',
        'in_array',
        'array_intersect',
        'array_slice',
      ],
      ['checkdate', 'date', 'date_parse', 'gmdate', 'gmmktime', 'mktime', 'strtotime', 'time'],
    ]);
  });

  test('register, evaluate, and compile through ExpressionLanguage', () => {
    const el = new ExpressionLanguage(undefined, providers);
    expect(el.evaluate('round(-1.5)')).toBe(-2);
    expect(el.evaluate('strtoupper(implode("", array_reverse(["a", "b"])))')).toBe('BA');
    expect(el.evaluate('array_unique([1, "1", 2])')).toEqual({ 0: 1, 2: 2 });
    expect(el.evaluate('gmdate("Y", 0)')).toBe('1970');

    const compiled = el.compile('round(value)', ['value']);
    expect(compiled).toBe('round(value)');
    expect(new Function('round', 'value', `return ${compiled};`)(round, -1.5)).toBe(-2);
  });
});

describe('provider forwarding contracts', () => {
  test('every registered compiler emits its function call', () => {
    for (const provider of providers) {
      for (const expressionFunction of provider.getFunctions()) {
        const name = expressionFunction.getName();
        expect(expressionFunction.getCompiler()('value')).toBe(`${name}(value)`);
      }
    }
  });

  test('every MathProvider evaluator delegates to Locutus', () => {
    const cases: EvaluatorCase[] = [
      ['abs', [-5], 5],
      ['ceil', [3.2], 4],
      ['floor', [3.8], 3],
      ['round', [-1.5], -2],
      ['sqrt', [9], 3],
      ['pow', [2, 10], 1024],
    ];

    for (const [name, args, expected] of cases) {
      expect(invoke(providers[0], name, args)).toEqual(expected);
    }
  });

  test('every StringProvider evaluator delegates to Locutus', () => {
    const cases: EvaluatorCase[] = [
      ['strtolower', ['HELLO'], 'hello'],
      ['strtoupper', ['hello'], 'HELLO'],
      ['strlen', ['hello'], 5],
      ['trim', ['  hi  '], 'hi'],
      ['ltrim', ['  hi'], 'hi'],
      ['rtrim', ['hi  '], 'hi'],
      ['ucfirst', ['hello'], 'Hello'],
      ['lcfirst', ['HELLO'], 'hELLO'],
      ['ucwords', ['hello world'], 'Hello World'],
      ['strrev', ['abc'], 'cba'],
      ['explode', [',', 'a,b'], ['a', 'b']],
      ['str_replace', ['o', '0', 'foo'], 'f00'],
      ['substr', ['hello', 1, -1], 'ell'],
    ];

    for (const [name, args, expected] of cases) {
      expect(invoke(providers[1], name, args)).toEqual(expected);
    }
  });

  test('every ArrayProvider evaluator delegates to Locutus', () => {
    const cases: EvaluatorCase[] = [
      ['count', [[1, 2, 3]], 3],
      ['implode', ['-', [1, 2, 3]], '1-2-3'],
      ['array_keys', [{ a: 1, b: 2 }], ['a', 'b']],
      ['array_values', [{ a: 1, b: 2 }], [1, 2]],
      ['array_merge', [{ a: 1 }, { b: 2 }], { a: 1, b: 2 }],
      ['array_reverse', [[1, 2, 3]], [3, 2, 1]],
      ['array_unique', [[1, '1', 2]], { 0: 1, 2: 2 }],
      ['array_sum', [[1, 2, 3]], 6],
      ['in_array', [1, ['1']], true],
      [
        'array_intersect',
        [
          [1, 2, 3],
          [2, 3],
        ],
        { 1: 2, 2: 3 },
      ],
      ['array_slice', [[1, 2, 3], 1], [2, 3]],
    ];

    for (const [name, args, expected] of cases) {
      expect(invoke(providers[2], name, args)).toEqual(expected);
    }
  });

  test('every DateProvider evaluator delegates to Locutus', () => {
    const dateProvider = providers[3];
    expect(invoke(dateProvider, 'checkdate', [2, 29, 2024])).toBe(true);
    expect(invoke(dateProvider, 'date', ['Y', 0])).toBe('1970');
    expect(invoke(dateProvider, 'date_parse', ['2026-07-21'])).toMatchObject({ year: 2026, month: 7, day: 21 });
    expect(invoke(dateProvider, 'gmdate', ['Y', 0])).toBe('1970');
    expect(invoke(dateProvider, 'gmmktime', [0, 0, 0, 1, 1, 1970])).toBe(0);
    expect(typeof invoke(dateProvider, 'mktime', [0, 0, 0, 1, 1, 1970])).toBe('number');
    expect(typeof invoke(dateProvider, 'strtotime', ['2026-07-21T00:00:00'])).toBe('number');
    expect(typeof invoke(dateProvider, 'time', [])).toBe('number');
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpressionFunctionProvider, ExpressionLanguage } from './expression-language';

const getEvaluateData = (): (string | Record<string, any> | number | null | boolean)[][] => {
  return [
    ['1.0', {}, 1, null],
    ['1 + 1', {}, 2, null],
    ['2 ** 3', {}, 8, null],
    ['a > 0', { a: 1 }, true, null],
    ['a >= 0', { a: 1 }, true, null],
    ['a <= 0', { a: 1 }, false, null],
    ['a != 0', { a: 1 }, true, null],
    ['a == 1', { a: 1 }, true, null],
    ['a === 1', { a: 1 }, true, null],
    ['a !== 1', { a: 1 }, false, null],
    [
      'foo.getFirst() + bar.getSecond()',
      {
        foo: { getFirst: (): number => 7 },
        bar: { getSecond: (): number => 100 },
      },
      107,
      null,
    ],
    [
      '(foo.getFirst() + bar.getSecond()) / foo.second',
      {
        foo: { second: 4, getFirst: (): number => 7 },
        bar: { getSecond: (): number => 9 },
      },
      4,
      null,
    ],
    [
      'foo.getFirst() + bar.getSecond() / foo.second',
      {
        foo: {
          second: 4,
          getFirst: (): number => {
            return 7;
          },
        },
        bar: {
          getSecond: (): number => {
            return 8;
          },
        },
      },
      9,
      null,
    ],
    [
      '(foo.getFirst() + bar.getSecond() / foo.second) + bar.first[3]',
      {
        foo: {
          getFirst: (): number => {
            return 7;
          },
          second: 4,
        },
        bar: {
          first: [1, 2, 3, 4, 5],
          getSecond: (): number => {
            return 8;
          },
        },
      },
      13,
      null,
    ],
    [
      'b.myMethod(a[1])',
      {
        a: ['one', 'two', 'three'],
        b: {
          myProperty: 'foo',
          myMethod: (word: string): string => {
            return 'bar ' + word;
          },
        },
      },
      'bar two',
      null,
    ],
    [
      'a[2] === "three" and b.myMethod(a[1]) === "bar two" and (b.myProperty == "foo" or b["myProperty"] == "foo") and b["property with spaces and &*()*%$##@% characters"] == "fun"',
      {
        a: ['one', 'two', 'three'],
        b: {
          myProperty: 'foo',
          myMethod: (word: string): string => {
            return 'bar ' + word;
          },
          ['property with spaces and &*()*%$##@% characters']: 'fun',
        },
      },
      true,
      null,
    ],
    [
      'a and !b',
      {
        a: true,
        b: false,
      },
      true,
      null,
    ],
    [
      'a in b',
      {
        a: 'Dogs',
        b: ['Cats', 'Dogs'],
      },
      true,
      null,
    ],
    [
      'a in outputs["typesOfAnimalsAllowed"]',
      {
        a: 'Dogs',
        outputs: {
          typesOfAnimalsAllowed: ['Dogs', 'Other'],
        },
      },
      true,
      null,
    ],
    [
      '"Other" in inputs["typesOfAnimalsAllowed"]',
      {
        inputs: {
          typesOfAnimalsAllowed: ['Dogs', 'Other'],
        },
      },
      true,
    ],
    [
      'a not in b',
      {
        a: 'Dogs',
        b: ['Cats', 'Bags'],
      },
      true,
      null,
    ],
  ];
};

describe('ExpressionLanguage', () => {
  let expressionLanguage!: ExpressionLanguage;

  beforeEach(() => {
    expressionLanguage = new ExpressionLanguage();
  });

  test('should evaluate short-circuit expressions correctly', () => {
    const object = {
      foo: (): any => {
        throw new Error('This method should not be called due to short circuiting.');
      },
    };

    const shortCircuits = [
      ['false && object.foo()', { object }, false],
      ['false and object.foo()', { object }, false],
      ['true || object.foo()', { object }, true],
      ['true or object.foo()', { object }, true],
    ];

    shortCircuits.forEach(([expression, variables, expectedResult]) => {
      const result = expressionLanguage.evaluate(expression as string, variables as Record<string, any>);
      expect(result).toBe(expectedResult);
    });
  });

  test('should compile short-circuit expressions correctly', () => {
    const shortCircuits = [
      ['false && foo', [{ foo: 'foo' }], false],
      ['false and foo', [{ foo: 'foo' }], false],
      ['true || foo', [{ foo: 'foo' }], true],
      ['true or foo', [{ foo: 'foo' }], true],
    ];

    shortCircuits.forEach(([expression, variables, expectedResult]) => {
      const compiled = expressionLanguage.compile(expression as string, variables as any[]);
      const result = eval(compiled);
      expect(result).toBe(expectedResult);
    });
  });

  test('should cache for overridden variable names', () => {
    const expression = 'a + b';
    expressionLanguage.evaluate(expression, { a: 1, b: 1 });
    const result = expressionLanguage.compile(expression, ['a', { B: 'b' }] as any);
    expect(result).toBe('(a + B)');
  });

  test('should use cache when parsing the same expression multiple times', () => {
    const expression = 'min(a, b)';
    const names = ['a', 'b'];
    const firstParse = expressionLanguage.parse(expression, names);
    expect(expressionLanguage.cache.size).toBe(1);
    const secondParse = expressionLanguage.parse(expression, names);
    expect(firstParse).toBe(secondParse);
    expect(expressionLanguage.cache.size).toBe(1);
  });

  test('should not use cache for different expressions', () => {
    const expression1 = 'min(a, b)';
    const expression2 = 'max(a, b)';
    const names = ['a', 'b'];
    const firstParse = expressionLanguage.parse(expression1, names);
    const secondParse = expressionLanguage.parse(expression2, names);
    expect(firstParse).not.toBe(secondParse);
    expect(expressionLanguage.cache.size).toBe(2);
  });

  test('should handle strict equality expressions', () => {
    const expression = '123 === a';
    const result = expressionLanguage.compile(expression, ['a']);
    expect(result).toBe('(123 === a)');
  });

  test('should throw an error for bad callable methods', () => {
    expect(() => {
      expressionLanguage.evaluate('foo.myfunction()', { foo: {} });
    }).toThrow('Unable to call method "myfunction" of object "object".');
  });

  test('should evaluate valid expressions', () => {
    const evaluateData = getEvaluateData();
    evaluateData.forEach(([expression, values, expectedOutcome, provider]) => {
      if (provider) {
        expressionLanguage.registerProvider(provider as ExpressionFunctionProvider);
      }
      const result = expressionLanguage.evaluate(expression as string, values as Record<string, any>);
      if (expectedOutcome !== null && typeof expectedOutcome === 'object') {
        expect(result).toEqual(expectedOutcome);
      } else {
        expect(result).toBe(expectedOutcome);
      }
    });
  });
});

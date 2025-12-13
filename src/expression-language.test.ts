/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from './compiler';
import { ExpressionFunction } from './expression-function';
import { ExpressionFunctionProvider, ExpressionLanguage } from './expression-language';
import { Lexer } from './lexer';
import { Parser } from './parser';

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
      const compiled = expressionLanguage.compile(expression as string, variables as Record<string, string>[]);
      const result = new Function('return ' + compiled)();
      expect(result).toBe(expectedResult);
    });
  });

  test('should cache for overridden variable names', () => {
    const expression = 'a + b';
    expressionLanguage.evaluate(expression, { a: 1, b: 1 });
    const result = expressionLanguage.compile(expression, ['a', { B: 'b' }]);
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
    getEvaluateData().forEach(([expression, values, expectedOutcome, provider]) => {
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

  test('should initialize with providers and register their functions', () => {
    const provider = {
      getFunctions: (): ExpressionFunction[] => [
        ExpressionFunction.fromJs(
          'CUSTOM_FN',
          (x: string) => {
            return x;
          },
          'my_custom_fn'
        ),
      ],
    };
    const containedExpressionLanguage = new ExpressionLanguage(undefined, [provider]);
    expect(Object.keys(containedExpressionLanguage['functions'])).toContain('my_custom_fn');
  });

  test('should ignore unknown variables when IGNORE_UNKNOWN_VARIABLES flag is used', () => {
    expect(() => expressionLanguage.lint('unknown_var + 1', [], Parser.IGNORE_UNKNOWN_VARIABLES)).not.toThrow();
  });

  test('should throw error when registering after parser is created', () => {
    expressionLanguage.parse('1+1', ['a']);
    expect(() =>
      expressionLanguage.register(
        'foo',
        new ExpressionFunction(
          'foo',
          (y: string) => {
            return y;
          },
          (w: string) => {
            return w;
          }
        )
      )
    ).toThrow('Registering functions after calling evaluate(), compile() or parse() is not supported.');
  });

  test('should getLexer, getParser, getCompiler', () => {
    expect(expressionLanguage['getLexer']()).toBeInstanceOf(Lexer);
    expect(expressionLanguage['getParser']()).toBeInstanceOf(Parser);
    expect(expressionLanguage['getCompiler']()).toBeInstanceOf(Compiler);
  });

  test('should register default functions', () => {
    expect(Object.keys(expressionLanguage['functions'])).toEqual(expect.arrayContaining(['min', 'max', 'now']));
  });

  test('should return ParsedExpression instance directly from parse', () => {
    const parsed = expressionLanguage.parse('1+1', []);
    expect(expressionLanguage.parse(parsed, [])).toBe(parsed);
  });

  test('should return early from lint if expression is ParsedExpression', () => {
    const parsed = expressionLanguage.parse('1+1', []);
    expect(() => expressionLanguage.lint(parsed, ['a'])).not.toThrow();
  });

  test('should use cache when parsing with same names in different order', () => {
    const expression = 'a + b + c';
    const names1 = ['c', 'a', 'b'];
    const names2 = ['a', 'b', 'c'];
    const names3 = ['b', 'c', 'a'];

    const firstParse = expressionLanguage.parse(expression, names1);
    expect(expressionLanguage.cache.size).toBe(1);

    const secondParse = expressionLanguage.parse(expression, names2);
    expect(firstParse).toBe(secondParse);
    expect(expressionLanguage.cache.size).toBe(1);

    const thirdParse = expressionLanguage.parse(expression, names3);
    expect(firstParse).toBe(thirdParse);
    expect(expressionLanguage.cache.size).toBe(1);
  });

  test('should use cache when parsing with mixed types in different order', () => {
    const expression = 'a + b + c';
    const names1 = ['c', 'a', 'b'];
    const names2 = ['a', 'b', 'c'];
    const names3 = ['b', 'c', 'a'];

    const firstParse = expressionLanguage.parse(expression, names1);
    expect(expressionLanguage.cache.size).toBe(1);

    const secondParse = expressionLanguage.parse(expression, names2);
    expect(firstParse).toBe(secondParse);
    expect(expressionLanguage.cache.size).toBe(1);

    const thirdParse = expressionLanguage.parse(expression, names3);
    expect(firstParse).toBe(thirdParse);
    expect(expressionLanguage.cache.size).toBe(1);
  });

  test('should sort string names correctly using localeCompare in parse method', () => {
    // Create a simple test expression that uses string variable names
    const expression = '10 + 2 + 1';
    // Using string names to trigger the localeCompare sorting
    const names = ['10', '2', '1'];

    const parsed = expressionLanguage.parse(expression, names);
    expect(parsed).toBeDefined();
    expect(parsed.toString()).toBe(expression);

    // The cache key should be generated with sorted string values (1, 10, 2)
    expect(expressionLanguage.cache.size).toBe(1);

    // Test with the same expression but names in different order should use same cache
    const names2 = ['1', '10', '2'];
    const parsed2 = expressionLanguage.parse(expression, names2);
    expect(parsed).toBe(parsed2);
    expect(expressionLanguage.cache.size).toBe(1);
  });

  test('should handle mixed string sorting correctly with localeCompare', () => {
    const expression = '1 + 2 + 3';

    // Test mixed strings - these will be used for cache key generation
    const names1 = ['z', '10', 'a', '2'];
    const names2 = ['2', 'a', '10', 'z']; // Same names, different order

    const parsed1 = expressionLanguage.parse(expression, names1);
    const parsed2 = expressionLanguage.parse(expression, names2);

    // Should use the same cache entry since sorting should be consistent
    expect(parsed1).toBe(parsed2);
    expect(expressionLanguage.cache.size).toBe(1);
  });

  test('should handle special string characters with localeCompare', () => {
    const expression = '1 + 2 + 3';

    // Test strings with special characters that benefit from localeCompare
    const names1 = ['ä', 'a', 'ß'];
    const names2 = ['ß', 'a', 'ä']; // Same names, different order

    const parsed1 = expressionLanguage.parse(expression, names1);
    const parsed2 = expressionLanguage.parse(expression, names2);

    // Should use the same cache entry
    expect(parsed1).toBe(parsed2);
    expect(expressionLanguage.cache.size).toBe(1);
  });

  test('should handle object names with non-string values in localeCompare', () => {
    const expression = 'ä + a + ß';
    // Use objects with non-string values to trigger string conversion
    const names1 = [{ ä: 1 }, { a: true }, { ß: null }];
    const names2 = [{ ß: null }, { a: true }, { ä: 1 }]; // Same names, different order

    const parsed1 = expressionLanguage.parse(expression, names1, Parser.IGNORE_UNKNOWN_VARIABLES);
    const parsed2 = expressionLanguage.parse(expression, names2, Parser.IGNORE_UNKNOWN_VARIABLES);

    // Should use the same cache entry
    expect(parsed1).toBe(parsed2);
    expect(expressionLanguage.cache.size).toBe(1);
  });

  describe('enum() function', () => {
    beforeEach(() => {
      (globalThis as any).GenericEnum = {
        VALUE: { name: 'VALUE', number: 10 },
        NULL_VALUE: null,
        UNDEFINED_VALUE: undefined,
        INVALID_OBJECT: { value: 'something', data: 'test' },
        COMPLEX_OBJECT: { foo: 'bar', nested: { deep: 'value' } },
      };

      (globalThis as any).InputTypes = {
        TEXT: 'text',
        NUM: 1,
        DEV: true,
        PROD: false,
      };
    });

    afterEach(() => {
      delete (globalThis as any).GenericEnum;
      delete (globalThis as any).InputTypes;
    });

    test('should throw error for invalid enum name', () => {
      expect(() => expressionLanguage.evaluate('enum("GenericEnum.CASE")')).toThrow(
        'The string "GenericEnum.CASE" is not the name of a valid enum case.'
      );
    });

    test('should throw error for malformed enum string', () => {
      expect(() => expressionLanguage.evaluate('enum("NOT_AN_ENUM")')).toThrow(
        'The string "NOT_AN_ENUM" is not the name of a valid enum case.'
      );
    });

    test('should throw error for non-existent enum values', () => {
      expect(() => expressionLanguage.evaluate('enum("NON_EXISTENT_ENUM.VALUE")')).toThrow(
        'The string "NON_EXISTENT_ENUM.VALUE" is not the name of a valid enum case.'
      );
    });

    test('should work in complex expressions', () => {
      const result = expressionLanguage.evaluate('enum("GenericEnum.VALUE").number + 5');
      expect(result).toBe(15);
    });

    test('should support TypeScript-style enums (string, number, boolean)', () => {
      expect(expressionLanguage.evaluate('enum("InputTypes.TEXT")')).toBe('text');
      expect(expressionLanguage.evaluate('enum("InputTypes.NUM")')).toBe(1);
      expect(expressionLanguage.evaluate('enum("InputTypes.DEV")')).toBe(true);
      expect(expressionLanguage.evaluate('enum("InputTypes.PROD")')).toBe(false);
    });

    test('should compile enum expressions correctly', () => {
      const compiled = expressionLanguage.compile('enum("StatusEnum.ACTIVE")', []);
      expect(compiled).toContain('constant');
      expect(compiled).toContain('TypeError');
      expect(compiled).toMatch(/^\(function\(v\)/);
      expect(compiled).toContain('StatusEnum.ACTIVE');
    });

    test('should cover actual enum function parameter validation', () => {
      // Use reflection to access the actual enum function and test its evaluator directly
      const expressionLangAny = expressionLanguage as any;
      const enumFunction = expressionLangAny.functions.enum;
      const evaluator = enumFunction.getEvaluator();
      expect(() => evaluator({}, 123)).toThrow('enum() expects parameter 1 to be string');
      expect(() => evaluator({}, null)).toThrow('enum() expects parameter 1 to be string');
      expect(() => evaluator({}, '')).toThrow('enum() expects parameter 1 to be string');
    });

    test('should throw error for null/undefined enum values', () => {
      expect(() => expressionLanguage.evaluate('enum("GenericEnum.NULL_VALUE")')).toThrow(
        'The string "GenericEnum.NULL_VALUE" is not the name of a valid enum case.'
      );
      expect(() => expressionLanguage.evaluate('enum("GenericEnum.UNDEFINED_VALUE")')).toThrow(
        'The string "GenericEnum.UNDEFINED_VALUE" is not the name of a valid enum case.'
      );
    });

    test('should throw error for invalid object enums without name property', () => {
      expect(() => expressionLanguage.evaluate('enum("GenericEnum.INVALID_OBJECT")')).toThrow(
        'The string "GenericEnum.INVALID_OBJECT" is not the name of a valid enum case.'
      );
      expect(() => expressionLanguage.evaluate('enum("GenericEnum.COMPLEX_OBJECT")')).toThrow(
        'The string "GenericEnum.COMPLEX_OBJECT" is not the name of a valid enum case.'
      );
    });
  });
});

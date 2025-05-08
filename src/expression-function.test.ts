import { ExpressionFunction } from './expression-function';
import { ExpressionLanguage } from './expression-language';

describe('ExpressionFunction', () => {
  let expressionLanguage!: ExpressionLanguage;

  beforeEach(() => {
    expressionLanguage = new ExpressionLanguage();
  });

  test('should throw error when function does not exist', () => {
    expect(() => {
      ExpressionFunction.fromJs('nonExistentFunction');
    }).toThrow('JavaScript function "nonExistentFunction" does not exist.');
  });

  test('should create an ExpressionFunction for squaring numbers and evaluate correctly', () => {
    const squareFunction = (x: number): number => x * x;
    const expressionFunction = ExpressionFunction.fromJs('squareFunction', squareFunction, 'square');

    expect(expressionFunction.getName()).toBe('square');

    expressionLanguage.addFunction(expressionFunction);
    expect(expressionLanguage.evaluate('square(5)')).toBe(25);
  });

  test('should create an ExpressionFunction for adding two numbers and evaluate correctly', () => {
    const addFunction = (x: number, y: number): number => x + y;
    const expressionFunction = ExpressionFunction.fromJs('addFunction', addFunction, 'add');

    expect(expressionFunction.getName()).toBe('add');

    expressionLanguage.addFunction(expressionFunction);
    expect(expressionLanguage.evaluate('add(3, 4)')).toBe(7);
  });

  test('should create an ExpressionFunction for concatenating strings and evaluate correctly', () => {
    const concatFunction = (str1: string, str2: string): string => str1 + str2;
    const expressionFunction = ExpressionFunction.fromJs('concatFunction', concatFunction, 'concat');

    expect(expressionFunction.getName()).toBe('concat');

    expressionLanguage.addFunction(expressionFunction);
    expect(expressionLanguage.evaluate('concat("Hello", " World")')).toBe('Hello World');
  });

  test('should create an ExpressionFunction for checking if a number is even or odd and evaluate correctly', () => {
    const isEvenFunction = (x: number): boolean => x % 2 === 0;
    const expressionFunction = ExpressionFunction.fromJs('isEvenFunction', isEvenFunction, 'isEven');

    expect(expressionFunction.getName()).toBe('isEven');

    expressionLanguage.addFunction(expressionFunction);
    expect(expressionLanguage.evaluate('isEven(10)')).toBe(true);
    expect(expressionLanguage.evaluate('isEven(7)')).toBe(false);
  });

  test('should correctly evaluate the min function which is available by default', () => {
    expect(expressionLanguage.evaluate('min(3, 5, 1, 7)', {})).toBe(1);
    expect(expressionLanguage.evaluate('min(10, 15, 2, 8)', {})).toBe(2);
    expect(expressionLanguage.evaluate('min(0, -5, 3, -2)', {})).toBe(-5);
  });

  test('should correctly evaluate the max function which is available by default', () => {
    expect(expressionLanguage.evaluate('max(3, 5, 1, 7)', {})).toBe(7);
    expect(expressionLanguage.evaluate('max(10, 15, 2, 8)', {})).toBe(15);
    expect(expressionLanguage.evaluate('max(0, -5, 3, -2)', {})).toBe(3);
  });

  test('should correctly evaluate the now function which is available by default', () => {
    const currentTime = Date.now();
    const evaluatedNow = expressionLanguage.evaluate('now()', {});
    expect(evaluatedNow).toBeGreaterThanOrEqual(currentTime);
    expect(evaluatedNow).toBeLessThan(currentTime + 1000);
  });

  test('should correctly add the toUpperCase from the existing list and evaluate correctly', () => {
    const toUpperCaseFunction = ExpressionFunction.fromJs('toUpperCase');
    expressionLanguage.addFunction(toUpperCaseFunction);

    const evaluatedUpper = expressionLanguage.evaluate('toUpperCase("hello")', {});
    expect(evaluatedUpper).toBe('HELLO');
  });

  test('should create an ExpressionFunction and evaluate a manually created double function correctly', () => {
    const name = 'double';
    const compiler = (...args: unknown[]): unknown => `double(${args.join(', ')})`;
    const evaluator = (_context: unknown, x: number): unknown => x * 2;
    const doubleFunction = new ExpressionFunction(name, compiler, evaluator);

    expressionLanguage.addFunction(doubleFunction);
    expect(expressionLanguage.evaluate('double(4)', {})).toBe(8);
  });

  test('should creates an ExpressionFunction with a custom function', () => {
    const customFunction = (x: number): number => x * x;
    const expressionFunction = ExpressionFunction.fromJs('customFunction', customFunction, 'square');

    expect(expressionFunction.getName()).toBe('square');

    const compiled = expressionFunction.getCompiler()(3);
    expect(compiled).toBe('square(3)');

    const evaluated = expressionFunction.getEvaluator()(null, 3);
    expect(evaluated).toBe(9);
  });

  test('should create an ExpressionFunction using Math.max', () => {
    const expressionFunction = ExpressionFunction.fromJs('max', Math.max);

    expect(expressionFunction.getName()).toBe('max');

    const compiled = expressionFunction.getCompiler()(1, 2, 3);
    expect(compiled).toBe('max(1, 2, 3)');

    const evaluated = expressionFunction.getEvaluator()(null, 1, 2, 3);
    expect(evaluated).toBe(3);
  });

  test('should create an ExpressionFunction using Math.min', () => {
    const expressionFunction = ExpressionFunction.fromJs('min', Math.min);

    expect(expressionFunction.getName()).toBe('min');

    const compiled = expressionFunction.getCompiler()(1, 2, 3);
    expect(compiled).toBe('min(1, 2, 3)');

    const evaluated = expressionFunction.getEvaluator()(null, 1, 2, 3);
    expect(evaluated).toBe(1);
  });

  test('should create an ExpressionFunction using Object.keys', () => {
    const expressionFunction = ExpressionFunction.fromJs('keys');

    expect(expressionFunction.getName()).toBe('keys');

    const compiled = expressionFunction.getCompiler()({ name: 'Alice', age: 25 });
    expect(compiled).toBe('keys({"name":"Alice","age":25})');

    const evaluated = expressionFunction.getEvaluator()(null, { name: 'Alice', age: 25 });
    expect(evaluated).toEqual(['name', 'age']);
  });

  test('should create an ExpressionFunction using Math.pow', () => {
    const expressionFunction = ExpressionFunction.fromJs('pow');

    expect(expressionFunction.getName()).toBe('pow');

    const compiled = expressionFunction.getCompiler()(2, 3);
    expect(compiled).toBe('pow(2, 3)');

    const evaluated = expressionFunction.getEvaluator()(null, 2, 3);
    expect(evaluated).toBe(8);
  });

  test('should create an ExpressionFunction using Math.sin', () => {
    const expressionFunction = ExpressionFunction.fromJs('sin');

    expect(expressionFunction.getName()).toBe('sin');

    const compiled = expressionFunction.getCompiler()(Math.PI / 2);
    expect(compiled).toBe('sin(1.5707963267948966)');

    const evaluated = expressionFunction.getEvaluator()(null, Math.PI / 2);
    expect(evaluated).toBeCloseTo(1);
  });

  test('should resolve JSON functions like JSON.stringify and JSON.parse', () => {
    const stringifyFunction = ExpressionFunction.fromJs('stringify');
    const parseFunction = ExpressionFunction.fromJs('parse');

    expect(stringifyFunction.getName()).toBe('stringify');
    expect(parseFunction.getName()).toBe('parse');

    const compiledStringify = stringifyFunction.getCompiler()({ name: 'Alice', age: 25 });
    const compiledParse = parseFunction.getCompiler()('{"name":"Alice","age":25}');

    expect(compiledStringify).toBe('stringify({"name":"Alice","age":25})');
    expect(compiledParse).toBe('parse({"name":"Alice","age":25})');

    const evaluatedStringify = stringifyFunction.getEvaluator()(null, { name: 'Alice', age: 25 });
    const evaluatedParse = parseFunction.getEvaluator()(null, '{"name":"Alice","age":25}');

    expect(evaluatedStringify).toBe('{"name":"Alice","age":25}');
    expect(evaluatedParse).toEqual({ name: 'Alice', age: 25 });
  });

  test('should resolve Array functions like Array.isArray', () => {
    const isArrayFunction = ExpressionFunction.fromJs('isArray');

    expect(isArrayFunction.getName()).toBe('isArray');

    const compiled = isArrayFunction.getCompiler()([1, 2, 3]);
    expect(compiled).toBe('isArray([1,2,3])');

    const evaluatedTrue = isArrayFunction.getEvaluator()(null, [1, 2, 3]);
    const evaluatedFalse = isArrayFunction.getEvaluator()(null, 'not an array');

    expect(evaluatedTrue).toBe(true);
    expect(evaluatedFalse).toBe(false);
  });

  test('should resolve Object.keys and Object.values', () => {
    const keysFunction = ExpressionFunction.fromJs('keys');
    const valuesFunction = ExpressionFunction.fromJs('values');

    expect(keysFunction.getName()).toBe('keys');
    expect(valuesFunction.getName()).toBe('values');

    const keysCompiled = keysFunction.getCompiler()({ name: 'Alice', age: 25 });
    const valuesCompiled = valuesFunction.getCompiler()({ name: 'Alice', age: 25 });

    expect(keysCompiled).toBe('keys({"name":"Alice","age":25})');
    expect(valuesCompiled).toBe('values({"name":"Alice","age":25})');

    const keysEvaluated = keysFunction.getEvaluator()(null, { name: 'Alice', age: 25 });
    const valuesEvaluated = valuesFunction.getEvaluator()(null, { name: 'Alice', age: 25 });

    expect(keysEvaluated).toEqual(['name', 'age']);
    expect(valuesEvaluated).toEqual(['Alice', 25]);
  });

  test('should resolve String methods like toUpperCase and toLowerCase', () => {
    const toUpperCaseFunction = ExpressionFunction.fromJs('toUpperCase');
    const toLowerCaseFunction = ExpressionFunction.fromJs('toLowerCase');

    expect(toUpperCaseFunction.getName()).toBe('toUpperCase');
    expect(toLowerCaseFunction.getName()).toBe('toLowerCase');

    const compiledUpper = toUpperCaseFunction.getCompiler()('hello');
    const compiledLower = toLowerCaseFunction.getCompiler()('WORLD');

    expect(compiledUpper).toBe('toUpperCase(hello)');
    expect(compiledLower).toBe('toLowerCase(WORLD)');

    const evaluatedUpper = toUpperCaseFunction.getEvaluator()(null, 'hello');
    const evaluatedLower = toLowerCaseFunction.getEvaluator()(null, 'WORLD');

    expect(evaluatedUpper).toBe('HELLO');
    expect(evaluatedLower).toBe('world');
  });
});

import { ExpressionFunction } from './expression-function';

describe('ExpressionFunction', () => {
  test('should throw error when function does not exist', () => {
    expect(() => {
      ExpressionFunction.fromJs('nonExistentFunction');
    }).toThrow('JavaScript function "nonExistentFunction" does not exist.');
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

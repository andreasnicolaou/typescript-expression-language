/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { ConstantNode } from './constant-node';

const getEvaluateData = (): (
  | (string | ConstantNode)[]
  | (boolean | ConstantNode)[]
  | (ConstantNode | null)[]
  | (number | ConstantNode)[]
  | (ConstantNode | Record<string, any>)[]
)[] => [
  [false, new ConstantNode(false)],
  [true, new ConstantNode(true)],
  [null, new ConstantNode(null)],
  [3, new ConstantNode(3)],
  [3.3, new ConstantNode(3.3)],
  ['foo', new ConstantNode('foo')],
  [{ one: 1, b: 'a' }, new ConstantNode({ one: 1, b: 'a' })],
];

const getCompileData = (): (string | ConstantNode)[][] => [
  // Booleans
  ['false', new ConstantNode(false)],
  ['true', new ConstantNode(true)],
  // Null
  ['null', new ConstantNode(null)],
  // Integers
  ['3', new ConstantNode(3)],
  ['-10', new ConstantNode(-10)],
  ['0', new ConstantNode(0)],
  // Floats
  ['3.3', new ConstantNode(3.3)],
  ['42', new ConstantNode(42.0)],
  ['-1.23', new ConstantNode(-1.23)],
  ['0.1', new ConstantNode(0.1)],
  ['1', new ConstantNode(1.0)],
  ['0.000001', new ConstantNode(1.0e-6)],
  ['123456789000000000000', new ConstantNode(1.23456789e20)],
  ['3.3', new ConstantNode(3.2999999999999998)],
  ['0.30000000000000004', new ConstantNode(0.1 + 0.2)],
  ['Infinity', new ConstantNode(Infinity)],
  ['-Infinity', new ConstantNode(-Infinity)],
  ['NaN', new ConstantNode(NaN)],
  // Strings
  ['"foo"', new ConstantNode('foo')],
  ['""', new ConstantNode('')],
  ['"a\\"b"', new ConstantNode('a"b')],
  // Arrays
  ['[]', new ConstantNode([])],
  // Objects
  ['{"one":1, "b":"a"}', new ConstantNode({ one: 1, b: 'a' })],
];

const getDumpData = (): (string | ConstantNode)[][] => [
  ['false', new ConstantNode(false)],
  ['true', new ConstantNode(true)],
  ['null', new ConstantNode(null)],
  ['3', new ConstantNode(3)],
  ['3.3', new ConstantNode(3.3)],
  ['"foo"', new ConstantNode('foo')],
  ['foo', new ConstantNode('foo', true)],
  ['{"one": 1}', new ConstantNode({ one: 1 })],
  ['{"one": 1, "c": true, "b": "a"}', new ConstantNode({ one: 1, c: true, b: 'a' })],
  ['["c", "d"]', new ConstantNode(['c', 'd'])],
  ['{"a": ["b"]}', new ConstantNode({ a: ['b'] })],
];

describe('ConstantNode ', () => {
  test('should evaluate correctly', () => {
    getEvaluateData().forEach(([expected, node]) => {
      expect((node as ConstantNode).evaluate()).toStrictEqual(expected);
    });
  });

  test('should compile correctly', () => {
    getCompileData().forEach(([expected, node]) => {
      const compiler = new Compiler({});
      (node as ConstantNode).compile(compiler);
      expect(compiler.getSource()).toBe(expected);
    });
  });

  test('should dump correctly', () => {
    getDumpData().forEach(([expected, node]) => {
      expect((node as ConstantNode).dump()).toBe(expected);
    });
  });
});

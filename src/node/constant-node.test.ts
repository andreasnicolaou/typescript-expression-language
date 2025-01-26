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
  ['false', new ConstantNode(false)],
  ['true', new ConstantNode(true)],
  ['null', new ConstantNode(null)],
  ['3', new ConstantNode(3)],
  ['3.3', new ConstantNode(3.3)],
  ['"foo"', new ConstantNode('foo')],
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

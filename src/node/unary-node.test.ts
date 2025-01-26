import { Compiler } from '../compiler';
import { ConstantNode } from './constant-node';
import { UnaryNode } from './unary-node';

const getEvaluateData = (): ((number | UnaryNode)[] | (boolean | UnaryNode)[])[] => {
  return [
    [-1, new UnaryNode('-', new ConstantNode(1))],
    [3, new UnaryNode('+', new ConstantNode(3))],
    [false, new UnaryNode('!', new ConstantNode(true))],
    [false, new UnaryNode('not', new ConstantNode(true))],
    [-6, new UnaryNode('~', new ConstantNode(5))],
  ];
};

const getCompileData = (): (string | UnaryNode)[][] => {
  return [
    ['(-1)', new UnaryNode('-', new ConstantNode(1))],
    ['(+3)', new UnaryNode('+', new ConstantNode(3))],
    ['(!true)', new UnaryNode('!', new ConstantNode(true))],
    ['(!true)', new UnaryNode('not', new ConstantNode(true))],
    ['(~5)', new UnaryNode('~', new ConstantNode(5))],
  ];
};

const getDumpData = (): (string | UnaryNode)[][] => {
  return [
    ['(- 1)', new UnaryNode('-', new ConstantNode(1))],
    ['(+ 3)', new UnaryNode('+', new ConstantNode(3))],
    ['(! true)', new UnaryNode('!', new ConstantNode(true))],
    ['(not true)', new UnaryNode('not', new ConstantNode(true))],
    ['(~ 5)', new UnaryNode('~', new ConstantNode(5))],
  ];
};

describe('UnaryNode', () => {
  test('should evaluate correctly', () => {
    getEvaluateData().forEach(([expected, node]) => {
      expect((node as UnaryNode).evaluate({}, {})).toEqual(expected);
    });
  });

  test('should compile correctly', () => {
    getCompileData().forEach(([expected, node]) => {
      const compiler = new Compiler({});
      (node as UnaryNode).compile(compiler);
      expect(compiler.getSource()).toBe(expected);
    });
  });

  test('should dump correctly', () => {
    getDumpData().forEach(([expected, node]) => {
      expect((node as UnaryNode).dump()).toBe(expected);
    });
  });
});

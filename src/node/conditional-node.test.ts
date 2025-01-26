import { ConditionalNode } from './conditional-node';
import { ConstantNode } from './constant-node';
import { Compiler } from '../compiler';

const getEvaluateData = (): (number | ConditionalNode)[][] => [
  [1, new ConditionalNode(new ConstantNode(true), new ConstantNode(1), new ConstantNode(2))],
  [2, new ConditionalNode(new ConstantNode(false), new ConstantNode(1), new ConstantNode(2))],
];

const getCompileData = (): (string | ConditionalNode)[][] => [
  ['((true) ? (1) : (2))', new ConditionalNode(new ConstantNode(true), new ConstantNode(1), new ConstantNode(2))],
  ['((false) ? (1) : (2))', new ConditionalNode(new ConstantNode(false), new ConstantNode(1), new ConstantNode(2))],
  [
    '((true) ? ("test") : ("fail"))',
    new ConditionalNode(new ConstantNode(true), new ConstantNode('test'), new ConstantNode('fail')),
  ],
  [
    '((false) ? ("test") : ("fail"))',
    new ConditionalNode(new ConstantNode(false), new ConstantNode('test'), new ConstantNode('fail')),
  ],
  [
    '((false) ? (null) : ("not-null"))',
    new ConditionalNode(new ConstantNode(false), new ConstantNode(null), new ConstantNode('not-null')),
  ],
  [
    '((false) ? ("") : ("defined"))',
    new ConditionalNode(new ConstantNode(false), new ConstantNode(undefined), new ConstantNode('defined')),
  ],
];

const getDumpData = (): (string | ConditionalNode)[][] => [
  ['(true ? 1 : 2)', new ConditionalNode(new ConstantNode(true), new ConstantNode(1), new ConstantNode(2))],
  ['(false ? 1 : 2)', new ConditionalNode(new ConstantNode(false), new ConstantNode(1), new ConstantNode(2))],
  ['(false ? 0 : 1)', new ConditionalNode(new ConstantNode(false), new ConstantNode(0), new ConstantNode(1))],
  [
    '(true ? "test" : "fail")',
    new ConditionalNode(new ConstantNode(true), new ConstantNode('test'), new ConstantNode('fail')),
  ],
  [
    '(false ? "test" : "fail")',
    new ConditionalNode(new ConstantNode(false), new ConstantNode('test'), new ConstantNode('fail')),
  ],
  [
    '(false ? null : "not-null")',
    new ConditionalNode(new ConstantNode(false), new ConstantNode(null), new ConstantNode('not-null')),
  ],
  [
    '(false ?  : "defined")',
    new ConditionalNode(new ConstantNode(false), new ConstantNode(undefined), new ConstantNode('defined')),
  ],
];

describe('ConditionalNode', () => {
  test('should evaluate correctly', () => {
    getEvaluateData().forEach(([expected, node]) => {
      expect((node as ConditionalNode).evaluate({}, {})).toEqual(expected);
    });
  });

  test('should compile correctly', () => {
    getCompileData().forEach(([expected, node]) => {
      const compiler = new Compiler({});
      (node as ConditionalNode).compile(compiler);
      expect(compiler.getSource()).toBe(expected);
    });
  });

  test('should dump correctly', () => {
    getDumpData().forEach(([expected, node]) => {
      expect((node as ConditionalNode).dump()).toBe(expected);
    });
  });
});

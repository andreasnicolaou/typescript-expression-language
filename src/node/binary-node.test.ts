import { Compiler } from '../compiler';
import { ArrayNode } from './array-node';
import { BinaryNode } from './binary-node';
import { ConstantNode } from './constant-node';

const generateNode = (): ArrayNode => {
  const array = new ArrayNode();
  array.addElement(new ConstantNode('a'));
  array.addElement(new ConstantNode('b'));
  return array;
};

const getEvaluateData = (): (
  | (boolean | BinaryNode)[]
  | (number | BinaryNode)[]
  | (string | BinaryNode)[]
  | (BinaryNode | number[])[]
)[] => {
  const array = generateNode();
  return [
    [true, new BinaryNode('or', new ConstantNode(true), new ConstantNode(false))],
    [true, new BinaryNode('||', new ConstantNode(true), new ConstantNode(false))],
    [false, new BinaryNode('and', new ConstantNode(true), new ConstantNode(false))],
    [false, new BinaryNode('&&', new ConstantNode(true), new ConstantNode(false))],
    [0, new BinaryNode('&', new ConstantNode(2), new ConstantNode(4))],
    [6, new BinaryNode('|', new ConstantNode(2), new ConstantNode(4))],
    [6, new BinaryNode('^', new ConstantNode(2), new ConstantNode(4))],
    [32, new BinaryNode('<<', new ConstantNode(2), new ConstantNode(4))],
    [2, new BinaryNode('>>', new ConstantNode(32), new ConstantNode(4))],
    [true, new BinaryNode('<', new ConstantNode(1), new ConstantNode(2))],
    [true, new BinaryNode('<=', new ConstantNode(1), new ConstantNode(2))],
    [true, new BinaryNode('<=', new ConstantNode(1), new ConstantNode(1))],
    [false, new BinaryNode('>', new ConstantNode(1), new ConstantNode(2))],
    [false, new BinaryNode('>=', new ConstantNode(1), new ConstantNode(2))],
    [true, new BinaryNode('>=', new ConstantNode(1), new ConstantNode(1))],
    [true, new BinaryNode('===', new ConstantNode(true), new ConstantNode(true))],
    [false, new BinaryNode('!==', new ConstantNode(true), new ConstantNode(true))],
    [false, new BinaryNode('==', new ConstantNode(2), new ConstantNode(1))],
    [true, new BinaryNode('!=', new ConstantNode(2), new ConstantNode(1))],
    [-1, new BinaryNode('-', new ConstantNode(1), new ConstantNode(2))],
    [3, new BinaryNode('+', new ConstantNode(1), new ConstantNode(2))],
    [4, new BinaryNode('*', new ConstantNode(2), new ConstantNode(2))],
    [1, new BinaryNode('/', new ConstantNode(2), new ConstantNode(2))],
    [1, new BinaryNode('%', new ConstantNode(5), new ConstantNode(2))],
    [25, new BinaryNode('**', new ConstantNode(5), new ConstantNode(2))],
    ['ab', new BinaryNode('~', new ConstantNode('a'), new ConstantNode('b'))],
    [true, new BinaryNode('in', new ConstantNode('a'), array)],
    [false, new BinaryNode('in', new ConstantNode('c'), array)],
    [true, new BinaryNode('not in', new ConstantNode('c'), array)],
    [false, new BinaryNode('not in', new ConstantNode('a'), array)],
    [[1, 2, 3], new BinaryNode('..', new ConstantNode(1), new ConstantNode(3))],
    [true, new BinaryNode('starts with', new ConstantNode('abc'), new ConstantNode('a'))],
    [false, new BinaryNode('starts with', new ConstantNode('abc'), new ConstantNode('b'))],
    [true, new BinaryNode('contains', new ConstantNode('abcd'), new ConstantNode('bc'))],
    [true, new BinaryNode('ends with', new ConstantNode('abc'), new ConstantNode('c'))],
    [false, new BinaryNode('ends with', new ConstantNode('abc'), new ConstantNode('b'))],
    [true, new BinaryNode('matches', new ConstantNode('abc'), new ConstantNode('/^[a-z]+$/'))],
    [false, new BinaryNode('matches', new ConstantNode(''), new ConstantNode('/^[a-z]+$/'))],
    [false, new BinaryNode('matches', new ConstantNode(null), new ConstantNode('/^[a-z]+$/'))],
  ];
};

const getDumpData = (): (string | BinaryNode)[][] => {
  const array = generateNode();
  return [
    ['(true or false)', new BinaryNode('or', new ConstantNode(true), new ConstantNode(false))],
    ['(true || false)', new BinaryNode('||', new ConstantNode(true), new ConstantNode(false))],
    ['(true and false)', new BinaryNode('and', new ConstantNode(true), new ConstantNode(false))],
    ['(true && false)', new BinaryNode('&&', new ConstantNode(true), new ConstantNode(false))],
    ['(2 & 4)', new BinaryNode('&', new ConstantNode(2), new ConstantNode(4))],
    ['(2 | 4)', new BinaryNode('|', new ConstantNode(2), new ConstantNode(4))],
    ['(2 ^ 4)', new BinaryNode('^', new ConstantNode(2), new ConstantNode(4))],
    ['(1 < 2)', new BinaryNode('<', new ConstantNode(1), new ConstantNode(2))],
    ['(1 <= 2)', new BinaryNode('<=', new ConstantNode(1), new ConstantNode(2))],
    ['(1 <= 1)', new BinaryNode('<=', new ConstantNode(1), new ConstantNode(1))],
    ['(1 > 2)', new BinaryNode('>', new ConstantNode(1), new ConstantNode(2))],
    ['(1 >= 2)', new BinaryNode('>=', new ConstantNode(1), new ConstantNode(2))],
    ['(1 >= 1)', new BinaryNode('>=', new ConstantNode(1), new ConstantNode(1))],
    ['(true === true)', new BinaryNode('===', new ConstantNode(true), new ConstantNode(true))],
    ['(true !== true)', new BinaryNode('!==', new ConstantNode(true), new ConstantNode(true))],
    ['(2 == 1)', new BinaryNode('==', new ConstantNode(2), new ConstantNode(1))],
    ['(2 != 1)', new BinaryNode('!=', new ConstantNode(2), new ConstantNode(1))],
    ['(1 - 2)', new BinaryNode('-', new ConstantNode(1), new ConstantNode(2))],
    ['(1 + 2)', new BinaryNode('+', new ConstantNode(1), new ConstantNode(2))],
    ['(2 * 2)', new BinaryNode('*', new ConstantNode(2), new ConstantNode(2))],
    ['(2 / 2)', new BinaryNode('/', new ConstantNode(2), new ConstantNode(2))],
    ['(5 % 2)', new BinaryNode('%', new ConstantNode(5), new ConstantNode(2))],
    ['(5 ** 2)', new BinaryNode('**', new ConstantNode(5), new ConstantNode(2))],
    ['("a" ~ "b")', new BinaryNode('~', new ConstantNode('a'), new ConstantNode('b'))],
    ['("a" in ["a", "b"])', new BinaryNode('in', new ConstantNode('a'), array)],
    ['("c" in ["a", "b"])', new BinaryNode('in', new ConstantNode('c'), array)],
    ['("c" not in ["a", "b"])', new BinaryNode('not in', new ConstantNode('c'), array)],
    ['("a" not in ["a", "b"])', new BinaryNode('not in', new ConstantNode('a'), array)],
    ['(1 .. 3)', new BinaryNode('..', new ConstantNode(1), new ConstantNode(3))],
    [
      '("abc" matches "/^[a-z]+/i$/")',
      new BinaryNode('matches', new ConstantNode('abc'), new ConstantNode('/^[a-z]+/i$/')),
    ],
    ['("abcd" contains "bc")', new BinaryNode('contains', new ConstantNode('abcd'), new ConstantNode('bc', false))],
    ['("abcd" starts with "a")', new BinaryNode('starts with', new ConstantNode('abcd'), new ConstantNode('a', false))],
    ['("abcd" ends with "d")', new BinaryNode('ends with', new ConstantNode('abcd'), new ConstantNode('d', false))],
  ];
};

const getCompileData = (): (string | BinaryNode)[][] => {
  const array = generateNode();
  return [
    ['(true || false)', new BinaryNode('or', new ConstantNode(true), new ConstantNode(false))],
    ['(true || false)', new BinaryNode('||', new ConstantNode(true), new ConstantNode(false))],
    ['(true && false)', new BinaryNode('and', new ConstantNode(true), new ConstantNode(false))],
    ['(true && false)', new BinaryNode('&&', new ConstantNode(true), new ConstantNode(false))],
    ['(2 & 4)', new BinaryNode('&', new ConstantNode(2), new ConstantNode(4))],
    ['(2 | 4)', new BinaryNode('|', new ConstantNode(2), new ConstantNode(4))],
    ['(2 ^ 4)', new BinaryNode('^', new ConstantNode(2), new ConstantNode(4))],
    ['(2 << 4)', new BinaryNode('<<', new ConstantNode(2), new ConstantNode(4))],
    ['(32 >> 4)', new BinaryNode('>>', new ConstantNode(32), new ConstantNode(4))],
    ['(1 < 2)', new BinaryNode('<', new ConstantNode(1), new ConstantNode(2))],
    ['(1 <= 2)', new BinaryNode('<=', new ConstantNode(1), new ConstantNode(2))],
    ['(1 <= 1)', new BinaryNode('<=', new ConstantNode(1), new ConstantNode(1))],
    ['(1 > 2)', new BinaryNode('>', new ConstantNode(1), new ConstantNode(2))],
    ['(1 >= 2)', new BinaryNode('>=', new ConstantNode(1), new ConstantNode(2))],
    ['(1 >= 1)', new BinaryNode('>=', new ConstantNode(1), new ConstantNode(1))],
    ['(true === true)', new BinaryNode('===', new ConstantNode(true), new ConstantNode(true))],
    ['(true !== true)', new BinaryNode('!==', new ConstantNode(true), new ConstantNode(true))],
    ['(2 == 1)', new BinaryNode('==', new ConstantNode(2), new ConstantNode(1))],
    ['(2 != 1)', new BinaryNode('!=', new ConstantNode(2), new ConstantNode(1))],
    ['(1 - 2)', new BinaryNode('-', new ConstantNode(1), new ConstantNode(2))],
    ['(1 + 2)', new BinaryNode('+', new ConstantNode(1), new ConstantNode(2))],
    ['(2 * 2)', new BinaryNode('*', new ConstantNode(2), new ConstantNode(2))],
    ['(2 / 2)', new BinaryNode('/', new ConstantNode(2), new ConstantNode(2))],
    ['(5 % 2)', new BinaryNode('%', new ConstantNode(5), new ConstantNode(2))],
    ['pow(5, 2)', new BinaryNode('**', new ConstantNode(5), new ConstantNode(2))],
    ['("a" . "b")', new BinaryNode('~', new ConstantNode('a'), new ConstantNode('b'))],
    ['inArray("a", ["a", "b"])', new BinaryNode('in', new ConstantNode('a'), array)],
    ['inArray("c", ["a", "b"])', new BinaryNode('in', new ConstantNode('c'), array)],
    ['notInArray("c", ["a", "b"])', new BinaryNode('not in', new ConstantNode('c'), array)],
    ['notInArray("a", ["a", "b"])', new BinaryNode('not in', new ConstantNode('a'), array)],
    ['range(1, 3)', new BinaryNode('..', new ConstantNode(1), new ConstantNode(3))],
    [
      '(function (regexp, str) { try { if (regexp.startsWith("/") && regexp.endsWith("/")) { regexp = regexp.slice(1, -1); } return new RegExp(regexp).test(str ?? ""); } catch () { throw new SyntaxError(\'Invalid regex passed to "matches".\'); } })("/^[a-z]+$/", "abc")',
      new BinaryNode('matches', new ConstantNode('abc'), new ConstantNode('/^[a-z]+$/')),
    ],
    ['strStartsWith("abc", "a")', new BinaryNode('starts with', new ConstantNode('abc'), new ConstantNode('a'))],
    ['strEndsWith("abc", "c")', new BinaryNode('ends with', new ConstantNode('abc'), new ConstantNode('c'))],
    ['strContains("a", "b")', new BinaryNode('contains', new ConstantNode('a'), new ConstantNode('b'))],
  ];
};

describe('BinaryNode', () => {
  test('should evaluate node correctly', () => {
    getEvaluateData().forEach(([expected, node]) => {
      expect((node as BinaryNode).evaluate({}, {})).toEqual(expected);
    });
  });

  test('should compile node correctly', () => {
    getCompileData().forEach(([expected, node]) => {
      const compiler = new Compiler({});
      (node as BinaryNode).compile(compiler);
      expect(compiler.getSource()).toEqual(expected);
    });
  });

  test('should dump node correctly', () => {
    getDumpData().forEach(([expected, node]) => {
      expect((node as BinaryNode).dump()).toEqual(expected);
    });
  });
});

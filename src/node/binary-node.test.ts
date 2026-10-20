import { Compiler } from '../compiler';
import { SyntaxError } from '../syntax-error';
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
  (boolean | BinaryNode)[] | (number | BinaryNode)[] | (string | BinaryNode)[] | (BinaryNode | number[])[]
)[] => {
  const array = generateNode();
  return [
    [true, new BinaryNode('or', new ConstantNode(true), new ConstantNode(false))],
    [true, new BinaryNode('||', new ConstantNode(true), new ConstantNode(false))],
    [false, new BinaryNode('xor', new ConstantNode(true), new ConstantNode(true))],
    [true, new BinaryNode('xor', new ConstantNode(true), new ConstantNode(false))],
    [true, new BinaryNode('xor', new ConstantNode(false), new ConstantNode(true))],
    [false, new BinaryNode('xor', new ConstantNode(false), new ConstantNode(false))],
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
    [false, new BinaryNode('matches', new ConstantNode(null), new ConstantNode('^[a-z]+$'))],
    [true, new BinaryNode('matches', new ConstantNode('ABC'), new ConstantNode('/^[a-z]+$/i'))],
    [false, new BinaryNode('matches', new ConstantNode('ABC'), new ConstantNode('/^[a-z]+$/'))],
  ];
};

const getDumpData = (): (string | BinaryNode)[][] => {
  const array = generateNode();
  return [
    ['(true or false)', new BinaryNode('or', new ConstantNode(true), new ConstantNode(false))],
    ['(true || false)', new BinaryNode('||', new ConstantNode(true), new ConstantNode(false))],
    ['(true xor true)', new BinaryNode('xor', new ConstantNode(true), new ConstantNode(true))],
    ['(true xor false)', new BinaryNode('xor', new ConstantNode(true), new ConstantNode(false))],
    ['(false xor true)', new BinaryNode('xor', new ConstantNode(false), new ConstantNode(true))],
    ['(false xor false)', new BinaryNode('xor', new ConstantNode(false), new ConstantNode(false))],
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
    ['(true xor true)', new BinaryNode('xor', new ConstantNode(true), new ConstantNode(true))],
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
      String.raw`(function (regexp, str) { try { var m = /^\/(.+)\/([a-z]*)$/.exec(regexp); if (m) { return new RegExp(m[1], m[2]).test(str ?? ""); } return new RegExp(regexp).test(str ?? ""); } catch (e) { throw new SyntaxError('Invalid regex passed to "matches".'); } })("/^[a-z]+$/", "abc")`,
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

  test('should evaluate fallback or/and operator branches', () => {
    // fallback 'or' branch: left is truthy, right should not be evaluated
    const orNode = new BinaryNode('or', new ConstantNode(true), new ConstantNode(false));
    expect(orNode.evaluate({}, {})).toBe(true);
    // fallback 'or' branch: left is falsy, right should be evaluated
    const orNode2 = new BinaryNode('or', new ConstantNode(false), new ConstantNode(true));
    expect(orNode2.evaluate({}, {})).toBe(true);
    // fallback 'and' branch: left is truthy, right should be evaluated
    const andNode = new BinaryNode('and', new ConstantNode(true), new ConstantNode(true));
    expect(andNode.evaluate({}, {})).toBe(true);
    // fallback 'and' branch: left is falsy, right should not be evaluated
    const andNode2 = new BinaryNode('and', new ConstantNode(false), new ConstantNode(true));
    expect(andNode2.evaluate({}, {})).toBe(false);
  });

  test('should throw SyntaxError for matches with invalid regex', () => {
    const node = new BinaryNode('matches', new ConstantNode('abc'), new ConstantNode('/[invalid['));
    expect(() => node.evaluate({}, {})).toThrow(SyntaxError);
  });

  test('should throw SyntaxError for matches with wrong node type', () => {
    const right = new BinaryNode('+', new ConstantNode(1), new ConstantNode(2));
    const node = new BinaryNode('matches', new ConstantNode('abc'), right);
    // right operator is not '~', should throw
    expect(() => node.compile(new Compiler({}))).toThrow(SyntaxError);
  });

  test('should allow matches with BinaryNode when operator is ~', () => {
    const right = new BinaryNode('~', new ConstantNode('pattern'), new ConstantNode('flags'));
    const node = new BinaryNode('matches', new ConstantNode('abc'), right);
    const compiler = new Compiler({});
    expect(() => node.compile(compiler)).not.toThrow();
    expect(compiler.getSource()).toContain('matches');
  });

  test('should throw Error for division by zero', () => {
    const node = new BinaryNode('/', new ConstantNode(1), new ConstantNode(0));
    expect(() => node.evaluate({}, {})).toThrow('Division by zero.');
  });

  test('should throw Error for modulo by zero', () => {
    const node = new BinaryNode('%', new ConstantNode(1), new ConstantNode(0));
    expect(() => node.evaluate({}, {})).toThrow('Modulo by zero.');
  });

  test('should throw Error for unsupported operator', () => {
    const node = new BinaryNode('unsupported', new ConstantNode(1), new ConstantNode(2));
    expect(() => node.evaluate({}, {})).toThrow('Operator "unsupported" not supported.');
  });

  test('should evaluate logical or in fallback switch', () => {
    const node = new BinaryNode('||', new ConstantNode(false), new ConstantNode(true));
    expect(node.evaluate({}, {})).toBe(true);
  });

  test('should evaluate logical and in fallback switch', () => {
    const node = new BinaryNode('&&', new ConstantNode(true), new ConstantNode(true));
    expect(node.evaluate({}, {})).toBe(true);
  });

  test('should throw Error for unsupported function operator', () => {
    // Patch FUNCTIONS to simulate bad operator
    const node = new BinaryNode('placeholderFunc', new ConstantNode(1), new ConstantNode(2));
    BinaryNode['FUNCTIONS']['placeholderFunc'] = 'notAFunction';
    expect(() => node.evaluate({}, {})).toThrow('Unsupported function operator: placeholderFunc');
    delete BinaryNode['FUNCTIONS']['placeholderFunc'];
  });

  test('should evaluate strContains, strStartsWith, strEndsWith', () => {
    const contains = new BinaryNode('contains', new ConstantNode('hello world'), new ConstantNode('world'));
    expect(contains.evaluate({}, {})).toBe(true);
    const startsWith = new BinaryNode('starts with', new ConstantNode('hello world'), new ConstantNode('hello'));
    expect(startsWith.evaluate({}, {})).toBe(true);
    const endsWith = new BinaryNode('ends with', new ConstantNode('hello world'), new ConstantNode('world'));
    expect(endsWith.evaluate({}, {})).toBe(true);
  });
});

describe('BinaryNode range operator', () => {
  const range = (start: unknown, end: unknown): unknown =>
    new BinaryNode('..', new ConstantNode(start), new ConstantNode(end)).evaluate({}, {});

  test.each([
    [1, 3, [1, 2, 3]],
    [3, 1, [3, 2, 1]],
    ['1', '3', [1, 2, 3]],
    ['3', '1', [3, 2, 1]],
    ['a', 'c', ['a', 'b', 'c']],
    ['c', 'a', ['c', 'b', 'a']],
    ['abc', 'c', ['a', 'b', 'c']],
    [0, 0, [0]],
    [1.5, 4, [1.5, 2.5, 3.5]],
    [-1, 1, [-1, 0, 1]],
    [0, 12, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
    ['a', 'i', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']],
    ['c', 'a', ['c', 'b', 'a']],
    [' 1', '3 ', [1, 2, 3]],
    ['+1', '-1', [1, 0, -1]],
    ['.5', '2.', [0.5, 1.5]],
    ['1e1', '12', [10, 11, 12]],
  ])('should build %p..%p like PHP range()', (start, end, expected) => {
    expect(range(start, end)).toEqual(expected);
  });

  // PHP does not read these as numeric strings, so they are character ranges over the first character
  test.each([
    ['0x1', '0x3', ['0']],
    ['0b1', '0b11', ['0']],
    ['0o7', '0o1', ['0']],
    ['1e', '3', ['1', '2', '3']],
    ['Infinity', 'K', ['I', 'J', 'K']],
    ['1_0', '3', ['1', '2', '3']],
  ])('should treat %p..%p as characters, not numbers', (start, end, expected) => {
    expect(range(start, end)).toEqual(expected);
  });

  test('should refuse a range larger than MAX_RANGE_LENGTH instead of allocating it', () => {
    expect(() => range(0, BinaryNode.MAX_RANGE_LENGTH)).toThrow(RangeError);
    expect(() => range('a', BinaryNode.MAX_RANGE_LENGTH)).toThrow(TypeError);
    expect(range(1, BinaryNode.MAX_RANGE_LENGTH)).toHaveLength(BinaryNode.MAX_RANGE_LENGTH);
  });

  test('should terminate for endpoints that a unit step cannot advance', () => {
    expect(range(1e20, 1e20)).toEqual([1e20]);
    expect(range(1e20, 1e20 + 1)).toEqual([1e20]);
  });

  test.each([
    [Infinity, Infinity],
    [1, Infinity],
    [NaN, 1],
    [null, 3],
    [1, true],
    [1, 'a'],
    ['', 'c'],
    [1, [1]],
  ])('should throw a TypeError for %p..%p', (start, end) => {
    expect(() => range(start, end)).toThrow(TypeError);
  });
});

describe('BinaryNode in operator', () => {
  const hash = (): ArrayNode => {
    const node = new ArrayNode();
    node.addElement(new ConstantNode(1), new ConstantNode('a'));
    node.addElement(new ConstantNode(2), new ConstantNode('b'));
    return node;
  };

  test('should look through the values of a hash like PHP in_array()', () => {
    expect(new BinaryNode('in', new ConstantNode(1), hash()).evaluate({}, {})).toBe(true);
    expect(new BinaryNode('in', new ConstantNode('a'), hash()).evaluate({}, {})).toBe(false);
    expect(new BinaryNode('not in', new ConstantNode(3), hash()).evaluate({}, {})).toBe(true);
  });

  // the examples of https://locutus.io/php/in_array/; Symfony always passes strict = true, so the loose example
  // in_array(1, ['1', '2', '3']) is not reachable and its strict counterpart gives false
  test.each([
    ['van', ['Kevin', 'van', 'Zonneveld'], true],
    ['vlado', { 0: 'Kevin', vlado: 'van', 1: 'Zonneveld' }, false],
    [1, ['1', '2', '3'], false],
  ])('should evaluate %p in %p as PHP in_array($needle, $haystack, true)', (needle, haystack, expected) => {
    expect(new BinaryNode('in', new ConstantNode(needle), new ConstantNode(haystack)).evaluate({}, {})).toBe(expected);
    expect(new BinaryNode('not in', new ConstantNode(needle), new ConstantNode(haystack)).evaluate({}, {})).toBe(
      !expected
    );
  });

  test('should search own values only', () => {
    const inherited = Object.assign(Object.create({ inherited: 7 }), { own: 1 });
    expect(new BinaryNode('in', new ConstantNode(7), new ConstantNode(inherited)).evaluate({}, {})).toBe(false);
    expect(new BinaryNode('in', new ConstantNode(1), new ConstantNode(inherited)).evaluate({}, {})).toBe(true);
  });

  test.each([null, 'abc', 5, true])('should throw a TypeError for "in" and "not in" on %p', (haystack) => {
    expect(() => new BinaryNode('in', new ConstantNode(1), new ConstantNode(haystack)).evaluate({}, {})).toThrow(
      TypeError
    );
    expect(() => new BinaryNode('not in', new ConstantNode(1), new ConstantNode(haystack)).evaluate({}, {})).toThrow(
      TypeError
    );
  });
});

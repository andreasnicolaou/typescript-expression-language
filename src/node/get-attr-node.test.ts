/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { ArrayNode } from './array-node';
import { ConstantNode } from './constant-node';
import { GetAttrNode } from './get-attr-node';
import { NameNode } from './name-node';
import { ArgumentsNode } from './arguments-node';

type TestData = string | GetAttrNode | Record<string, any>;

class Obj {
  foo = 'bar';
  fooMethod = (): string => {
    return 'baz';
  };
}

const generateNode = (): ArrayNode => {
  const array = new ArrayNode();
  array.addElement(new ConstantNode('a'), new ConstantNode('b'));
  array.addElement(new ConstantNode('b'));
  return array;
};

const getEvaluateData = (): TestData[][] => [
  [
    'b',
    new GetAttrNode(new NameNode('foo'), new ConstantNode(0), generateNode(), GetAttrNode.ARRAY_CALL),
    { foo: { b: 'a', 0: 'b' } },
  ],
  [
    'a',
    new GetAttrNode(new NameNode('foo'), new ConstantNode('b'), generateNode(), GetAttrNode.ARRAY_CALL),
    { foo: { b: 'a', 0: 'b' } },
  ],
  [
    'bar',
    new GetAttrNode(new NameNode('foo'), new ConstantNode('foo'), generateNode(), GetAttrNode.PROPERTY_CALL),
    { foo: new Obj() },
  ],
  [
    'baz',
    new GetAttrNode(new NameNode('foo'), new ConstantNode('fooMethod'), generateNode(), GetAttrNode.METHOD_CALL),
    { foo: new Obj() },
  ],
  [
    'a',
    new GetAttrNode(new NameNode('foo'), new NameNode('index'), generateNode(), GetAttrNode.ARRAY_CALL),
    { foo: { b: 'a', 0: 'b' }, index: 'b' },
  ],
];

const getCompileData = (): TestData[][] => [
  ['foo[0]', new GetAttrNode(new NameNode('foo'), new ConstantNode(0), generateNode(), GetAttrNode.ARRAY_CALL)],
  ['foo["b"]', new GetAttrNode(new NameNode('foo'), new ConstantNode('b'), generateNode(), GetAttrNode.ARRAY_CALL)],
  ['foo.foo', new GetAttrNode(new NameNode('foo'), new ConstantNode('foo'), generateNode(), GetAttrNode.PROPERTY_CALL)],
  [
    'foo.fooMethod({"b": "a", 0: "b"})',
    new GetAttrNode(new NameNode('foo'), new ConstantNode('fooMethod'), generateNode(), GetAttrNode.METHOD_CALL),
    { foo: new Obj() },
  ],
  ['foo[index]', new GetAttrNode(new NameNode('foo'), new NameNode('index'), generateNode(), GetAttrNode.ARRAY_CALL)],
];

const getDumpData = (): TestData[][] => [
  ['foo[0]', new GetAttrNode(new NameNode('foo'), new ConstantNode(0), generateNode(), GetAttrNode.ARRAY_CALL)],
  ['foo["b"]', new GetAttrNode(new NameNode('foo'), new ConstantNode('b'), generateNode(), GetAttrNode.ARRAY_CALL)],
  ['foo.foo', new GetAttrNode(new NameNode('foo'), new NameNode('foo'), generateNode(), GetAttrNode.PROPERTY_CALL)],
  [
    'foo.fooMethod({"0": "b", "b": "a"})',
    new GetAttrNode(new NameNode('foo'), new NameNode('fooMethod'), generateNode(), GetAttrNode.METHOD_CALL),
    { foo: new Obj() },
  ],
  ['foo[index]', new GetAttrNode(new NameNode('foo'), new NameNode('index'), generateNode(), GetAttrNode.ARRAY_CALL)],
  [
    'foo?.foo()',
    new GetAttrNode(
      new NameNode('foo'),
      new ConstantNode('foo', true, true),
      new ArgumentsNode(),
      GetAttrNode.METHOD_CALL
    ),
  ],
];

describe('GetAttrNode', () => {
  test('should evaluate node correctly', () => {
    getEvaluateData().forEach(([expected, node, context, functions]) => {
      const evaluated = (node as GetAttrNode).evaluate(
        (functions as Record<string, any>) || Object.create(Object.prototype),
        context as Record<string, any>
      );
      expect(evaluated).toBe(expected);
    });
  });

  test('should compile node correctly', () => {
    getCompileData().forEach(([expected, node]) => {
      const compiler = new Compiler({});
      (node as GetAttrNode).compile(compiler);
      expect(compiler.getSource()).toBe(expected);
    });
  });

  test('should dump node correctly', () => {
    getDumpData().forEach(([expected, node]) => {
      expect((node as GetAttrNode).dump()).toBe(expected);
    });
  });

  test('should return empty array for toArray with unknown type', () => {
    const node = new GetAttrNode(new ConstantNode('foo'), new ConstantNode('bar'), new ArgumentsNode(), 999);
    expect(node.toArray()).toEqual([]);
  });

  test('should return null for PROPERTY_CALL with null and isShortCircuited', () => {
    const node = new GetAttrNode(
      new ConstantNode(null),
      new ConstantNode('foo'),
      new ArgumentsNode(),
      GetAttrNode.PROPERTY_CALL
    );
    node.attributes.is_short_circuited = true;
    expect(node.evaluate({}, {})).toBeNull();
  });

  test('should return null for METHOD_CALL with null and isShortCircuited', () => {
    const node = new GetAttrNode(
      new ConstantNode(null),
      new ConstantNode('fooMethod'),
      new ArgumentsNode(),
      GetAttrNode.METHOD_CALL
    );
    node.attributes.is_short_circuited = true;
    expect(node.evaluate({}, {})).toBeNull();
  });

  test('should return null for ARRAY_CALL with null and isShortCircuited', () => {
    const node = new GetAttrNode(
      new ConstantNode(null),
      new ConstantNode('foo'),
      new ArgumentsNode(),
      GetAttrNode.ARRAY_CALL
    );
    node.attributes.is_short_circuited = true;
    expect(node.evaluate({}, {})).toBeNull();
  });
  test('should return null for PROPERTY_CALL with null and nullSafe', () => {
    const node = new GetAttrNode(
      new ConstantNode(null),
      new ConstantNode('foo', true, true),
      new ArgumentsNode(),
      GetAttrNode.PROPERTY_CALL
    );
    expect(node.evaluate({}, {})).toBeNull();
  });

  test('should return null for PROPERTY_CALL with null and is_null_coalesce', () => {
    const node = new GetAttrNode(
      new ConstantNode(null),
      new ConstantNode('foo'),
      new ArgumentsNode(),
      GetAttrNode.PROPERTY_CALL
    );
    node.attributes.is_null_coalesce = true;
    expect(node.evaluate({}, {})).toBeNull();
  });

  test('should throw for PROPERTY_CALL with non-object', () => {
    const node = new GetAttrNode(
      new ConstantNode(42),
      new ConstantNode('foo'),
      new ArgumentsNode(),
      GetAttrNode.PROPERTY_CALL
    );
    expect(() => node.evaluate({}, {})).toThrow(/Unable to get property/);
  });

  test('should return null for METHOD_CALL with null and nullSafe', () => {
    const node = new GetAttrNode(
      new ConstantNode(null),
      new ConstantNode('fooMethod', true, true),
      new ArgumentsNode(),
      GetAttrNode.METHOD_CALL
    );
    expect(node.evaluate({}, {})).toBeNull();
  });

  test('should throw for METHOD_CALL with non-object', () => {
    const node = new GetAttrNode(
      new ConstantNode(42),
      new ConstantNode('fooMethod'),
      new ArgumentsNode(),
      GetAttrNode.METHOD_CALL
    );
    expect(() => node.evaluate({}, {})).toThrow(/Unable to call method/);
  });

  test('should throw for METHOD_CALL with non-function property', () => {
    const obj = { fooMethod: 123 };
    const node = new GetAttrNode(
      new ConstantNode(obj),
      new ConstantNode('fooMethod'),
      new ArgumentsNode(),
      GetAttrNode.METHOD_CALL
    );
    expect(() => node.evaluate({}, {})).toThrow(/Unable to call method/);
  });

  test('should return null for ARRAY_CALL with null and isShortCircuited', () => {
    const node = new GetAttrNode(
      new ConstantNode(null),
      new ConstantNode('foo'),
      new ArgumentsNode(),
      GetAttrNode.ARRAY_CALL
    );
    node.attributes.is_short_circuited = true;
    expect(node.evaluate({}, {})).toBeNull();
  });

  test('should throw for ARRAY_CALL with non-array', () => {
    const node = new GetAttrNode(
      new ConstantNode(42),
      new ConstantNode('foo'),
      new ArgumentsNode(),
      GetAttrNode.ARRAY_CALL
    );
    expect(() => node.evaluate({}, {})).toThrow(/Unable to get an item of non-array/);
  });

  test('should return null for ARRAY_CALL with is_null_coalesce and missing key', () => {
    const arr = { a: 1 };
    const node = new GetAttrNode(
      new ConstantNode(arr),
      new ConstantNode('missing'),
      new ArgumentsNode(),
      GetAttrNode.ARRAY_CALL
    );
    node.attributes.is_null_coalesce = true;
    expect(node.evaluate({}, {})).toBeNull();
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { ArrayNode } from './array-node';
import { ConstantNode } from './constant-node';
import { GetAttrNode } from './get-attr-node';
import { NameNode } from './name-node';

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

const getEvaluateData = (): (string | GetAttrNode | Record<string, any>)[][] => [
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

const getCompileData = (): (string | GetAttrNode | Record<string, any>)[][] => [
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

const getDumpData = (): (string | GetAttrNode | Record<string, any>)[][] => [
  ['foo[0]', new GetAttrNode(new NameNode('foo'), new ConstantNode(0), generateNode(), GetAttrNode.ARRAY_CALL)],
  ['foo["b"]', new GetAttrNode(new NameNode('foo'), new ConstantNode('b'), generateNode(), GetAttrNode.ARRAY_CALL)],
  ['foo.foo', new GetAttrNode(new NameNode('foo'), new NameNode('foo'), generateNode(), GetAttrNode.PROPERTY_CALL)],
  [
    'foo.fooMethod({"0": "b", "b": "a"})',
    new GetAttrNode(new NameNode('foo'), new NameNode('fooMethod'), generateNode(), GetAttrNode.METHOD_CALL),
    { foo: new Obj() },
  ],
  ['foo[index]', new GetAttrNode(new NameNode('foo'), new NameNode('index'), generateNode(), GetAttrNode.ARRAY_CALL)],
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
});

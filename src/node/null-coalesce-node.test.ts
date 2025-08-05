/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { ArrayNode } from './array-node';
import { ConstantNode } from './constant-node';
import { GetAttrNode } from './get-attr-node';
import { NameNode } from './name-node';
import { NullCoalesceNode } from './null-coalesce-node';

const getEvaluateData = (): (Record<string, any>[] | (Record<string, any> | null | string)[])[] => [
  ['default', new NullCoalesceNode(new ConstantNode(undefined), new ConstantNode('default')), {}],
  ['bar', new NullCoalesceNode(new ConstantNode('bar'), new ConstantNode('default')), {}],
  ['default', new NullCoalesceNode(new ConstantNode(undefined), new ConstantNode('default')), {}],
  [null, new NullCoalesceNode(new ConstantNode(undefined), new ConstantNode(null)), {}],
];

const getCompileData = (): (string | NullCoalesceNode)[][] => [
  ['(("") ?? ("default"))', new NullCoalesceNode(new ConstantNode(undefined), new ConstantNode('default'))],
  ['(("bar") ?? ("default"))', new NullCoalesceNode(new ConstantNode('bar'), new ConstantNode('default'))],
];

const getDumpData = (): (string | NullCoalesceNode)[][] => [
  ['() ?? ("default")', new NullCoalesceNode(new ConstantNode(undefined), new ConstantNode('default'))],
  ['("bar") ?? ("default")', new NullCoalesceNode(new ConstantNode('bar'), new ConstantNode('default'))],
];

const getNodeForAttr = (): NullCoalesceNode => {
  const node = new NameNode('foo');
  const attribute = new ConstantNode('bar');
  const argumentsNode = new ArrayNode();
  const type = GetAttrNode.PROPERTY_CALL;
  return new NullCoalesceNode(new GetAttrNode(node, attribute, argumentsNode, type), new ConstantNode('default'));
};

describe('NullCoalesceNode', () => {
  test('should evaluate correctly', () => {
    getEvaluateData().forEach(([expected, node, values]) => {
      expect((node as NullCoalesceNode).evaluate({}, values as Record<string, any>)).toEqual(expected);
    });
  });

  test('should compile correctly', () => {
    getCompileData().forEach(([expected, node]) => {
      const compiler = new Compiler({});
      (node as NullCoalesceNode).compile(compiler);
      expect(compiler.getSource()).toBe(expected);
    });
  });

  test('should dump correctly', () => {
    getDumpData().forEach(([expected, node]) => {
      expect((node as NullCoalesceNode).dump()).toBe(expected);
    });
  });

  test('should handle GetAttrNode in null coalescing', () => {
    const node = getNodeForAttr();
    const compiler = new Compiler({});
    node.compile(compiler);
    expect(compiler.getSource()).toBe('((foo.bar) ?? ("default"))');
    expect(node.evaluate({}, { foo: { bar: null } })).toBe('default');
  });

  test('should add null coalesce attribute to GetAttrNode', () => {
    const node = getNodeForAttr();
    const getAttrNode = node.nodes.expr1 as GetAttrNode;
    node.evaluate({}, { foo: { bar: null } });
    expect(getAttrNode.attributes['is_null_coalesce']).toBe(true);
  });
});

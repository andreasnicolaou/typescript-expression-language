import { Node } from './node';
import { ConstantNode } from './constant-node'; // Adjust import path as needed
import { Compiler } from '../compiler';

describe('NodeTest', () => {
  test('shoue expect same toString', () => {
    const node = new Node({ child: new ConstantNode('foo') });

    const expectedOutput = `Node(
    ConstantNode(value: 'foo')
)`;
    expect(node.toString()).toBe(expectedOutput);
  });

  test('should serialize correctly', () => {
    const node = new Node({ foo: new ConstantNode('bar') }, { bar: 'foo' });
    const serializedNode = JSON.stringify(node);
    const unserializedNode = Object.assign(new Node(), JSON.parse(serializedNode));
    expect(unserializedNode).toEqual(node);
  });

  test('should evaluate all nodes correctly', () => {
    const nodes = {
      child1: new ConstantNode(1),
      child2: new ConstantNode(2),
      child3: new ConstantNode(3),
    };
    for (const [key, node] of Object.entries(nodes)) {
      jest.spyOn(node, 'evaluate').mockReturnValue(parseInt(key.replace('child', ''), 10));
    }
    const rootNode = new Node(nodes);
    const result = rootNode.evaluate({}, {});
    expect(result).toEqual([1, 2, 3]);
    for (const node of Object.values(nodes)) {
      expect(node.evaluate).toHaveBeenCalledWith({}, {});
    }
  });

  test('should throw error for toArray on base Node', () => {
    const node = new Node();
    expect(() => node.toArray()).toThrow('Dumping a "Node" instance is not supported yet.');
  });

  test('should detect hash and non-hash arrays with isHash', () => {
    const node = new Node();
    // Sequential keys (not a hash)
    expect(node['isHash']({ 0: 'a', 1: 'b', 2: 'c' })).toBe(false);
    // Non-sequential keys (is a hash)
    expect(node['isHash']({ 0: 'a', 2: 'b' })).toBe(true);
    // String keys (is a hash)
    expect(node['isHash']({ foo: 'bar', 0: 'baz' })).toBe(true);
    // Empty object (not a hash)
    expect(node['isHash']({})).toBe(false);
  });

  test('should call compile on all child nodes', () => {
    const child = new Node();
    const parent = new Node({ child });
    const spy = jest.spyOn(child, 'compile');
    const compiler = new Compiler({});
    parent.compile(compiler);
    expect(spy).toHaveBeenCalledWith(compiler);
  });
});

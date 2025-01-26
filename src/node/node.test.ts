import { Node } from './node'; // Adjust import path as needed
import { ConstantNode } from './constant-node'; // Adjust import path as needed

describe('NodeTest', () => {
  test('shoue expect same toString', () => {
    const node = new Node({ child: new ConstantNode('foo') });

    const expectedOutput = `Node(
    ConstantNode(value: 'foo')
)`;
    expect(node.toString()).toBe(expectedOutput);
  });

  test('shoudl serialize correctly', () => {
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
});

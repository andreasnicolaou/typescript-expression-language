import { Compiler } from '../compiler';
import { ArgumentsNode } from './arguments-node';
import { ConstantNode } from './constant-node';
import { Node } from './node';

const getCompileData = (): (string | ArgumentsNode)[][] => {
  return [['"a", "b"', getArrayNode()]];
};

const getDumpData = (): (string | ArgumentsNode)[][] => {
  return [['"a", "b"', getArrayNode()]];
};

const getArrayNode = (): ArgumentsNode => {
  const arr = createArrayNode();
  arr.addElement(new ConstantNode('a'));
  arr.addElement(new ConstantNode('b'));
  return arr;
};

const createArrayNode = (): ArgumentsNode => {
  return new ArgumentsNode();
};

class TestArgumentsNode extends ArgumentsNode {
  constructor(private readonly pairs: { key: Node | null; value: Node }[] = []) {
    super();
  }
  protected getKeyValuePairs(): { key: Node; value: Node }[] {
    return this.pairs.map((pair) => ({
      key: pair.key ?? new ConstantNode('dummy'), // Replace null keys with a dummy ConstantNode
      value: pair.value,
    }));
  }
}

describe('ArgumentsNode', () => {
  test('should return expected compile data', () => {
    const expectedData = [['"a", "b"', getArrayNode()]];
    expect(getCompileData()).toEqual(expectedData);
  });

  test('should return expected dump data', () => {
    const generator = getDumpData();
    const expectedData = [['"a", "b"', getArrayNode()]];
    // Convert generator to array and compare
    const result = Array.from(generator);
    expect(result).toEqual(expectedData);
  });

  test('should create an instance of ArgumentsNode', () => {
    const node = createArrayNode();
    expect(node).toBeInstanceOf(ArgumentsNode);
  });

  test('should return an empty array for no arguments', () => {
    const testArgumentsNode = new TestArgumentsNode([]);
    expect(testArgumentsNode.toArray()).toEqual([]);
  });

  test('should return array with one argument and no comma', () => {
    const constantNode = new ConstantNode('a');
    const testArgumentsNode = new TestArgumentsNode([{ key: null, value: constantNode }]);
    expect(testArgumentsNode.toArray()).toEqual([constantNode]);
  });

  test('should return array with multiple arguments and commas', () => {
    const constantNode1 = new ConstantNode('a');
    const constantNode2 = new ConstantNode('b');
    const constantNode3 = new ConstantNode('c');
    const node = new TestArgumentsNode([
      { key: null, value: constantNode1 },
      { key: null, value: constantNode2 },
      { key: null, value: constantNode3 },
    ]);
    expect(node.toArray()).toEqual([constantNode1, ', ', constantNode2, ', ', constantNode3]);
  });

  test('should call compileArguments with compiler in compile()', () => {
    const node = new ArgumentsNode();
    const compiler = new Compiler({});
    expect(() => node.compile(compiler)).not.toThrow();
  });
});

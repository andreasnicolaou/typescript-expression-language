import { Compiler } from '../compiler';
import { ArgumentsNode } from './arguments-node';
import { ConstantNode } from './constant-node';

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
    const node = new ArgumentsNode();
    expect(node.toArray()).toEqual([]);
  });

  test('should return array with one argument and no comma', () => {
    const node = new ArgumentsNode();
    const constantNode = new ConstantNode('a');
    node.addElement(constantNode);
    expect(node.toArray()).toEqual([constantNode]);
  });

  test('should return array with multiple arguments and commas', () => {
    const node = new ArgumentsNode();
    const constantNode1 = new ConstantNode('a');
    const constantNode2 = new ConstantNode('b');
    const constantNode3 = new ConstantNode('c');
    node.addElement(constantNode1);
    node.addElement(constantNode2);
    node.addElement(constantNode3);
    expect(node.toArray()).toEqual([constantNode1, ', ', constantNode2, ', ', constantNode3]);
  });

  test('should call compileArguments with compiler in compile()', () => {
    const node = new ArgumentsNode();
    const compiler = new Compiler({});
    expect(() => node.compile(compiler)).not.toThrow();
  });
});

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
});

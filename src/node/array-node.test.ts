import { ArrayNode } from './array-node';
import { ConstantNode } from './constant-node';

const getEvaluateData = (): (ArrayNode | Record<string, string>)[][] => {
  return [[{ b: 'a', '0': 'b' }, createArrayNode()]];
};

const getCompileData = (): (string | ArrayNode)[][] => {
  return [['{"b": "a", "0": "b"}', createArrayNode()]];
};

const getDumpData = (): (string | ArrayNode)[][] => {
  const array1 = createArrayNode();
  array1.addElement(new ConstantNode('c'), new ConstantNode('a"b'));
  array1.addElement(new ConstantNode('d'), new ConstantNode('a\\b'));

  const array2 = createArrayNode();
  array2.addElement(new ConstantNode('c'));
  array2.addElement(new ConstantNode('d'));

  return [
    ['{"b": "a", 0: "b"}', createArrayNode()],
    ['{"a\\"b": "c", "a\\\\b": "d"}', array1],
    ['["c", "d"]', array2],
  ];
};

const createArrayNode = (): ArrayNode => {
  const arrayNode = new ArrayNode();
  arrayNode.addElement(new ConstantNode('a'), new ConstantNode('b'));
  arrayNode.addElement(new ConstantNode('b'));
  return arrayNode;
};

describe('ArrayNode', () => {
  let arrayNode!: ArrayNode;

  beforeEach(() => {
    arrayNode = createArrayNode();
    arrayNode.addElement(new ConstantNode('a'), new ConstantNode('b'));
    arrayNode.addElement(new ConstantNode('b'));
  });

  test('should serialize and unserialize correctly', () => {
    const serializedNode = JSON.stringify(arrayNode);
    const unserializedNode = JSON.parse(serializedNode);

    expect(arrayNode).toEqual(unserializedNode);
    expect(createArrayNode()).not.toEqual(unserializedNode);
  });

  test('should return correct evaluation data', () => {
    expect(getEvaluateData()).toEqual(getEvaluateData());
  });

  test('should return correct compile data', () => {
    expect(getCompileData()).toEqual([['{"b": "a", "0": "b"}', createArrayNode()]]);
  });

  test('should return correct dump data', () => {
    const array1 = createArrayNode();
    array1.addElement(new ConstantNode('c'), new ConstantNode('a"b'));
    array1.addElement(new ConstantNode('d'), new ConstantNode('a\\b'));

    const array2 = createArrayNode();
    array2.addElement(new ConstantNode('c'));
    array2.addElement(new ConstantNode('d'));

    expect(getDumpData()).toEqual([
      ['{"b": "a", 0: "b"}', createArrayNode()],
      ['{"a\\"b": "c", "a\\\\b": "d"}', array1],
      ['["c", "d"]', array2],
    ]);
  });
});

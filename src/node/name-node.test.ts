/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { NameNode } from './name-node';

const getEvaluateData = (): (
  | string
  | NameNode
  | {
      foo: string;
    }
)[][] => [['bar', new NameNode('foo'), { foo: 'bar' }]];

const getCompileData = (): (string | NameNode)[][] => [['foo', new NameNode('foo')]];

const getDumpData = (): (string | NameNode)[][] => [['foo', new NameNode('foo')]];

describe('NameNode', () => {
  test('should evaluate correctly', () => {
    getEvaluateData().forEach(([expected, node, values]) => {
      expect((node as NameNode).evaluate({}, values as Record<string, any>)).toBe(expected);
    });
  });

  test('should compile correctly', () => {
    getCompileData().forEach(([expected, node]) => {
      const compiler = new Compiler({});
      (node as NameNode).compile(compiler);
      expect(compiler.getSource()).toBe(expected);
    });
  });

  test('should dump correctly', () => {
    getDumpData().forEach(([expected, node]) => {
      expect((node as NameNode).dump()).toBe(expected);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NullCoalescedNameNode } from './null-coalesced-name-node';
import { Compiler } from '../compiler';

const getEvaluateData = (): (null | NullCoalescedNameNode | Record<string, undefined | null | string>)[][] => [
  [null, new NullCoalescedNameNode('foo'), { foo: undefined }],
  [null, new NullCoalescedNameNode('foo'), { foo: null }],
  [null, new NullCoalescedNameNode('foo'), { foo: 'bar' }],
];

const getCompileData = (): (string | NullCoalescedNameNode)[][] => [['foo ?? null', new NullCoalescedNameNode('foo')]];

const getDumpData = (): (string | NullCoalescedNameNode)[][] => [['foo ?? null', new NullCoalescedNameNode('foo')]];

describe('NullCoalescedNameNode', () => {
  test('should evaluate correctly', () => {
    getEvaluateData().forEach(([expected, node, values]) => {
      expect((node as NullCoalescedNameNode).evaluate({}, values as Record<string, any>)).toEqual(expected);
    });
  });

  test('should compile correctly', () => {
    getCompileData().forEach(([expected, node]) => {
      const compiler = new Compiler({});
      (node as NullCoalescedNameNode).compile(compiler);
      expect(compiler.getSource()).toBe(expected);
    });
  });

  test('should dump correctly', () => {
    getDumpData().forEach(([expected, node]) => {
      expect((node as NullCoalescedNameNode).dump()).toBe(expected);
    });
  });
});

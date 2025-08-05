/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { ConstantNode } from './constant-node';
import { FunctionNode } from './function-node';
import { Node } from './node';

const getEvaluateData = (): (
  | string
  | never[]
  | FunctionNode
  | {
      foo: {
        compiler: (arg: string) => string;
        evaluator: (_variables: any, arg: any) => any;
      };
    }
)[][] => [['bar', new FunctionNode('foo', new Node({ child: new ConstantNode('bar') })), [], { foo: getCallables() }]];

const getCompileData = (): (
  | string
  | FunctionNode
  | {
      foo: {
        compiler: (arg: string) => string;
        evaluator: (_variables: any, arg: any) => any;
      };
    }
)[][] => [
  ['foo("bar")', new FunctionNode('foo', new Node({ child: new ConstantNode('bar') })), { foo: getCallables() }],
];

const getDumpData = (): (
  | string
  | FunctionNode
  | {
      foo: {
        compiler: (arg: string) => string;
        evaluator: (_variables: any, arg: any) => any;
      };
    }
)[][] => [
  ['foo("bar")', new FunctionNode('foo', new Node({ child: new ConstantNode('bar') })), { foo: getCallables() }],
];

const getCallables = (): {
  compiler: (arg: string) => string;
  evaluator: (_variables: any, arg: any) => any;
} => {
  return {
    compiler: (arg: string): string => `foo(${arg})`,
    evaluator: (_variables: any, arg: any): any => arg,
  };
};

describe('FunctionNode', () => {
  test('should evaluate correctly', () => {
    getEvaluateData().forEach(([expected, node, values, functions]) => {
      expect((node as FunctionNode).evaluate(functions as Record<string, any>, values as Record<string, any>)).toEqual(
        expected
      );
    });
  });

  test('should compile correctly', () => {
    getCompileData().forEach(([expected, node, functions]) => {
      const compiler = new Compiler(functions as Record<string, any>);
      (node as FunctionNode).compile(compiler);
      expect(compiler.getSource()).toBe(expected);
    });
  });

  test('should dump correctly', () => {
    getDumpData().forEach(([expected, node]) => {
      expect((node as FunctionNode).dump()).toBe(expected);
    });
  });
});

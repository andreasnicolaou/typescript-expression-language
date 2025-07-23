/* eslint-disable @typescript-eslint/no-explicit-any */
import { Lexer } from './lexer';
import { ArgumentsNode } from './node/arguments-node';
import { ArrayNode } from './node/array-node';
import { BinaryNode } from './node/binary-node';
import { ConditionalNode } from './node/conditional-node';
import { ConstantNode } from './node/constant-node';
import { GetAttrNode } from './node/get-attr-node';
import { NameNode } from './node/name-node';
import { NullCoalesceNode } from './node/null-coalesce-node';
import { UnaryNode } from './node/unary-node';
import { Node } from './node/node';
import { Parser } from './parser';
import { SyntaxError } from './syntax-error';

const getInvalidPostfixData = (): (string | string[])[][] => {
  return [
    ['foo."#"', ['foo']],
    ['foo."bar"', ['foo']],
    ['foo.**', ['foo']],
    ['foo.123', ['foo']],
  ];
};

const createGetAttrNode = (node: Node, item: any, type: number): GetAttrNode => {
  return new GetAttrNode(node, new ConstantNode(item, GetAttrNode.ARRAY_CALL !== type), new ArgumentsNode(), type);
};
const getParseData = (): (
  | string
  | string[]
  | NameNode
  | ConstantNode
  | ConditionalNode
  | UnaryNode
  | BinaryNode
  | GetAttrNode
  | NullCoalesceNode
)[][] => {
  const args = new ArgumentsNode();
  args.addElement(new ConstantNode('arg1'));
  args.addElement(new ConstantNode(2));
  args.addElement(new ConstantNode(true));

  const array = new ArrayNode();
  array.addElement(new NameNode('bar'));

  return [
    [new NameNode('a'), 'a', ['a']],
    [new ConstantNode('a'), ['"a"']],
    [new ConstantNode(3), '3'],
    [new ConstantNode(false), 'false'],
    [new ConstantNode(true), 'true'],
    [new ConstantNode(null), 'null'],
    [new UnaryNode('-', new ConstantNode(3)), '-3'],
    [new BinaryNode('-', new ConstantNode(3), new ConstantNode(3)), '3 - 3'],
    [
      new BinaryNode('*', new BinaryNode('-', new ConstantNode(3), new ConstantNode(3)), new ConstantNode(2)),
      '(3 - 3) * 2',
    ],
    [
      new GetAttrNode(
        new NameNode('foo'),
        new ConstantNode('bar', true),
        new ArgumentsNode(),
        GetAttrNode.PROPERTY_CALL
      ),
      'foo.bar',
      ['foo'],
    ],
    [
      new GetAttrNode(new NameNode('foo'), new ConstantNode('bar', true), new ArgumentsNode(), GetAttrNode.METHOD_CALL),
      'foo.bar()',
      ['foo'],
    ],
    [
      new GetAttrNode(new NameNode('foo'), new ConstantNode('not', true), new ArgumentsNode(), GetAttrNode.METHOD_CALL),
      'foo.not()',
      ['foo'],
    ],
    [
      new GetAttrNode(new NameNode('foo'), new ConstantNode('bar', true), args, GetAttrNode.METHOD_CALL),
      'foo.bar("arg1", 2, true)',
      ['foo'],
    ],
    [
      new GetAttrNode(new NameNode('foo'), new ConstantNode(3), new ArgumentsNode(), GetAttrNode.ARRAY_CALL),
      'foo[3]',
      ['foo'],
    ],
    [
      new ConditionalNode(new ConstantNode(true), new ConstantNode(true), new ConstantNode(false)),
      'true ? true : false',
    ],
    [new BinaryNode('matches', new ConstantNode('foo'), new ConstantNode('/foo/')), '"foo" matches "/foo/"'],
    [new BinaryNode('starts with', new ConstantNode('foo'), new ConstantNode('f')), '"foo" starts with "f"'],
    [new BinaryNode('ends with', new ConstantNode('foo'), new ConstantNode('f')), '"foo" ends with "f"'],
    [new BinaryNode('contains', new ConstantNode('foo'), new ConstantNode('f')), '"foo" contains "f"'],
    [
      new GetAttrNode(
        new NameNode('foo'),
        new ConstantNode('bar', true, true),
        new ArgumentsNode(),
        GetAttrNode.PROPERTY_CALL
      ),
      'foo?.bar',
      ['foo'],
    ],
    [
      new GetAttrNode(
        new NameNode('foo'),
        new ConstantNode('bar', true, true),
        new ArgumentsNode(),
        GetAttrNode.METHOD_CALL
      ),
      'foo?.bar()',
      ['foo'],
    ],
    [
      new GetAttrNode(
        new NameNode('foo'),
        new ConstantNode('not', true, true),
        new ArgumentsNode(),
        GetAttrNode.METHOD_CALL
      ),
      'foo?.not()',
      ['foo'],
    ],
    [
      new NullCoalesceNode(
        new GetAttrNode(
          new NameNode('foo'),
          new ConstantNode('bar', true),
          new ArgumentsNode(),
          GetAttrNode.PROPERTY_CALL
        ),
        new ConstantNode('default')
      ),
      'foo.bar ?? "default"',
      ['foo'],
    ],
    [
      new NullCoalesceNode(
        new GetAttrNode(new NameNode('foo'), new ConstantNode('bar'), new ArgumentsNode(), GetAttrNode.ARRAY_CALL),
        new ConstantNode('default')
      ),
      'foo["bar"] ?? "default"',
      ['foo'],
    ],
    [
      createGetAttrNode(
        createGetAttrNode(
          createGetAttrNode(
            createGetAttrNode(new NameNode('foo'), 'bar', GetAttrNode.METHOD_CALL),
            'foo',
            GetAttrNode.METHOD_CALL
          ),
          'baz',
          GetAttrNode.PROPERTY_CALL
        ),
        '3',
        GetAttrNode.ARRAY_CALL
      ),
      'foo.bar().foo().baz[3]',
      ['foo'],
    ],
    [new NameNode('bar'), 'bar', ['bar']],
    [
      new BinaryNode(
        'in',
        new GetAttrNode(
          new NameNode('foo'),
          new ConstantNode('not', true),
          new ArgumentsNode(),
          GetAttrNode.PROPERTY_CALL
        ),
        array
      ),
      'foo.not in [bar]',
      ['foo', 'bar'],
    ],
    [
      new BinaryNode(
        'or',
        new UnaryNode('not', new NameNode('foo')),
        new GetAttrNode(
          new NameNode('foo'),
          new ConstantNode('not', true),
          new ArgumentsNode(),
          GetAttrNode.PROPERTY_CALL
        )
      ),
      'not foo or foo.not',
      ['foo'],
    ],
    [new BinaryNode('..', new ConstantNode(0), new ConstantNode(3)), '0..3'],
    [new BinaryNode('+', new ConstantNode(0), new ConstantNode(0.1)), '0+.1'],
  ];
};

const getLintData = (): Array<{
  expression: string;
  names: string[];
  checks?: number;
  exception?: string;
}> => {
  return [
    { expression: 'foo["some_key"].callFunction(a ? b)', names: ['foo', 'a', 'b'] },
    { expression: 'foo["some_key"]?.callFunction(a ? b)', names: ['foo', 'a', 'b'] },
    {
      expression: 'foo.bar',
      names: [],
      checks: Parser.IGNORE_UNKNOWN_VARIABLES,
    },
    {
      expression: 'foo()',
      names: [],
      checks: Parser.IGNORE_UNKNOWN_FUNCTIONS,
    },
    {
      expression: 'foo(bar)',
      names: [],
      checks: Parser.IGNORE_UNKNOWN_FUNCTIONS | Parser.IGNORE_UNKNOWN_VARIABLES,
    },
    { expression: '[value1, value2, value3,]', names: ['value1', 'value2', 'value3'] },
    { expression: '{val1: value1, val2: value2, val3: value3,}', names: ['value1', 'value2', 'value3'] },
    {
      expression: 'foo.bar',
      names: [],
      checks: 0,
      exception: 'Variable "foo" is not valid around position 1 for expression `foo.bar`',
    },
    {
      expression: 'foo()',
      names: [],
      checks: 0,
      exception: 'The function "foo" does not exist around position 1 for expression `foo()`',
    },
    {
      expression: 'foo["a"] foo["b"]',
      names: ['foo'],
      checks: 0,
      exception: 'Unexpected token "name" of value "foo" around position 10 for expression `foo["a"] foo["b"]`.',
    },
  ];
};

describe('Parser', () => {
  let lexer!: Lexer;
  let parser!: Parser;

  beforeEach(() => {
    lexer = new Lexer();
    parser = new Parser(Object.create(Object.prototype));
  });

  test('should suggest a name proposal for invalid expressions', () => {
    const invalidExpression = 'foo > bar';
    expect(() => {
      parser.parse(lexer.tokenize(invalidExpression), ['foo', 'baz']);
    }).toThrow(SyntaxError);
    expect(() => {
      parser.parse(lexer.tokenize(invalidExpression), ['foo', 'baz']);
    }).toThrow('Did you mean "baz"?');
  });

  test('should throw an error for invalid variable names', () => {
    expect(() => {
      parser.parse(lexer.tokenize('foo'));
    }).toThrow(SyntaxError);
    expect(() => {
      parser.parse(lexer.tokenize('foo'), ['0']);
    }).toThrow(SyntaxError);
  });

  test('should throw an error for unknown functions', () => {
    expect(() => {
      parser.parse(new Lexer().tokenize('foo()'));
    }).toThrow(SyntaxError);
  });

  test('should parse valid expressions', () => {
    getParseData().forEach(([node, expression, names]) => {
      expect(parser.parse(new Lexer().tokenize(expression as string), names as string[]).toString()).toBe(
        node.toString()
      );
    });
  });

  test('should throw an error for invalid postfix expressions', () => {
    getInvalidPostfixData().forEach(([expression, names]) => {
      expect(() => {
        parser.parse(new Lexer().tokenize(expression as string), names as string[]);
      }).toThrow(SyntaxError);
    });
  });

  getLintData().forEach((testCase, index) => {
    test(`should handle lint case #${index + 1}: ${testCase.expression}`, () => {
      const { expression, names, checks = 0, exception } = testCase;
      if (exception) {
        expect(() => {
          parser.lint(lexer.tokenize(expression), names, checks);
        }).toThrow(SyntaxError);
        expect(() => {
          parser.lint(lexer.tokenize(expression), names, checks);
        }).toThrow(exception);
      } else {
        expect(() => {
          parser.lint(lexer.tokenize(expression), names, checks);
        }).not.toThrow();
      }
    });
  });

  test('should parse hash key as expression in parentheses', () => {
    const stream = lexer.tokenize('{(1+1): 2}');
    expect(() => {
      parser.parse(stream, []);
    }).not.toThrow();
  });

  test('should throw SyntaxError for invalid token type', () => {
    const stream = lexer.tokenize('{[1]: 2}');
    expect(() => {
      parser.parse(stream, []);
    }).toThrow(SyntaxError);
    expect(() => {
      parser.parse(stream, []);
    }).toThrow('Unexpected token "punctuation" of value ":" around position 5 for expression `{[1]: 2}`.');
  });

  test('should warn when lint is called with names=null', () => {
    const stream = lexer.tokenize('1+1');
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {
      return null;
    });
    parser.lint(stream, null);
    expect(spy).toHaveBeenCalledWith(
      'Passing "null" as the second argument of "lint()" is deprecated. Use "Parser.IGNORE_UNKNOWN_VARIABLES" instead.'
    );
    spy.mockRestore();
  });
});

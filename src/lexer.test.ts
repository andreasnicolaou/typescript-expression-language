import { Lexer } from './lexer';
import { Token } from './token';
import { TokenStream } from './token-stream';
import { SyntaxError } from './syntax-error';

const getTokenizeData = (): (string | Token[])[][] => {
  return [
    [[new Token(Token.NAME_TYPE, 'a', 3)], '  a  '],
    [[new Token(Token.NAME_TYPE, 'a', 1)], 'a'],
    [[new Token(Token.STRING_TYPE, 'foo', 1)], '"foo"'],
    [[new Token(Token.NUMBER_TYPE, 3, 1)], '3'],
    [[new Token(Token.OPERATOR_TYPE, '+', 1)], '+'],
    [[new Token(Token.PUNCTUATION_TYPE, '.', 1)], '.'],
    [
      [
        new Token(Token.PUNCTUATION_TYPE, '(', 1),
        new Token(Token.NUMBER_TYPE, 3, 2),
        new Token(Token.OPERATOR_TYPE, '+', 4),
        new Token(Token.NUMBER_TYPE, 5, 6),
        new Token(Token.PUNCTUATION_TYPE, ')', 7),
      ],
      '(3 + 5)',
    ],
    [
      [
        new Token(Token.PUNCTUATION_TYPE, '(', 1),
        new Token(Token.NUMBER_TYPE, 3, 2),
        new Token(Token.OPERATOR_TYPE, '+', 4),
        new Token(Token.NUMBER_TYPE, 5, 6),
        new Token(Token.PUNCTUATION_TYPE, ')', 7),
        new Token(Token.OPERATOR_TYPE, '~', 9),
        new Token(Token.NAME_TYPE, 'foo', 11),
        new Token(Token.PUNCTUATION_TYPE, '(', 14),
        new Token(Token.STRING_TYPE, 'bar', 15),
        new Token(Token.PUNCTUATION_TYPE, ')', 20),
        new Token(Token.PUNCTUATION_TYPE, '.', 21),
        new Token(Token.NAME_TYPE, 'baz', 22),
        new Token(Token.PUNCTUATION_TYPE, '[', 25),
        new Token(Token.NUMBER_TYPE, 4, 26),
        new Token(Token.PUNCTUATION_TYPE, ']', 27),
        new Token(Token.OPERATOR_TYPE, '-', 29),
        new Token(Token.NUMBER_TYPE, 1990, 31),
        new Token(Token.OPERATOR_TYPE, '+', 39),
        new Token(Token.OPERATOR_TYPE, '~', 41),
        new Token(Token.NAME_TYPE, 'qux', 42),
      ],
      '(3 + 5) ~ foo("bar").baz[4] - 1.99E+3 + ~qux',
    ],
    [[new Token(Token.OPERATOR_TYPE, '..', 1)], '..'],
    [
      [
        new Token(Token.NUMBER_TYPE, 23, 1),
        new Token(Token.OPERATOR_TYPE, '..', 3),
        new Token(Token.NUMBER_TYPE, 26, 5),
      ],
      '23..26',
    ],
    [[new Token(Token.STRING_TYPE, '#foo', 1)], "'#foo'"],
    [[new Token(Token.STRING_TYPE, '#foo', 1)], '"#foo"'],
    [
      [
        new Token(Token.NAME_TYPE, 'foo', 1),
        new Token(Token.PUNCTUATION_TYPE, '.', 4),
        new Token(Token.NAME_TYPE, 'not', 5),
        new Token(Token.OPERATOR_TYPE, 'in', 9),
        new Token(Token.PUNCTUATION_TYPE, '[', 12),
        new Token(Token.NAME_TYPE, 'bar', 13),
        new Token(Token.PUNCTUATION_TYPE, ']', 16),
      ],
      'foo.not in [bar]',
    ],
    [[new Token(Token.NUMBER_TYPE, 0.787, 1)], '0.787'],
    [[new Token(Token.NUMBER_TYPE, 0.1234, 1)], '.1234'],
    [[new Token(Token.NUMBER_TYPE, 188165.1178, 1)], '188_165.1_178'],
    [[new Token(Token.OPERATOR_TYPE, '-', 1), new Token(Token.NUMBER_TYPE, 7189000000.0, 2)], '-.7_189e+10'],
    [[new Token(Token.NUMBER_TYPE, 65536, 1)], '65536 /* this is 2^16 */'],
    [
      [
        new Token(Token.NUMBER_TYPE, 2, 1),
        new Token(Token.OPERATOR_TYPE, '*', 21),
        new Token(Token.NUMBER_TYPE, 4, 23),
      ],
      '2 /* /* comment1 */ * 4',
    ],
    [
      [
        new Token(Token.STRING_TYPE, '/* this is', 1),
        new Token(Token.OPERATOR_TYPE, '~', 14),
        new Token(Token.STRING_TYPE, 'not a comment */', 16),
      ],
      '"/* this is" ~ "not a comment */"',
    ],
    [[new Token(Token.STRING_TYPE, '/* this is not a comment */', 1)], '"/* this is not a comment */"'],
  ];
};

describe('Lexer Tests', () => {
  let lexer!: Lexer;

  beforeEach(() => {
    lexer = new Lexer();
  });

  test('should tokenize the expression correctly', () => {
    getTokenizeData().forEach(([expectedTokens, expression]) => {
      const tokens = [...expectedTokens, new Token(Token.EOF_TYPE, null, expression.length + 1)];
      const tokenStream = new TokenStream(tokens as Token[], expression as string);
      const tokenized = lexer.tokenize(expression as string);
      expect(tokenized).toStrictEqual(tokenStream);
    });
  });

  test('should tokenize multiline comments correctly', () => {
    const expression = `
          /**
            * This is 2^16, even if we could have
            * used the hexadecimal representation 0x10000. Just a
            * matter of taste! 🙂
          */
          65536 and
          /*
           This time, only one star to start the comment and that's it.
           It is valid too!
           */
          65535 /* this is 2^16 - 1 */`;

    const tokens = [
      new Token(Token.NUMBER_TYPE, 65536, 189),
      new Token(Token.OPERATOR_TYPE, 'and', 195),
      new Token(Token.NUMBER_TYPE, 65535, 336),
      new Token(Token.EOF_TYPE, null, expression.length + 1),
    ];

    const tokenStream = new TokenStream(tokens, expression.replace(/\n/g, ' '));
    expect(lexer.tokenize(expression)).toEqual(tokenStream);
  });

  test('should throw a SyntaxError with a message when there is an unexpected character', () => {
    const expression = "service(faulty.expression.example').dummyMethod()";
    expect(() => lexer.tokenize(expression)).toThrow(
      new SyntaxError(
        'Unexpected character "\'" around position 33 for expression `service(faulty.expression.example\').dummyMethod()`.'
      )
    );
  });

  test('should throw a SyntaxError when there is an unclosed brace', () => {
    const expression = 'service(unclosed.expression.dummyMethod()';
    expect(() => lexer.tokenize(expression)).toThrow(
      new SyntaxError('Unclosed "(" around position 7 for expression `service(unclosed.expression.dummyMethod()`.')
    );
  });

  test('should throw a SyntaxError when there is an unexpected closing bracket', () => {
    const expression = 'service)not.opened.expression.dummyMethod()';
    expect(() => lexer.tokenize(expression)).toThrow(
      new SyntaxError('Unexpected ")" around position 7 for expression `service)not.opened.expression.dummyMethod()`.')
    );
  });

  test('should tokenize integer with underscores', () => {
    const expression = `1_000_000 and 2`;
    const tokens = [
      new Token(Token.NUMBER_TYPE, 1000000, 1),
      new Token(Token.OPERATOR_TYPE, 'and', 11),
      new Token(Token.NUMBER_TYPE, 2, 15),
      new Token(Token.EOF_TYPE, null, expression.length + 1),
    ];
    const tokenStream = new TokenStream(tokens, expression);
    expect(lexer.tokenize(expression)).toEqual(tokenStream);
  });

  test('should tokenize float with underscores', () => {
    const expression = `3.14_15 or 1.0_0`;
    const tokens = [
      new Token(Token.NUMBER_TYPE, 3.1415, 1),
      new Token(Token.OPERATOR_TYPE, 'or', 9),
      new Token(Token.NUMBER_TYPE, 1.0, 12),
      new Token(Token.EOF_TYPE, null, expression.length + 1),
    ];
    const tokenStream = new TokenStream(tokens, expression);
    expect(lexer.tokenize(expression)).toEqual(tokenStream);
  });

  test('should tokenize an expression with arithmetic and comparison operators correctly', () => {
    const expression = 'User.age + 5 > 21 and User.score * 2 <= 200';
    const tokens = [
      new Token(Token.NAME_TYPE, 'User', 1),
      new Token(Token.PUNCTUATION_TYPE, '.', 5),
      new Token(Token.NAME_TYPE, 'age', 6),
      new Token(Token.OPERATOR_TYPE, '+', 10),
      new Token(Token.NUMBER_TYPE, 5, 12),
      new Token(Token.OPERATOR_TYPE, '>', 14),
      new Token(Token.NUMBER_TYPE, 21, 16),
      new Token(Token.OPERATOR_TYPE, 'and', 19),
      new Token(Token.NAME_TYPE, 'User', 23),
      new Token(Token.PUNCTUATION_TYPE, '.', 27),
      new Token(Token.NAME_TYPE, 'score', 28),
      new Token(Token.OPERATOR_TYPE, '*', 34),
      new Token(Token.NUMBER_TYPE, 2, 36),
      new Token(Token.OPERATOR_TYPE, '<=', 38),
      new Token(Token.NUMBER_TYPE, 200, 41),
      new Token(Token.EOF_TYPE, null, expression.length + 1),
    ];
    const tokenStream = new TokenStream(tokens, expression);
    expect(lexer.tokenize(expression)).toEqual(tokenStream);
  });

  test('should throw SyntaxError for unclosed bracket', () => {
    const expression = '(]';
    expect(() => lexer.tokenize(expression)).toThrow(SyntaxError);
    expect(() => lexer.tokenize(expression)).toThrow('Unclosed "("');
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from './compiler';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { ParsedExpression } from './parsed-expression';
import { Expression } from './expression';
import { ExpressionFunction } from './expression-function';
import { LRUCache } from 'lru-cache';
import asort from 'locutus/php/array/asort';
import rawurlencode from 'locutus/php/url/rawurlencode';

export interface ExpressionFunctionProvider {
  getFunctions(): ExpressionFunction[];
}

/**
 * Represents an expression language.
 * @class ExpressionLanguage
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class ExpressionLanguage {
  public readonly cache!: LRUCache<string, ParsedExpression>;
  private lexer?: Lexer;
  private parser?: Parser;
  private compiler?: Compiler;
  private functions: Record<string, any> = Object.create(Object.prototype);

  constructor(cache?: LRUCache<string, ParsedExpression>, providers: Iterable<ExpressionFunctionProvider> = []) {
    this.cache = cache || new LRUCache({ max: 500, ttl: 1000 * 60 });
    this.registerFunctions();
    for (const provider of providers) {
      this.registerProvider(provider);
    }
  }

  /**
   * Compiles an expression source code.
   * @param expression
   * @param names
   * @returns compile
   * @memberof ExpressionLanguage
   */
  public compile(expression: Expression | string, names: (string | Record<string, any>)[]): string {
    return this.getCompiler().compile(this.parse(expression, names).getNodes()).getSource();
  }

  /**
   * Evaluates an expression.
   * @param expression
   * @param values
   * @returns evaluate
   * @memberof ExpressionLanguage
   */
  public evaluate(
    expression: Expression | string,
    values: Record<string, any> = Object.create(Object.prototype)
  ): ParsedExpression {
    return this.parse(expression, Object.keys(values)).getNodes().evaluate(this.functions, values);
  }

  /**
   * Parses an expression.
   * @param expression
   * @param names
   * @param [flags]
   * @returns parse
   * @memberof ExpressionLanguage
   */
  public parse(expression: Expression | string, names: (string | Record<string, any>)[], flags = 0): ParsedExpression {
    if (expression instanceof ParsedExpression) {
      return expression;
    }
    asort(names);
    const cacheKeyItems: string[] = [];
    for (const name of names) {
      const value: string = typeof name === 'object' ? `${Object.keys(name)[0]}:${Object.values(name)[0]}` : name;
      cacheKeyItems.push(value);
    }
    const cacheKey = rawurlencode(`${expression}//${cacheKeyItems.join('|')}`);
    let parsedExpression = this.cache.get(cacheKey);
    if (!parsedExpression) {
      const nodes = this.getParser().parse(this.getLexer().tokenize(expression.toString()), names, flags);
      parsedExpression = new ParsedExpression(expression.toString(), nodes);
      this.cache.set(cacheKey, parsedExpression);
    }
    return parsedExpression;
  }

  /**
   * Validates the syntax of an expression.
   * @param expression
   * @param names
   * @param [flags]
   * @returns lint
   * @memberof ExpressionLanguage
   */
  public lint(expression: Expression | string, names: string[] | null, flags = 0): void {
    if (names === null) {
      flags |= Parser.IGNORE_UNKNOWN_VARIABLES;
      names = [];
    }
    if (expression instanceof ParsedExpression) {
      return;
    }
    this.getParser().lint(this.getLexer().tokenize(String(expression)), names, flags);
  }

  /**
   * Registers a function.
   * @param name
   * @param expressionFn
   * @memberof ExpressionLanguage
   */
  public register(name: string, expressionFn: ExpressionFunction): void {
    if (this.parser) {
      throw new Error('Registering functions after calling evaluate(), compile() or parse() is not supported.');
    }
    this.functions[name] = expressionFn;
  }

  /**
   * Adds function.
   * @param functionObj
   * @memberof ExpressionLanguage
   */
  public addFunction(functionObj: ExpressionFunction): void {
    this.register(functionObj.getName(), functionObj);
  }

  /**
   * Registers provider.
   * @param provider
   * @memberof ExpressionLanguage
   */
  public registerProvider(provider: ExpressionFunctionProvider): void {
    provider.getFunctions().forEach((fn) => this.addFunction(fn));
  }

  /**
   * Registers functions.
   * @memberof ExpressionLanguage
   */
  private registerFunctions(): void {
    this.addFunction(ExpressionFunction.fromJs('min'));
    this.addFunction(ExpressionFunction.fromJs('max'));
    this.addFunction(ExpressionFunction.fromJs('now'));
  }

  /**
   * Gets the lexer.
   * @returns lexer
   * @memberof ExpressionLanguage
   */
  private getLexer(): Lexer {
    if (!this.lexer) {
      this.lexer = new Lexer();
    }
    return this.lexer;
  }

  /**
   * Gets the parser.
   * @returns parser
   * @memberof ExpressionLanguage
   */
  private getParser(): Parser {
    if (!this.parser) {
      this.parser = new Parser(this.functions);
    }
    return this.parser;
  }

  /**
   * Gets the compiler
   * @returns compiler
   * @memberof ExpressionLanguage
   */
  private getCompiler(): Compiler {
    if (!this.compiler) {
      this.compiler = new Compiler(this.functions);
    }
    return this.compiler.reset();
  }
}

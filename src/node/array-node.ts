/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { Node } from '../node/node';
import { ConstantNode } from '../node/constant-node';

/**
 * Represents an array-like structure of an abstract syntax tree (AST) in the expression language.
 * @class ArrayNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class ArrayNode extends Node {
  protected index = -1;
  protected keyIndex = -1;
  protected arrayNodeType: 'Array' | 'Object' = 'Array';

  constructor() {
    super();
  }

  /**
   * Adds an element to the node.
   * @param value - The value node to add.
   * @param key - Optional key node.
   * @memberof ArrayNode
   */
  public addElement(value: Node, key: Node | null = null): void {
    if (!key) {
      key = new ConstantNode(++this.index);
    } else {
      this.arrayNodeType = this.arrayNodeType === 'Array' ? 'Object' : 'Array';
    }
    this.nodes[(++this.keyIndex).toString()] = key;
    this.nodes[(++this.keyIndex).toString()] = value;
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof ArrayNode
   */
  public compile(compiler: Compiler): void {
    const isObject = this.arrayNodeType === 'Object';
    const openingBracket = isObject ? '{' : '[';
    const closingBracket = isObject ? '}' : ']';
    compiler.raw(openingBracket);
    this.compileArguments(compiler, isObject);
    compiler.raw(closingBracket);
  }

  /**
   * Evaluates the node.
   * @param functions - The available functions for evaluation.
   * @param values - The current values for evaluation.
   * @returns The evaluated value.
   * @memberof ArrayNode
   */
  public evaluate(functions: Record<string, any>, values: Record<string, any>): any[] | Record<any, any> {
    const isArray = this.arrayNodeType === 'Array';
    const result = isArray ? [] : {};
    for (const pair of this.getKeyValuePairs()) {
      const evaluatedKey = isArray ? undefined : pair.key.evaluate(functions, values);
      const evaluatedValue = pair.value.evaluate(functions, values);
      if (isArray) {
        (result as any[]).push(evaluatedValue);
      } else {
        (result as Record<any, any>)[evaluatedKey] = evaluatedValue;
      }
    }
    return result;
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof ArrayNode
   */
  public toArray(): (string | Node)[] {
    const value: Record<string, Node> = Object.create(Object.prototype);
    for (const pair of this.getKeyValuePairs()) {
      value[pair.key.attributes.value] = pair.value;
    }
    const array: (string | Node)[] = [];
    if (this.isHash(value)) {
      array.push('{');
      for (const [key, val] of Object.entries(value)) {
        array.push(new ConstantNode(key), ': ', val, ', ');
      }
      array.pop();
      array.push('}');
    } else {
      array.push('[');
      for (const val of Object.values(value)) {
        array.push(val, ', ');
      }
      array.pop();
      array.push(']');
    }
    return array;
  }

  /**
   * Retrieves key-value pairs from the node.
   * @returns An array of key-value pair objects.
   * @memberof ArrayNode
   */
  protected getKeyValuePairs(): { key: Node; value: Node }[] {
    const pairs: { key: Node; value: Node }[] = [];
    const keys = Object.keys(this.nodes);
    for (let i = 0; i < keys.length; i += 2) {
      pairs.push({ key: this.nodes[keys[i]], value: this.nodes[keys[i + 1]] });
    }
    return pairs;
  }

  /**
   * Compiles the node's arguments.
   * @param compiler - The Compiler instance.
   * @param withKeys - Whether to include keys in the compiled output.
   * @memberof ArrayNode
   */
  protected compileArguments(compiler: Compiler, withKeys = true): void {
    for (const [index, pair] of this.getKeyValuePairs().entries()) {
      if (index > 0) {
        compiler.raw(', ');
      }
      if (withKeys) {
        compiler.compile(pair.key).raw(': ');
      }
      compiler.compile(pair.value);
    }
  }
}

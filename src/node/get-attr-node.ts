/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { ArrayNode } from '../node/array-node';
import { Node } from '../node/node';
import { ConstantNode } from './constant-node';

/**
 * Represents a attribute node in an abstract syntax tree (AST) for an expression language.
 * @class GetAttrNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class GetAttrNode extends Node {
  public static readonly PROPERTY_CALL = 1;
  public static readonly METHOD_CALL = 2;
  public static readonly ARRAY_CALL = 3;

  constructor(node: Node, attribute: Node, argumentsNode: ArrayNode, type: number, isNullSafe = false) {
    const nullSafe = GetAttrNode.ARRAY_CALL === type && isNullSafe;
    super(
      { node, attribute, arguments: argumentsNode },
      { type, is_null_coalesce: false, is_short_circuited: false, is_null_safe: nullSafe }
    );
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof GetAttrNode
   */
  public compile(compiler: Compiler): void {
    const nullSafe =
      (this.nodes.attribute instanceof ConstantNode && this.nodes.attribute.isNullSafe) || this.attributes.is_null_safe;
    // inside "??", a missing or scalar link must not throw, as in evaluate() and in PHP
    const optional = nullSafe || this.attributes.is_null_coalesce;
    switch (this.attributes.type) {
      case GetAttrNode.PROPERTY_CALL:
        compiler
          .compile(this.nodes.node)
          .raw(optional ? '?.' : '.')
          .raw(this.nodes.attribute.attributes.value);
        break;
      case GetAttrNode.METHOD_CALL:
        compiler
          .compile(this.nodes.node)
          .raw(nullSafe ? '?.' : '.')
          .raw(this.nodes.attribute.attributes.value)
          .raw('(')
          .compile(this.nodes.arguments)
          .raw(')');
        break;
      case GetAttrNode.ARRAY_CALL:
        if (optional) {
          compiler.compile(this.nodes.node).raw('?.[').compile(this.nodes.attribute).raw(']');
        } else {
          compiler.compile(this.nodes.node).raw('[').compile(this.nodes.attribute).raw(']');
        }
        break;
    }
  }

  /**
   * Evaluates the node.
   * @param functions - The available functions for evaluation.
   * @param values - The current values for evaluation.
   * @returns The evaluated value.
   * @memberof GetAttrNode
   */
  public evaluate(functions: Record<string, any>, values: Record<string, any>): any {
    const isShortCircuited = { value: false };
    return this.evaluateChain(functions, values, isShortCircuited);
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof GetAttrNode
   */
  public toArray(): (string | Node)[] {
    const nullSafe = this.nodes?.['attribute'] instanceof ConstantNode && this.nodes?.['attribute']?.isNullSafe;
    switch (this.attributes.type) {
      case GetAttrNode.PROPERTY_CALL:
        return [this.nodes.node, nullSafe ? '?.' : '.', this.nodes.attribute];
      case GetAttrNode.METHOD_CALL:
        return [this.nodes.node, nullSafe ? '?.' : '.', this.nodes.attribute, '(', this.nodes.arguments, ')'];
      case GetAttrNode.ARRAY_CALL:
        return [this.nodes.node, this.attributes.is_null_safe ? '?.[' : '[', this.nodes.attribute, ']'];
      default:
        return [];
    }
  }

  /**
   * Evaluates the chain.
   * @param functions - The available functions for evaluation.
   * @param values - The current values for evaluation.
   * @param isShortCircuited - Whether a null-safe link short-circuited the chain.
   * @returns The evaluated value.
   * @memberof GetAttrNode
   */
  private evaluateChain(
    functions: Record<string, any>,
    values: Record<string, any>,
    isShortCircuited: { value: boolean }
  ): any {
    const nullSafe = this.attributes.is_null_safe;
    const node = this.nodes.node;
    const value =
      node instanceof GetAttrNode
        ? node.evaluateChain(functions, values, isShortCircuited)
        : node.evaluate(functions, values);
    const attributeNullSafe = this.nodes.attribute instanceof ConstantNode && this.nodes.attribute.isNullSafe;
    const property = this.nodes.attribute.attributes.value;
    switch (this.attributes.type) {
      case GetAttrNode.PROPERTY_CALL:
        if (value === null && (attributeNullSafe || this.attributes.is_null_coalesce)) {
          isShortCircuited.value = true;
          return null;
        }
        if (value === null && isShortCircuited.value) {
          return null;
        }
        if (this.attributes.is_null_coalesce) {
          // like the compiled `(a.b) ?? c`: a scalar has no properties in PHP, but a JS primitive does ("abc".length)
          return value?.[property] ?? null;
        }
        if (value === null || typeof value !== 'object') {
          throw new Error(
            `Unable to get property "${this.nodes.attribute.dump()}" of non-object "${this.nodes.node.dump()}".`
          );
        }
        return value[property];
      case GetAttrNode.METHOD_CALL:
        if (value === null && attributeNullSafe) {
          isShortCircuited.value = true;
          return null;
        }
        if (value === null && isShortCircuited.value) {
          return null;
        }
        if (value === null || typeof value !== 'object') {
          throw new Error(
            `Unable to call method "${this.nodes.attribute.dump()}" of non-object "${this.nodes.node.dump()}".`
          );
        }
        if (typeof value[property] !== 'function') {
          throw new Error(`Unable to call method "${property}" of object "${typeof value}".`);
        }
        return value[property](...Object.values(this.nodes['arguments'].evaluate(functions, values)));
      case GetAttrNode.ARRAY_CALL:
        if (value === null && (nullSafe || isShortCircuited.value)) {
          isShortCircuited.value = true;
          return null;
        }
        if (this.attributes.is_null_coalesce) {
          return value?.[this.nodes.attribute.evaluate(functions, values)] ?? null;
        }
        if (value === null || (typeof value !== 'object' && !Array.isArray(value))) {
          throw new Error(`Unable to get an item of non-array "${this.nodes.node.dump()}".`);
        }
        return value[this.nodes.attribute.evaluate(functions, values)];
    }
  }
}

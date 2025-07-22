/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { Node } from '../node/node';
import { ArrayNode } from '../node/array-node';
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

  constructor(node: Node, attribute: Node, argumentsNode: ArrayNode, type: number) {
    super({ node, attribute, arguments: argumentsNode }, { type, is_null_coalesce: false, is_short_circuited: false });
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof GetAttrNode
   */
  public compile(compiler: Compiler): void {
    const nullSafe = this.nodes.attribute instanceof ConstantNode && this.nodes.attribute.isNullSafe;
    switch (this.attributes.type) {
      case GetAttrNode.PROPERTY_CALL:
        compiler
          .compile(this.nodes.node)
          .raw(nullSafe ? '?.' : '.')
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
        compiler.compile(this.nodes.node).raw('[').compile(this.nodes.attribute).raw(']');
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
    const valEvaluation = this.nodes.node.evaluate(functions, values);
    const property = this.nodes.attribute.attributes.value;
    switch (this.attributes.type) {
      case GetAttrNode.PROPERTY_CALL:
        if (
          valEvaluation === null &&
          ((this.nodes.attribute instanceof ConstantNode && this.nodes.attribute.isNullSafe) ||
            this.attributes.is_null_coalesce)
        ) {
          this.attributes.is_short_circuited = true;
          return null;
        }
        if (valEvaluation === null && this.isShortCircuited()) {
          return null;
        }
        if (typeof valEvaluation !== 'object') {
          throw new Error(
            `Unable to get property "${this.nodes.attribute.dump()}" of non-object "${this.nodes.node.dump()}".`
          );
        }
        if (this.attributes.is_null_coalesce) {
          return valEvaluation[property] ?? null;
        }
        return valEvaluation[property];
      case GetAttrNode.METHOD_CALL:
        if (valEvaluation === null && this.nodes.attribute instanceof ConstantNode && this.nodes.attribute.isNullSafe) {
          this.attributes.is_short_circuited = true;
          return null;
        }
        if (valEvaluation === null && this.isShortCircuited()) {
          return null;
        }
        if (typeof valEvaluation !== 'object') {
          throw new Error(
            `Unable to call method "${this.nodes.attribute.dump()}" of non-object "${this.nodes.node.dump()}".`
          );
        }
        if (typeof valEvaluation[property] !== 'function') {
          throw new Error(`Unable to call method "${property}" of object "${typeof valEvaluation}".`);
        }
        return valEvaluation[property](...Object.values(this.nodes['arguments'].evaluate(functions, values)));
      case GetAttrNode.ARRAY_CALL:
        if (valEvaluation === null && this.isShortCircuited()) {
          return null;
        }
        if (typeof valEvaluation !== 'object' && !(valEvaluation instanceof Array)) {
          throw new Error(`Unable to get an item of non-array "${this.nodes.node.dump()}".`);
        }
        if (this.attributes.is_null_coalesce) {
          return valEvaluation[this.nodes.attribute.evaluate(functions, values)] ?? null;
        }
        return valEvaluation[this.nodes.attribute.evaluate(functions, values)];
    }
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
        return [this.nodes.node, '[', this.nodes.attribute, ']'];
      default:
        return [];
    }
  }

  /**
   * Determines short circuited
   * @returns true if short circuited
   * @memberof GetAttrNode
   */
  private isShortCircuited(): boolean {
    return (
      this.attributes.is_short_circuited ||
      (this.nodes.node instanceof GetAttrNode && this.nodes.node.isShortCircuited())
    );
  }
}

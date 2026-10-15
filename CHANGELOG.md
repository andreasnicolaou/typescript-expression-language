# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.0] - 2026-10-15

This release ports most of Symfony 8.2's changes to the ExpressionLanguage component. Its `CompiledExpressionLanguage` and the `ExceptionInterface` shared by its exceptions are not ported.

### Security

#### `constant()` and `enum()` can be restricted, and their unrestricted form is deprecated

The built-in `constant()` and `enum()` resolve any name on the global object, so an expression can read `constant("process.env.HOME")`. Following Symfony 8.2, register a `ConstantFunctionProvider` listing the constants expressions may read — `*` matches one segment of a name (anything but `.` and `:`), as in `Status.*` or `Roles::ROLE_*`, and the segments `__proto__`, `constructor` and `prototype` are never allowed:

```typescript
new ExpressionLanguage(null, [new ConstantFunctionProvider(['Math.PI', 'Status.*'])]);
```

Any other name throws `Constant "…" is not allowed.` (or `Enum case "…" is not allowed.`), in `evaluate()` and in compiled code. An entry that names a whole class or object, such as `Roles` or `Config`, throws a `TypeError` when the provider is created, since it would hand an expression every property of it: list `Roles::*` or `Config.*` instead. The built-in functions still work, but parsing an expression that calls them reports a `DeprecationWarning` once; they will be removed in 4.0.

#### The parser bounds the depth of the node tree

3.1.0 bounded the nesting level, but not the levels that a chain of operators or property accesses adds above a parenthesised operand: `((a + b + c) + d + e)` nested a hundred times passed the parser and then overflowed the call stack in `evaluate()`, `compile()` or `JSON.stringify()`. Such expressions now throw `SyntaxError: Expression is nested too deeply, the maximum nesting level is 256`, as in Symfony. So do 128 or more nested function calls, since each one adds two levels to the tree.

### Added

- `count()` function, like PHP 8's (and Symfony 8.2's): `count([1, 2])` is `2`, `count(list, 1)` counts recursively without counting an array again inside itself, and a value other than an array or a hash throws a `TypeError`.
- `ExpressionFunction#deprecate()` and `ExpressionFunction#getDeprecation()`.

### Changed

- The default `ArrayCache` keeps the last 1024 parsed expressions instead of 500, like Symfony 8.2.

### Fixed

- Chained ternaries with binary conditions no longer count the levels of those conditions against the nesting limit: `a and a and a ? 1 : ` repeated 64 times was wrongly rejected as nested too deeply.
- Unary `+` converts its operand to a number when evaluated, like the compiled code already did: `+"5"` is `5` (it was `"5"`).
- `??` no longer throws for an attribute of a scalar, and gives what the compiled code gives: `foo.bar ?? "d"` is `"d"` when `foo` is `5`, `foo.length ?? 0` is `3` when `foo` is `"abc"`, and `foo[0] ?? "d"` is `"a"`.

## [3.1.0] - 2026-09-02

### Security

#### The parser now rejects deeply nested expressions

Expressions nesting more than **256 levels** deep throw `SyntaxError: Expression is nested too deeply, the maximum nesting level is 256`. Previously there was no bound, and a short generated input could exhaust the call stack with `RangeError: Maximum call stack size exceeded` — either while parsing, or later at `evaluate()` or `compile()`.

Hand-written expressions are nowhere near the limit. Generated ones can be: a chained operator costs one level per term, so `x == 1 or x == 2 or …` is rejected from 253 terms on. Match against a collection instead — `x in [1, 2, …]` is one level at any length.

## [3.0.0] - 2026-08-10

### Changed

#### BREAKING: string literals are now unescaped

`\'`, `\"` and `\\` inside a string literal are now resolved. Previously the raw text between the quotes was used verbatim, so the backslash stayed in the value.

| Expression  | 2.x       | 3.0.0    |
| ----------- | --------- | -------- |
| `'it\'s'`   | `it\'s`   | `it's`   |
| `"a\"b"`    | `a\"b`    | `a"b`    |
| `'c:\\tmp'` | `c:\\tmp` | `c:\tmp` |

**Nothing else changes.** Only string literals containing a backslash behave differently. Arithmetic, comparison, logic, bitwise operators, concatenation, collections, ranges, attribute access, functions and error messages are all unchanged, for both `evaluate()` and `compile()`.

**Your regex patterns are safe.** Unrecognized escapes are passed through untouched, so `'\d'`, `'\w'` and `'\n'` reach `matches` exactly as before and every existing pattern such as `'/^\d{4}-\d{2}$/'` keeps working.

**Migration.** Only doubled backslashes change meaning. If you doubled them to work around the old behavior, remove the doubling:

```diff
- '2026-07' matches '/^\\d{4}/'   // was a literal backslash, never matched
+ '2026-07' matches '/^\d{4}/'    // digit class
```

To match a literal backslash, write `'/\\\\d/'`.

#### `Parser.parse()` and `Parser.lint()` validate the `names` argument

Passing a non-array `names` now throws `TypeError: The "names" argument must be an array.`

For almost everyone this is a better message rather than a change in behavior. `null` and `undefined` already threw `TypeError: Cannot read properties of undefined (reading 'length')`, so the error class is unchanged and existing `catch` blocks behave the same. Going through `ExpressionLanguage` — `evaluate()`, `compile()`, `parse()`, `lint()` — nothing changes at all.

The one real break is calling the exported `Parser` class directly with a bare string: `parser.parse(stream, 'a')` was treated as `['a']` and now throws. Pass an array.

### Added

- **Opt-in function providers** behind a new `/providers` entry point, shipped as ESM, CJS, UMD and typings. They are not part of the core bundle, and — like the rest of the package — carry no runtime dependencies.

  ```ts
  import { ExpressionLanguage } from '@andreasnicolaou/typescript-expression-language';
  import { StringProvider } from '@andreasnicolaou/typescript-expression-language/providers';

  const el = new ExpressionLanguage(undefined, [new StringProvider()]);
  el.evaluate('strtoupper(substr(name, 0, 3))', { name: 'andreas' }); // "AND"
  ```

  | Provider         | Functions                                                                                                                                                   |
  | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `MathProvider`   | `abs`, `ceil`, `floor`, `round`, `sqrt`, `pow`                                                                                                              |
  | `StringProvider` | `strtolower`, `strtoupper`, `strlen`, `trim`, `ltrim`, `rtrim`, `ucfirst`, `lcfirst`, `ucwords`, `strrev`, `explode`, `str_replace`, `substr`               |
  | `ArrayProvider`  | `count`, `implode`, `array_keys`, `array_values`, `array_merge`, `array_reverse`, `array_unique`, `array_sum`, `in_array`, `array_intersect`, `array_slice` |
  | `DateProvider`   | `checkdate`, `date`, `date_parse`, `gmdate`, `gmmktime`, `mktime`, `strtotime`, `time`                                                                      |

  `MathProvider` omits `min`/`max`, which are registered by default. `DateProvider` uses PHP **second** timestamps.

- A **By example** section in the README listing every supported literal, operator, conditional, collection and function form alongside the value it evaluates to.

## [2.0.0] - 2026-07-21

Releases up to and including 2.0.0 are documented in the [GitHub releases](https://github.com/andreasnicolaou/typescript-expression-language/releases).

[3.2.0]: https://github.com/andreasnicolaou/typescript-expression-language/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/andreasnicolaou/typescript-expression-language/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/andreasnicolaou/typescript-expression-language/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/andreasnicolaou/typescript-expression-language/releases/tag/v2.0.0

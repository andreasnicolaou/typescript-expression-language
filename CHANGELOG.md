# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[3.0.0]: https://github.com/andreasnicolaou/typescript-expression-language/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/andreasnicolaou/typescript-expression-language/releases/tag/v2.0.0

# TypeScript Symfony Expression Language

A **TypeScript implementation** of the popular **Symfony Expression Language**. This library allows you to evaluate complex expressions **client-side**, fully mirroring the functionality of the PHP version.

Use it to create dynamic and flexible expression-based logic on the frontend, perfectly synchronized with the server-side implementation in Symfony/PHP.

![TypeScript](https://img.shields.io/badge/TS-TypeScript-3178c6?logo=typescript&logoColor=white)
![GitHub contributors](https://img.shields.io/github/contributors/andreasnicolaou/typescript-expression-language)
![GitHub License](https://img.shields.io/github/license/andreasnicolaou/typescript-expression-language)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/andreasnicolaou/typescript-expression-language/build.yaml)
![GitHub package.json version](https://img.shields.io/github/package-json/v/andreasnicolaou/typescript-expression-language)
[![Known Vulnerabilities](https://snyk.io/test/github/andreasnicolaou/typescript-expression-language/badge.svg)](https://snyk.io/test/github/andreasnicolaou/typescript-expression-language)
![Bundle Size](https://deno.bundlejs.com/badge?q=@andreasnicolaou/typescript-expression-language&treeshake=[*])

![ESLint](https://img.shields.io/badge/linter-eslint-4B32C3.svg?logo=eslint)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier)
![Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?logo=jest)
![Maintenance](https://img.shields.io/maintenance/yes/2025)
[![codecov](https://codecov.io/gh/andreasnicolaou/typescript-expression-language/graph/badge.svg?token=ELH4YWG68O)](https://codecov.io/gh/andreasnicolaou/typescript-expression-language)
[![Socket Badge](https://badge.socket.dev/npm/package/@andreasnicolaou/typescript-expression-language)](https://badge.socket.dev/npm/package/@andreasnicolaou/typescript-expression-language)

![NPM Downloads](https://img.shields.io/npm/dm/%40andreasnicolaou%2Ftypescript-expression-language)

<details>
  <summary>📊 Code Coverage Visualizations</summary>
  <br/>

### Tree View

![Tree Coverage](https://codecov.io/gh/andreasnicolaou/typescript-expression-language/graphs/tree.svg?token=ELH4YWG68O)

---

### Sunburst View

![Sunburst Coverage](https://codecov.io/gh/andreasnicolaou/typescript-expression-language/graphs/sunburst.svg?token=ELH4YWG68O)

---

### Icicle View

![Icicle Coverage](https://codecov.io/gh/andreasnicolaou/typescript-expression-language/graphs/icicle.svg?token=ELH4YWG68O)

</details>

## ![GitHub Repo stars](https://img.shields.io/github/stars/andreasnicolaou/typescript-expression-language)

## 🧪 Demo

You can try this library live:

👉 <a href="https://stackblitz.com/edit/vitejs-vite-wzv1j5ar" target="_blank">Interactive Demo on StackBlitz</a>

🌐 <a href="https://andreasnicolaou.github.io/typescript-expression-language/" target="_blank">UMD Build Test on GitHub Pages</a>

---

## ✨ Features

- **Full Symfony Compatibility**: Write expressions that work the same way on both client and server.
- **Zero Dependencies**: Self-contained library with no external runtime dependencies.
- **Rich Syntax Support**: Includes numbers, strings, operators, functions, and advanced object/array access.
- **Customizable Operators**: Define your own operators or extend existing ones.
- **Brackets and Nesting**: Handle deeply nested brackets with accurate syntax validation.
- **Error Detection**: Detect and report invalid syntax with meaningful error messages.
- **Word-Based Operators**: Supports expressions like `starts with`, `not in`, `ends with`, `contains`, `matches`, `xor`, and more!
- **TypeScript Ready**: Fully typed, ensuring seamless integration into TypeScript projects.
- **Universal Compatibility**: Works in Node.js (ESM/CommonJS), browsers (UMD), and TypeScript projects.
- **Professional Build**: Multiple output formats with tree-shaking support and optimized bundles.

---

## 📦 Installation & Module Support

This library provides **universal compatibility** across all JavaScript environments:

### Package Managers

```bash
# npm
npm install @andreasnicolaou/typescript-expression-language

# yarn
yarn add @andreasnicolaou/typescript-expression-language

# pnpm
pnpm add @andreasnicolaou/typescript-expression-language
```

### CDN Usage

For direct browser usage without a build step:

```html
<!-- unpkg CDN (latest version, unminified) -->
<script src="https://unpkg.com/@andreasnicolaou/typescript-expression-language/dist/index.umd.js"></script>

<!-- unpkg CDN (latest version, minified) -->
<script src="https://unpkg.com/@andreasnicolaou/typescript-expression-language/dist/index.umd.min.js"></script>

<!-- jsDelivr CDN (unminified) -->
<script src="https://cdn.jsdelivr.net/npm/@andreasnicolaou/typescript-expression-language/dist/index.umd.js"></script>

<!-- jsDelivr CDN (minified) -->
<script src="https://cdn.jsdelivr.net/npm/@andreasnicolaou/typescript-expression-language/dist/index.umd.min.js"></script>
```

**CDN Benefits:**

- ✅ No build step required
- ✅ Cached across websites for faster loading
- ✅ Perfect for prototyping and demos
- ✅ Works in any HTML page immediately
- ✅ Choose minified (`.min.js`) for production, or unminified (`.js`) for debugging

### Module Format Support

- **🟢 ESM (ES Modules)**: For modern bundlers and Node.js
- **🟢 CommonJS**: For traditional Node.js projects
- **🟢 UMD (Unminified & Minified)**: For direct browser usage via CDN - use `.umd.js` for debugging, `.umd.min.js` for production
- **🟢 TypeScript**: Complete type definitions included

### Usage Examples

#### ES Modules (Recommended)

```typescript
import { ExpressionLanguage } from '@andreasnicolaou/typescript-expression-language';
```

#### CommonJS

```javascript
const { ExpressionLanguage } = require('@andreasnicolaou/typescript-expression-language');
```

#### Browser (UMD via CDN)

```html
<!-- Use .umd.js for debugging, .umd.min.js for production -->
<script src="https://unpkg.com/@andreasnicolaou/typescript-expression-language/dist/index.umd.min.js"></script>
<script>
  const el = new typescriptExpressionLanguage.ExpressionLanguage();
  console.log(el.evaluate('1 + 2 * 3')); // 7
</script>
```

#### Browser (ES Modules via CDN)

```html
<script type="module">
  import { ExpressionLanguage } from 'https://unpkg.com/@andreasnicolaou/typescript-expression-language/dist/index.js';

  const el = new ExpressionLanguage();
  console.log(el.evaluate('2 * (3 + 4)')); // 14
</script>
```

#### TypeScript

```typescript
// Full type safety and IntelliSense support
import { ExpressionLanguage, ParsedExpression } from '@andreasnicolaou/typescript-expression-language';
```

---

## 🚀 Quick Start

### Node.js (ESM)

```javascript
import { ExpressionLanguage } from '@andreasnicolaou/typescript-expression-language';

const el = new ExpressionLanguage();
console.log(el.evaluate('1 + 2 * 3')); // 7
```

### Node.js (CommonJS)

```javascript
const { ExpressionLanguage } = require('@andreasnicolaou/typescript-expression-language');

const el = new ExpressionLanguage();
console.log(el.evaluate('x + y', { x: 10, y: 5 })); // 15
```

### Browser (No Build Step)

```html
<!-- Use .umd.js for debugging, .umd.min.js for production -->
<script src="https://unpkg.com/@andreasnicolaou/typescript-expression-language/dist/index.umd.min.js"></script>
<script>
  const el = new typescriptExpressionLanguage.ExpressionLanguage();
  console.log(el.evaluate('"Hello " + name', { name: 'World' })); // "Hello World"
</script>
```

### Modern Browser (ES Modules)

```html
<script type="module">
  import { ExpressionLanguage } from 'https://unpkg.com/@andreasnicolaou/typescript-expression-language/dist/index.js';

  const el = new ExpressionLanguage();
  console.log(el.evaluate('Math.pow(2, 3)')); // 8
</script>
```

---

## 🔧 Setup

To get started, initialize the library in your project:

```typescript
import { ExpressionLanguage } from '@andreasnicolaou/typescript-expression-language';

const expressionLanguage = new ExpressionLanguage();
```

---

## 📖 Usage

Basic Evaluation

```typescript
const result = expressionLanguage.evaluate('1 + 2');
console.log(result); // Outputs → `3`
```

Multiple Clauses

```typescript
const expression = 'array[2] === "three" && obj.method(array[1]) === "value"';
const context = {
  array: ['one', 'two', 'three'],
  obj: {
    method: (arg: string) => `value`,
  },
};
const result = expressionLanguage.evaluate(expression, context);
console.log(result); // Outputs → `true`
```

Custom Functions

```typescript
const expressionFunction = ExpressionFunction.fromJs('isEvenFunction', (x: number): boolean => x % 2 === 0, 'isEven');
expressionLanguage.addFunction(expressionFunction);

const expression = 'isEven(10)';
const result = expressionLanguage.evaluate(expression);
console.log(result); // Outputs → `true`
```

---

## ⚙️ Configuration

### Custom LRU Cache

By default, the library uses an internal LRU cache for expression parsing optimization. If you need to use a custom cache configuration, you'll need to install the `lru-cache` package separately and pass your own instance:

```bash
# Install lru-cache for custom cache usage
npm install lru-cache
```

```typescript
import { LRUCache } from 'lru-cache';
import { ExpressionLanguage, ParsedExpression } from '@andreasnicolaou/typescript-expression-language';

const customCache = new LRUCache<string, ParsedExpression>({
  max: 1000,
  ttl: 1000 * 60 * 5,
});

const expressionLanguage = new ExpressionLanguage(customCache);
```

### Custom Providers

#### Add a Simple Math Provider

```typescript
import {
  ExpressionLanguage,
  ExpressionFunction,
  ExpressionFunctionProvider,
} from '@andreasnicolaou/typescript-expression-language';

class MathProvider implements ExpressionFunctionProvider {
  getFunctions() {
    return [
      ExpressionFunction.fromJs('square', (x: number) => x * x),
      ExpressionFunction.fromJs('add', (x: number, y: number) => x + y),
    ];
  }
}

const el = new ExpressionLanguage();
el.registerProvider(new MathProvider());

console.log(el.evaluate('square(5)')); // Outputs → 25
console.log(el.evaluate('add(3, 4)')); // Outputs → 7
```

#### Add a Provider with Array and String Utilities

```typescript
import {
  ExpressionLanguage,
  ExpressionFunction,
  ExpressionFunctionProvider,
} from '@andreasnicolaou/typescript-expression-language';

class UtilsProvider implements ExpressionFunctionProvider {
  getFunctions() {
    return [
      ExpressionFunction.fromJs('isEven', (x: number) => x % 2 === 0),
      ExpressionFunction.fromJs('maxInArray', (arr: number[]) => Math.max(...arr)),
      ExpressionFunction.fromJs('join', (arr: string[], sep: string) => arr.join(sep)),
      ExpressionFunction.fromJs('strtolower', (str: string) => (str + '').toLowerCase()), // PHP strtolower
      ExpressionFunction.fromJs('strtoupper', (str: string) => (str + '').toUpperCase()), // PHP strtoupper
    ];
  }
}

const el = new ExpressionLanguage(null, [new UtilsProvider()]);

console.log(el.evaluate('isEven(10)')); // Outputs → true
console.log(el.evaluate('maxInArray([1, 5, 3, 9])')); // Outputs → 9
console.log(el.evaluate('join(["a", "b", "c"], ",")')); // Outputs → "a,b,c"
console.log(el.evaluate('strtolower("HELLO")')); // Outputs → "hello"
console.log(el.evaluate('strtoupper("world")')); // Outputs → "WORLD"
```

---

## 📋 Supported Syntax

### Operators

| Type       | Operators                                                                                    | Description               |
| ---------- | -------------------------------------------------------------------------------------------- | ------------------------- |
| Arithmetic | `+`, `-`, `*`, `/`, `%`                                                                      | Basic math operations     |
| Comparison | `==`, `!=`, `===`, `!==`, `<`, `<=`, `>`, `>=`                                               | Value comparison          |
| Logical    | `&&`, <code>&#124;&#124;</code>, `!`, `xor`                                                  | Logical AND, OR, NOT, XOR |
| Word-Based | `starts with`, `ends with`, `contains`, `matches`, `not`, `in`, `not in`, `and`, `or`, `xor` | Word-based logic          |
| Bitwise    | `&`, <code>&#124;</code> , `^`, `~`, `<<`, `>>`                                              | Bitwise operations        |
| Range      | `..`                                                                                         | Range (sequence)          |

### Data Access

| Syntax            | Description              |
| ----------------- | ------------------------ |
| `array[0]`        | Access array elements    |
| `obj.property`    | Access object properties |
| `obj.method(arg)` | Call object methods      |

### Functions

Add and register custom functions for flexible application logic.

---

## 🛠️ Available Functions

The library provides access to a comprehensive set of JavaScript functions. Some are **enabled by default**, while others can be registered using `ExpressionFunction.fromJs()`.

| Function             | Category | Enabled by Default | Description                                              | Example                                             |
| -------------------- | -------- | :----------------: | -------------------------------------------------------- | --------------------------------------------------- |
| `constant`           | Core     |         ✅         | Access global constants and nested properties            | `constant("CONFIG.API_URL")`                        |
| `enum`               | Core     |         ✅         | Access PHP-style and TypeScript-style enums              | `enum("Status.ACTIVE")`                             |
| `min`                | Math     |         ✅         | Returns the smallest of zero or more numbers             | `min(1, 2, 3)` → `1`                                |
| `max`                | Math     |         ✅         | Returns the largest of zero or more numbers              | `max(1, 2, 3)` → `3`                                |
| `now`                | Date     |         ✅         | Returns the current timestamp                            | `now()`                                             |
| `abs`                | Math     |         ❌         | Returns the absolute value of a number                   | `abs(-5)` → `5`                                     |
| `ceil`               | Math     |         ❌         | Rounds a number up to the nearest integer                | `ceil(3.2)` → `4`                                   |
| `floor`              | Math     |         ❌         | Rounds a number down to the nearest integer              | `floor(3.8)` → `3`                                  |
| `round`              | Math     |         ❌         | Rounds a number to the nearest integer                   | `round(3.5)` → `4`                                  |
| `random`             | Math     |         ❌         | Returns a pseudo-random number between 0 and 1           | `random()` → `0.123...`                             |
| `sqrt`               | Math     |         ❌         | Returns the square root of a number                      | `sqrt(9)` → `3`                                     |
| `pow`                | Math     |         ❌         | Returns base to the exponent power                       | `pow(2, 3)` → `8`                                   |
| `sin`                | Math     |         ❌         | Returns the sine of a number                             | `sin(Math.PI / 2)` → `1`                            |
| `cos`                | Math     |         ❌         | Returns the cosine of a number                           | `cos(0)` → `1`                                      |
| `tan`                | Math     |         ❌         | Returns the tangent of a number                          | `tan(0)` → `0`                                      |
| `keys`               | Array    |         ❌         | Returns the keys of an object                            | `keys(obj)`                                         |
| `values`             | Array    |         ❌         | Returns the values of an object                          | `values(obj)`                                       |
| `isArray`            | Array    |         ❌         | Checks if a value is an array                            | `isArray(arr)`                                      |
| `concat`             | Array    |         ❌         | Merges multiple arrays                                   | `concat(arr1, arr2)`                                |
| `from`               | Array    |         ❌         | Creates an array from an iterable                        | `from(iterable)`                                    |
| `of`                 | Array    |         ❌         | Creates a new array instance with the given elements     | `of(1, 2, 3)`                                       |
| `charAt`             | String   |         ❌         | Returns the character at a specific index                | `charAt('hello', 1)` → `'e'`                        |
| `charCodeAt`         | String   |         ❌         | Returns the Unicode value of the character at an index   | `charCodeAt('A', 0)` → `65`                         |
| `includes`           | String   |         ❌         | Checks if a string contains a substring                  | `includes('hello', 'ell')` → `true`                 |
| `indexOf`            | String   |         ❌         | Returns the index of the first occurrence of a substring | `indexOf('hello', 'e')` → `1`                       |
| `split`              | String   |         ❌         | Splits a string into an array by a separator             | `split('a,b,c', ',')` → `['a', 'b', 'c']`           |
| `trim`               | String   |         ❌         | Removes whitespace from both ends of a string            | `trim(' hello ')` → `'hello'`                       |
| `toUpperCase`        | String   |         ❌         | Converts a string to uppercase                           | `toUpperCase('hello')` → `'HELLO'`                  |
| `toLowerCase`        | String   |         ❌         | Converts a string to lowercase                           | `toLowerCase('HELLO')` → `'hello'`                  |
| `isFinite`           | Number   |         ❌         | Checks if a value is a finite number                     | `isFinite(100)` → `true`                            |
| `isInteger`          | Number   |         ❌         | Checks if a value is an integer                          | `isInteger(100.5)` → `false`                        |
| `isNaN`              | Number   |         ❌         | Checks if a value is NaN                                 | `isNaN(NaN)` → `true`                               |
| `toFixed`            | Number   |         ❌         | Formats a number to a fixed number of decimals           | `toFixed(3.14159, 2)` → `'3.14'`                    |
| `toISOString`        | Date     |         ❌         | Converts a date to an ISO string                         | `toISOString(new Date())`                           |
| `toDateString`       | Date     |         ❌         | Converts a date to a readable string                     | `toDateString(new Date())`                          |
| `getTime`            | Date     |         ❌         | Gets the timestamp of a date                             | `getTime(new Date())`                               |
| `getFullYear`        | Date     |         ❌         | Returns the year of a date                               | `getFullYear(new Date())`                           |
| `getMonth`           | Date     |         ❌         | Returns the month of a date (0-based)                    | `getMonth(new Date())`                              |
| `getDay`             | Date     |         ❌         | Returns the day of the week                              | `getDay(new Date())`                                |
| `getMinutes`         | Date     |         ❌         | Returns the minutes of a date                            | `getMinutes(new Date())`                            |
| `stringify`          | JSON     |         ❌         | Converts a JavaScript object to a JSON string            | `stringify({ key: 'value' })` → `'{"key":"value"}'` |
| `parse`              | JSON     |         ❌         | Parses a JSON string into an object                      | `parse('{"key":"value"}')` → `{ key: 'value' }`     |
| `test`               | RegExp   |         ❌         | Tests if a pattern matches a string                      | `test(/abc/, 'abcdef')` → `true`                    |
| `exec`               | RegExp   |         ❌         | Executes a pattern and returns the match                 | `exec(/abc/, 'abcdef')` → `['abc']`                 |
| `decodeURI`          | URI      |         ❌         | Decodes a URI                                            | `decodeURI('%20space')` → `' space'`                |
| `encodeURI`          | URI      |         ❌         | Encodes a URI                                            | `encodeURI(' space')` → `'%20space'`                |
| `decodeURIComponent` | URI      |         ❌         | Decodes a URI component                                  | `decodeURIComponent('%20space')` → `' space'`       |
| `encodeURIComponent` | URI      |         ❌         | Encodes a URI component                                  | `encodeURIComponent(' space')` → `'%20space'`       |

---

## ⚠️ IGNORE_UNKNOWN_VARIABLES & IGNORE_UNKNOWN_FUNCTIONS

When linting or parsing expressions, you may want to ignore errors about unknown variables or functions. The library provides two flags for this purpose:

- `Parser.IGNORE_UNKNOWN_VARIABLES`: Ignores unknown variables during linting/parsing.
- `Parser.IGNORE_UNKNOWN_FUNCTIONS`: Ignores unknown functions during linting/parsing.
- You can combine both flags using the bitwise OR operator (`|`): `Parser.IGNORE_UNKNOWN_VARIABLES | Parser.IGNORE_UNKNOWN_FUNCTIONS` to ignore both unknown variables and functions.

### Usage

Import the `Parser` and use the flags as the third argument to `lint` or `parse`:

```typescript
import { ExpressionLanguage } from '@andreasnicolaou/typescript-expression-language';
import { Parser } from '@andreasnicolaou/typescript-expression-language/dist/parser';

const el = new ExpressionLanguage();

// Ignore unknown variables
el.lint('foo + 1', [], Parser.IGNORE_UNKNOWN_VARIABLES); // Does not throw
el.parse('foo + 1', [], Parser.IGNORE_UNKNOWN_VARIABLES); // Does not throw

// Ignore unknown functions
el.lint('myFunc(42)', [], Parser.IGNORE_UNKNOWN_FUNCTIONS); // Does not throw
el.parse('myFunc(42)', [], Parser.IGNORE_UNKNOWN_FUNCTIONS); // Does not throw

// Ignore both unknown variables and functions
el.lint('foo + myFunc(42)', [], Parser.IGNORE_UNKNOWN_VARIABLES | Parser.IGNORE_UNKNOWN_FUNCTIONS); // Does not throw
el.parse('foo + myFunc(42)', [], Parser.IGNORE_UNKNOWN_VARIABLES | Parser.IGNORE_UNKNOWN_FUNCTIONS); // Does not throw
```

These flags are available on both `lint` and `parse` methods. They are intended for static analysis and editor tooling only. At runtime, if a variable or function is actually missing during evaluation, an error will still be thrown.

---

## 🛠️ Error Handling

The library is equipped with robust error detection to ensure smooth debugging of invalid expressions. Below are the common error types and how they are reported:

### 🔄 Common Errors

#### **1. Unmatched Brackets**

- **Description**: The library throws a `SyntaxError` when brackets (`()`, `{}`, `[]`) are unmatched or unbalanced in an expression.
- **Example**:
  ```text
  (a + b
  ```

#### **2. Invalid Syntax**

- **Description**: The library throws a `SyntaxError` when an expression contains invalid syntax.
- **Example**:
  ```text
  a + b +
  ```

#### **3. Undefined Variable**

- **Description**: The library throws a `SyntaxError` when it detects an invalid or misplaced character that does not belong to the syntax.
- **Example**:
  ```text
  a + 5 @
  ```

---

## 🎯 Use Cases

Here are some practical use cases where the TypeScript Symfony Expression Language can be applied:

### **1. Dynamic UI Logic**

- **Description**: Evaluate conditions to dynamically show or hide components based on user input or other variables.
- **Example**: Show a form field only if a certain checkbox is checked or display a message when specific conditions are met.

### **2. Custom Filters**

- **Description**: Build advanced filtering systems for grids, tables, or reports, allowing users to filter data based on complex expressions.
- **Example**: Create filters for product listings that use multiple criteria such as price range, availability, or category.

### **3. Formulas and Calculations**

- **Description**: Compute user-defined formulas directly on the client-side, such as calculating discounts, tax rates, or other financial values.
- **Example**: Allow users to input values in a form and instantly calculate the total cost or apply discounts.

### **4. Interactive Widgets**

- **Description**: Power interactive components (such as sliders, charts, or dashboards) with user-defined expressions for maximum flexibility and real-time updates.
- **Example**: Use a slider to dynamically adjust a value or a chart that updates based on user-selected filters or criteria.

These use cases demonstrate how the library can bring advanced, real-time logic directly to the frontend, providing a more interactive and dynamic user experience.

---

## 🛡️ Symfony Compatibility

This library ensures that expressions written in PHP's **Symfony Expression Language** are fully compatible with the client-side implementation. This enables seamless integration between server-side logic (written in Symfony/PHP) and client-side expression evaluation.

### **Key Benefits:**

- **Consistency**: Expressions behave the same way on both the client and the server.
- **Synchronization**: Ensure business logic is applied consistently across both sides of the application without discrepancies.
- **Easy Integration**: Easily synchronize the logic between your PHP backend and TypeScript frontend, without needing separate implementations.

This compatibility makes it easier to create unified and maintainable applications that share the same logic across the stack.

---

## 🔧 Development

### Building from Source

The library uses a professional build system with **Rollup** and **TypeScript**:

```bash
# Clone the repository
git clone https://github.com/andreasnicolaou/typescript-expression-language.git
cd typescript-expression-language

# Install dependencies
npm install

# Run the build (generates all formats)
npm run build
```

### Build Output

The build process generates multiple optimized bundles:

- `dist/index.js` - **ESM bundle** for modern environments
- `dist/index.cjs` - **CommonJS bundle** for Node.js
- `dist/index.umd.js` - **UMD bundle (unminified)** for browsers (debugging)
- `dist/index.umd.min.js` - **UMD bundle (minified)** for browsers (production)
- `dist/index.d.ts` - **TypeScript declarations** for full type support

### Available Scripts

```bash
npm run build      # Build all formats (ESM, CJS, UMD, types)
npm test           # Run Jest test suite
npm run test:watch # Run tests in watch mode
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

---

## 📦 Contribution

Contributions are welcome! If you encounter issues or have ideas to enhance the library, feel free to submit an **issue** or **pull request**.

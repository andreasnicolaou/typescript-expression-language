# TypeScript Symfony Expression Language

A **TypeScript implementation** of the popular **Symfony Expression Language**. This library allows you to evaluate complex expressions **client-side**, fully mirroring the functionality of the PHP version.

Use it to create dynamic and flexible expression-based logic on the frontend, perfectly synchronized with the server-side implementation in Symfony/PHP.

![TypeScript](https://img.shields.io/badge/TS-TypeScript-3178c6?logo=typescript&logoColor=white)
![GitHub contributors](https://img.shields.io/github/contributors/andreasnicolaou/typescript-expression-language)
![GitHub License](https://img.shields.io/github/license/andreasnicolaou/typescript-expression-language)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/andreasnicolaou/typescript-expression-language/build.yaml)
![GitHub package.json version](https://img.shields.io/github/package-json/v/andreasnicolaou/typescript-expression-language)
[![Known Vulnerabilities](https://snyk.io/test/github/andreasnicolaou/typescript-expression-language/badge.svg)](https://snyk.io/test/github/andreasnicolaou/typescript-expression-language)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/@andreasnicolaou/typescript-expression-language)

![ESLint](https://img.shields.io/badge/linter-eslint-4B32C3.svg?logo=eslint)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier)
![Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?logo=jest)
![Maintenance](https://img.shields.io/maintenance/yes/2025)
[![codecov](https://codecov.io/gh/andreasnicolaou/typescript-expression-language/graph/badge.svg?token=ELH4YWG68O)](https://codecov.io/gh/andreasnicolaou/typescript-expression-language)

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

You can try this library live on StackBlitz:

👉 <a href="https://stackblitz.com/edit/vitejs-vite-wzv1j5ar" target="_blank">Open in StackBlitz</a>

---

## ✨ Features

- **Full Symfony Compatibility**: Write expressions that work the same way on both client and server.
- **Rich Syntax Support**: Includes numbers, strings, operators, functions, and advanced object/array access.
- **Customizable Operators**: Define your own operators or extend existing ones.
- **Brackets and Nesting**: Handle deeply nested brackets with accurate syntax validation.
- **Error Detection**: Detect and report invalid syntax with meaningful error messages.
- **Word-Based Operators**: Supports expressions like `starts with`, `not in`, `ends with`, `contains`, `matches`, and more!
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
<!-- unpkg CDN (latest version) -->
<script src="https://unpkg.com/@andreasnicolaou/typescript-expression-language/dist/index.umd.js"></script>

<!-- unpkg CDN (pinned version - recommended) -->
<script src="https://unpkg.com/@andreasnicolaou/typescript-expression-language@1.1.6/dist/index.umd.js"></script>

<!-- jsDelivr CDN -->
<script src="https://cdn.jsdelivr.net/npm/@andreasnicolaou/typescript-expression-language/dist/index.umd.js"></script>
```

**CDN Benefits:**

- ✅ No build step required
- ✅ Cached across websites for faster loading
- ✅ Perfect for prototyping and demos
- ✅ Works in any HTML page immediately

### Module Format Support

- **🟢 ESM (ES Modules)**: For modern bundlers and Node.js
- **🟢 CommonJS**: For traditional Node.js projects
- **🟢 UMD**: For direct browser usage via CDN
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
<script src="https://unpkg.com/@andreasnicolaou/typescript-expression-language/dist/index.umd.js"></script>
<script>
  const el = new TypescriptExpressionLanguage.ExpressionLanguage();
  const result = el.evaluate('1 + 2 * 3');
  console.log(result); // 7
</script>
```

#### Browser (ES Modules via CDN)

```html
<script type="module">
  import { ExpressionLanguage } from 'https://unpkg.com/@andreasnicolaou/typescript-expression-language/dist/index.js';

  const el = new ExpressionLanguage();
  const result = el.evaluate('2 * (3 + 4)');
  console.log(result); // 14
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
<script src="https://unpkg.com/@andreasnicolaou/typescript-expression-language/dist/index.umd.js"></script>
<script>
  const el = new TypescriptExpressionLanguage.ExpressionLanguage();
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

## 📋 Supported Syntax

### Operators

#### Arithmetic

- `+`, `-`, `*`, `/`, `%`

#### Comparison

- `==`, `!=`, `<`, `<=`, `>`, `>=`

#### Logical

- `&&`, `||`, `!`

#### Word-Based

- `starts with`, `ends with`, `contains`, `matches`, `not`, `in`, `not in`, `and`, `or`, `xor`

#### Bitwise

- `&`, `|`, `^`, `~`, `<<`, `>>`

---

### Data Access

- **Access array elements**: `array[0]`
- **Access object properties**: `obj.property`
- **Call methods**: `obj.method(arg)`

---

### Functions

Add and register custom functions for flexible application logic.

---

## 🛠️ Built-in Functions

The library includes a comprehensive set of built-in JavaScript functions to handle various operations. These functions are categorized as follows:

### Array Functions

- `keys`: Returns the keys of an object.  
  Example: `keys(obj)`
- `values`: Returns the values of an object.  
  Example: `values(obj)`
- `isArray`: Checks if a value is an array.  
  Example: `isArray(arr)`
- `concat`: Merges multiple arrays.  
  Example: `concat(arr1, arr2)`
- `from`: Creates an array from an iterable.  
  Example: `from(iterable)`
- `of`: Creates a new array instance with the given elements.  
  Example: `of(1, 2, 3)`

---

### String Functions

- `charAt`: Returns the character at a specific index.  
  Example: `charAt('hello', 1)` → `'e'`
- `charCodeAt`: Returns the Unicode value of the character at a specific index.  
  Example: `charCodeAt('A', 0)` → `65`
- `includes`: Checks if a string contains a substring.  
  Example: `includes('hello', 'ell')` → `true`
- `indexOf`: Returns the index of the first occurrence of a substring.  
  Example: `indexOf('hello', 'e')` → `1`
- `split`: Splits a string into an array by a separator.  
  Example: `split('a,b,c', ',')` → `['a', 'b', 'c']`
- `trim`: Removes whitespace from both ends of a string.  
  Example: `trim(' hello ')` → `'hello'`
- `toUpperCase`: Converts a string to uppercase.  
  Example: `toUpperCase('hello')` → `'HELLO'`
- `toLowerCase`: Converts a string to lowercase.  
  Example: `toLowerCase('HELLO')` → `'hello'`

---

### Number Functions

- `isFinite`: Checks if a value is a finite number.  
  Example: `isFinite(100)` → `true`
- `isInteger`: Checks if a value is an integer.  
  Example: `isInteger(100.5)` → `false`
- `isNaN`: Checks if a value is NaN.  
  Example: `isNaN(NaN)` → `true`
- `toFixed`: Formats a number to a fixed number of decimals.  
  Example: `toFixed(3.14159, 2)` → `'3.14'`

---

### Date Functions

- `now`: Returns the current timestamp.  
  Example: `now()`
- `toISOString`: Converts a date to an ISO string.  
  Example: `toISOString(new Date())`
- `toDateString`: Converts a date to a readable string.  
  Example: `toDateString(new Date())`
- `getTime`: Gets the timestamp of a date.  
  Example: `getTime(new Date())`
- `getFullYear`: Returns the year of a date.  
  Example: `getFullYear(new Date())`
- `getMonth`: Returns the month of a date (0-based).  
  Example: `getMonth(new Date())`
- `getDay`: Returns the day of the week.  
  Example: `getDay(new Date())`
- `getMinutes`: Returns the minutes of a date.  
  Example: `getMinutes(new Date())`

---

### JSON Functions

- `stringify`: Converts a JavaScript object to a JSON string.  
  Example: `stringify({ key: 'value' })` → `'{"key":"value"}'`
- `parse`: Parses a JSON string into an object.  
  Example: `parse('{"key":"value"}')` → `{ key: 'value' }`

---

### Regular Expression Functions

- `test`: Tests if a pattern matches a string.  
  Example: `test(/abc/, 'abcdef')` → `true`
- `exec`: Executes a pattern and returns the match.  
  Example: `exec(/abc/, 'abcdef')` → `['abc']`

---

### URI Functions

- `decodeURI`: Decodes a URI.  
  Example: `decodeURI('%20space')` → `' space'`
- `encodeURI`: Encodes a URI.  
  Example: `encodeURI(' space')` → `'%20space'`
- `decodeURIComponent`: Decodes a URI component.  
  Example: `decodeURIComponent('%20space')` → `' space'`
- `encodeURIComponent`: Encodes a URI component.  
  Example: `encodeURIComponent(' space')` → `'%20space'`

---

### Math Functions

All functions from JavaScript's `Math` object are included, such as:

- `abs`, `ceil`, `floor`, `round`, `max`, `min`, `random`, `sqrt`, `pow`, `sin`, `cos`, `tan`, etc.

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
- `dist/index.umd.js` - **UMD bundle** for browsers
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

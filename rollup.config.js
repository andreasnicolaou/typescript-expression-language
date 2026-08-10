import { codecovRollupPlugin } from '@codecov/rollup-plugin';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

/**
 * Keeps the core types out of `dist/providers.d.ts` by rewriting the relative
 * imports the provider sources use into an external import from `./index`.
 * @type {import('rollup').Plugin}
 */
const importCoreTypesFromMainEntry = {
  name: 'import-core-types-from-main-entry',
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- rollup hook, and a .js config cannot carry a TS annotation
  resolveId(source) {
    // The `.js` extension is required by `moduleResolution: node16`/`nodenext`;
    // TypeScript maps it back to `index.d.ts` under every resolution mode.
    return source === '../expression-function' || source === '../expression-language'
      ? { id: './index.js', external: true }
      : null;
  },
};

export default [
  // ESM build
  {
    input: 'src/index.ts',
    external: ['node:diagnostics_channel'],
    output: {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: false,
    },
    plugins: [
      resolve({ preferBuiltins: false }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        tslib: 'bundled',
      }),
      codecovRollupPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: 'typescript-expression-language',
        uploadToken: process.env.CODECOV_TOKEN,
        gitService: 'github',
        debug: true,
      }),
    ],
  },
  // CommonJS build
  {
    input: 'src/index.ts',
    external: ['node:diagnostics_channel'],
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: false,
      exports: 'named',
    },
    plugins: [
      resolve({ preferBuiltins: false }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        tslib: 'bundled',
      }),
    ],
  },
  // UMD build (for browser) - unminified
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'typescriptExpressionLanguage',
      sourcemap: false,
    },
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        tslib: 'bundled',
      }),
    ],
  },
  // UMD build (for browser) - minified
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'typescriptExpressionLanguage',
      sourcemap: false,
    },
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        tslib: 'bundled',
      }),
      terser(),
    ],
  },
  // Providers entry point (opt-in) - ESM
  {
    input: 'src/providers/index.ts',
    external: ['node:diagnostics_channel'],
    output: {
      file: 'dist/providers.js',
      format: 'es',
      sourcemap: false,
    },
    plugins: [
      resolve({ preferBuiltins: false }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        tslib: 'bundled',
      }),
    ],
  },
  // Providers entry point (opt-in) - CommonJS
  {
    input: 'src/providers/index.ts',
    external: ['node:diagnostics_channel'],
    output: {
      file: 'dist/providers.cjs',
      format: 'cjs',
      sourcemap: false,
      exports: 'named',
    },
    plugins: [
      resolve({ preferBuiltins: false }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        tslib: 'bundled',
      }),
    ],
  },
  // Providers entry point (opt-in) - UMD (for browser) - unminified
  {
    input: 'src/providers/index.ts',
    output: {
      file: 'dist/providers.umd.js',
      format: 'umd',
      name: 'typescriptExpressionLanguageProviders',
      sourcemap: false,
    },
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        tslib: 'bundled',
      }),
    ],
  },
  // Providers entry point (opt-in) - UMD (for browser) - minified
  {
    input: 'src/providers/index.ts',
    output: {
      file: 'dist/providers.umd.min.js',
      format: 'umd',
      name: 'typescriptExpressionLanguageProviders',
      sourcemap: false,
    },
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        tslib: 'bundled',
      }),
      terser(),
    ],
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
  // Providers type definitions
  {
    input: 'src/providers/index.ts',
    output: {
      file: 'dist/providers.d.ts',
      format: 'es',
    },
    // Re-declaring ExpressionFunction here would make it a *different* type to
    // consumers: TypeScript compares classes with private members nominally, so
    // `new ExpressionLanguage(undefined, [new StringProvider()])` would fail to
    // compile. Point the core types at the main entry instead of inlining them.
    plugins: [importCoreTypesFromMainEntry, dts()],
  },
];

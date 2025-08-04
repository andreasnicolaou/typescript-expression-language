import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  // ESM build
  {
    input: 'src/index.ts',
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
    ],
  },
  // CommonJS build
  {
    input: 'src/index.ts',
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
  // UMD build (for browser) - bundle all dependencies
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'TypescriptExpressionLanguage',
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
];

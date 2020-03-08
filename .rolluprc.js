/* eslint-disable import/no-extraneous-dependencies */

import babelPlugin from 'rollup-plugin-babel';
import common from 'rollup-plugin-commonjs';
import replacePlugin from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

import {
  dependencies,
  peerDependencies,
  version,
} from './package.json';

const yearNow = new Date().getFullYear();
const devYears = [2019];

if (devYears[0] < yearNow) devYears.push(yearNow);

const banner = `/*!
 * VueMu v${version}
 * (c) ${devYears.join('-')} Leonard Hertel
 * Released under the MIT License.
 */
`;

const babel = () => babelPlugin({
  babelrc: false,
  exclude: [/\/core-js\//],
  externalHelpers: true,
  presets: [
    [
      '@babel/env',
      {
        corejs: 3,
        targets: '> 1% and last 2 versions, not ie <= 10',
        useBuiltIns: 'usage',
      },
    ],
  ],
});

const replace = ({ silent = false } = {}) => replacePlugin({
  __VERSION__: JSON.stringify(version),
  __SILENT__: silent,
});

const input = () => ({
  input: 'src/main.js',
});

const output = (suffix, format, globals) => ({
  output: {
    file: `dist/vue-mu.${suffix}.js`,
    format,
    name: 'VueMu',
    banner,
    globals,
  },
});

export default [
  {
    ...input(),
    ...output('common', 'cjs'),
    external: [
      ...Object.keys(dependencies),
      ...Object.keys(peerDependencies),
    ],
    plugins: [
      replace(),
      resolve(),
      common(),
      babel(),
    ],
  },
  {
    ...input(),
    ...output('esm', 'es'),
    external: [
      ...Object.keys(dependencies),
      ...Object.keys(peerDependencies),
    ],
    plugins: [
      replace(),
      resolve(),
      common(),
      babel(),
    ],
  },
  {
    ...input(),
    ...output('umd', 'umd', { vue: 'Vue' }),
    external: Object.keys(peerDependencies),
    plugins: [
      replace(),
      resolve(),
      common(),
      babel(),
    ],
  },
  {
    ...input(),
    ...output('umd.min', 'umd', { vue: 'Vue' }),
    external: Object.keys(peerDependencies),
    plugins: [
      replace({
        silent: true,
      }),
      resolve(),
      common(),
      babel(),
      uglify({
        output: {
          comments: /^!/,
        },
      }),
    ],
  },
];

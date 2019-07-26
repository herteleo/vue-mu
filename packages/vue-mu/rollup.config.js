import babel from 'rollup-plugin-babel';
import common from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { version } from './package.json';

const yearNow = new Date().getFullYear();
const devYears = [2019];

if (devYears[0] < yearNow) devYears.push(yearNow);

const banner = `/*!
 * VueMu v${version}
 * (c) ${devYears.join('-')} Leonard Hertel
 * Released under the MIT License.
 */
`;

export default [
  {
    input: 'lib/vue-mu.js',
    output: {
      file: 'dist/vue-mu.common.js',
      format: 'cjs',
      name: 'VueMu',
      banner,
    },
    plugins: [
      babel(),
    ],
  },
  {
    input: 'lib/vue-mu.js',
    output: {
      file: 'dist/vue-mu.esm.js',
      format: 'es',
      name: 'VueMu',
      banner,
    },
    plugins: [
      babel(),
    ],
  },
  {
    input: 'lib/vue-mu.js',
    output: {
      file: 'dist/vue-mu.min.js',
      format: 'umd',
      name: 'VueMu',
      banner,
    },
    plugins: [
      resolve(),
      common(),
      babel(),
    ],
  },
];

import buble from 'rollup-plugin-buble';
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

export default {
  input: 'lib/vue-mu.js',
  plugins: [
    buble(),
  ],
  output: [
    {
      file: 'dist/vue-mu.common.js',
      format: 'cjs',
      name: 'VueMu',
      banner,
    },
    {
      file: 'dist/vue-mu.esm.js',
      format: 'es',
      name: 'VueMu',
      banner,
    },
    {
      file: 'dist/vue-mu.min.js',
      format: 'umd',
      name: 'VueMu',
      banner,
    },
  ],
};

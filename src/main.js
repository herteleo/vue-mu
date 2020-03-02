/* global __VERSION__, __SILENT__ */

import autoParse from 'auto-parse';
import camelCase from 'camelcase';
import Vue from 'vue';

import createNewVue from './utils/createNewVue';
import VueMuConfigPlugin from './utils/configPlugin';

let defaults = {
  el: undefined,
  ident: 'vue-mu',
  observe: false,
  silent: __SILENT__,
  strict: false,
  config: {},
};

export default class VueMu {
  static get defaults() {
    return defaults;
  }

  static set defaults(overrides) {
    defaults = {
      ...defaults,
      ...overrides,
    };
  }

  static get version() {
    return __VERSION__;
  }

  constructor(vueObject, options = {}) {
    if (typeof options === 'object') {
      this.options = { ...defaults, ...options };
    } else {
      this.options = { ...defaults };
    }

    const { el, ident } = this.options;
    this.ident = ident;
    this.vueObject = vueObject;

    if (el) {
      this.el = el;
    } else if (!el && typeof options === 'string') {
      this.el = options;
    }

    if (!this.el) {
      if (this.options.silent) return;
      throw Error('vue-mu: \'el\' is not defined.');
    }

    this.init();

    if (this.options.observe) {
      this.observe();
    }
  }

  init(selector = document) {
    const elSelector = `[data-${this.ident}-el="${this.el}"]`;
    const elements = Array.from(selector.querySelectorAll(elSelector));

    if (!elements.length) return;

    elements.forEach(el => this.createInstance(el));
  }

  observer(selector) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => this.init(m.target));
    });

    observer.observe(selector, {
      childList: true,
      subtree: true,
    });
  }

  observe() {
    const { observe } = this.options;
    const El = Element.prototype;
    const List = NodeList.prototype;

    if (typeof observe === 'boolean' && observe) {
      return this.observer(document.body);
    }

    if (El.isPrototypeOf.call(El, observe)) {
      return this.observer(observe);
    }

    if (List.isPrototypeOf.call(List, observe)) {
      return Array.from(observe).forEach(s => this.observer(s));
    }

    return false;
  }

  createConfigForInstance(el) {
    const { dataset } = el;

    const dataConfigSelector = camelCase(`${this.ident}-config`);
    const { strict: isStrictMode, silent: isSilent } = this.options;

    const baseConfig = this.options.config;
    const dataConfigObject = autoParse(dataset[dataConfigSelector]) || {};

    delete dataset[dataConfigSelector];

    const dataEntries = Object.entries(dataset);
    const omittedEntries = [];

    const dataConfig = dataEntries.reduce((_config, [prop, val]) => {
      if (!prop.startsWith(dataConfigSelector)) return _config;

      const config = _config;
      let propName = prop.slice(dataConfigSelector.length);
      propName = camelCase(propName);

      if (isStrictMode && !Object.prototype.hasOwnProperty.call(baseConfig, propName)) {
        omittedEntries.push(propName);
        return config;
      }

      config[propName] = autoParse(val);
      return config;
    }, dataConfigObject);

    if (omittedEntries.length && !isSilent) {
      throw Error(`vue-mu: 'strict' mode is active. There are unregistered config properties: ${omittedEntries.join(', ')}`);
    }

    return { ...baseConfig, ...dataConfig };
  }

  createInstance(el) {
    const VueInstance = createNewVue(Vue);
    const config = this.createConfigForInstance(el);

    VueInstance.use(VueMuConfigPlugin, { config });

    const vm = new VueInstance(this.vueObject);

    if (vm.$store) {
      vm.$store.$mu = {
        config,
      };
    }

    vm.$mount(el);
  }
}

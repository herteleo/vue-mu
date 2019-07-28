// https://github.com/vuejs/vue-test-utils/issues/2
// modified copy of https://github.com/vuejs/vue-test-utils/blob/dev/packages/test-utils/src/create-local-vue.js
/* eslint-disable no-underscore-dangle */
import cloneDeep from 'lodash.clonedeep';

function createLocalVue(_Vue) {
  const instance = _Vue.extend();

  // clone global APIs
  Object.keys(_Vue).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(instance, key)) {
      const original = _Vue[key];
      // cloneDeep can fail when cloning Vue instances
      // cloneDeep checks that the instance has a Symbol
      // which errors in Vue < 2.17 (https://github.com/vuejs/vue/pull/7878)
      try {
        instance[key] = typeof original === 'object' ? cloneDeep(original) : original;
      } catch (e) {
        instance[key] = original;
      }
    }
  });

  // config is not enumerable
  instance.config = cloneDeep(_Vue.config);

  instance.config.errorHandler = _Vue.config.errorHandler;

  // option merge strategies need to be exposed by reference
  // so that merge strats registered by plugins can work properly
  instance.config.optionMergeStrategies = _Vue.config.optionMergeStrategies;

  // make sure all extends are based on this instance.
  // this is important so that global components registered by plugins,
  // e.g. router-link are created using the correct base constructor
  instance.options._base = instance;

  // compat for vue-router < 2.7.1 where it does not allow multiple installs
  if (instance._installedPlugins && instance._installedPlugins.length) {
    instance._installedPlugins.length = 0;
  }
  const { use } = instance;
  instance.use = (_plugin, ...rest) => {
    const plugin = _plugin;
    if (plugin.installed === true) {
      plugin.installed = false;
    }
    if (plugin.install && plugin.install.installed === true) {
      plugin.install.installed = false;
    }
    use.call(instance, plugin, ...rest);
  };
  return instance;
}

export default createLocalVue;

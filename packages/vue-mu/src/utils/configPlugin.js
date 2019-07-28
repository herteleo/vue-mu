export default {
  install(_Vue, { config }) {
    const Vue = _Vue;

    Vue.prototype.$mu = {
      config,
    };
  },
};

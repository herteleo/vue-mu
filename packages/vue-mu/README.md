# vue-mu: Manage Multiple Vue.js Apps

Manage multiple instances of a Vue.js app with individual configuration.


## Introduction

`vue-mu` is a Vue.js plugin that helps you to manage Vue.js apps in environments, which serve multiple instances of the same Vue.js app with different configuration settings.


## Purpose

By default Vue.js does not provide a handsome way to configure instances of the same app independently.

Imagine a server side served dashboard page. This dashboard contains multiple same-looking widgets which display different table based contents provided by an API, each widget is a Vue.js app. The base for these widgets could easily be one single Vue.js app. But how do we configure these app instances independently? [You could do some inline-scripting](https://codeburst.io/passing-configuration-to-vue-js-1b96fa8f959)... Or you can use `vue-mu` and provide individual configuration properties via the html `data` attribute to each app instance.


## Installation


### Via CDN

Add `vue-mu` after `vue`:

```html
<!-- latest development version, includes helpful console warnings by default -->
<script src="https://cdn.jsdelivr.net/npm/vue-mu/dist/vue-mu.umd.js"></script>
<script src="https://unpkg.com/vue-mu/dist/vue-mu.umd.js"></script>

<!-- latest production version, minified and silent by default -->
<script src="https://cdn.jsdelivr.net/npm/vue-mu"></script>
<script src="https://unpkg.com/vue-mu"></script>
```

### Via NPM

```bash
npm install --save vue-mu
```

```js
import Vue from 'vue'; // replace vue
import VueMu from 'vue-mu'; // with vue-mu
```

Do not remove `vue` from your `package.json` and `node_modules`, it is used internally by `vue-mu`.


## Setup

`vue-mu` needs a new identifier, to load your app. Switch into the HTML code where your `<div id="app" />` entry container resides and make one modification:

```html
<div id="app"></div> <!-- replace this -->
<div data-vue-mu-el="myapp"></div> <!-- with this -->
```

Now you will notice, that your app won't mount anymore. Fix it by replacing the Vue.js initialization in your JavaScript code with `vue-mu`:

```js
// replace vue
new Vue({ /* vue configuration options */ }).$mount('#app');

// with vue-mu
new VueMu(
  { /* vue configuration options */ },
  { el: 'myapp', /* ...more vue-mu configuration options */ }
);
```


## Usage

Add configuration options via `data` attributes:

```html
<div
  data-vue-mu-el="myapp"
  data-vue-mu-config-hello="Hello from instance configuration"
  data-vue-mu-config-is-admin="true"
  data-vue-mu-config-price="90.99"
></div>
```

Use the new configuration properties inside your Vue.js app:

```js
{
  // some vue data, computed properties, methods...
  created() {
    console.log(this.$mu.config);
  }
}
```

If you've done everything right, this will print your new configuration properties to the console of your browser:

```js
// console.log() output inside devtools
{
  hello: 'Hello from instance configuration',
  isAdmin: true,
  price: 90.99
}
```

Does it? Congrats, you are now a successful user of `vue-mu`.


### Multiple instances

This is the hot stuff where `vue-mu` reveals its power. Duplicate the HTML entry element and make some changes inside the `data-vue-mu-config-*` attribute values of the new element. Reload the page. Now you should get two Vue.js app instances with different configuration.


### `this.$mu.config`

`this.$mu.config` is globally available in your app and contains all the configuation options you hand over via `data-vue-mu-config-*` attributes to the instance.

Access single configuration properties by typing `this.$mu.config.isAdmin`, `this.$mu.config.price`...


### Usage inside Vue.js templates

Use `vue-mu` configuration inside your Vue.js templates:

```html
<template>
  <div>{{ $mu.config.hello }}</div>
</template>
```


### Configuration property key format

All `data-vue-mu-config-*` attributes should be written in [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles) format. Inside the Vue.js app instance these config properties are available in camelCase format:

| HTML `data` attribute        | Access inside Vue.js
|------------------------------|---------------------
| `data-vue-mu-config-foobar`  | `this.$mu.config.foobar`
| `data-vue-mu-config-foo-bar` | `this.$mu.config.fooBar`


### Configuration property value format

As you may have already noticed, `vue-mu` automatically converts the values of the `data` config attributes into their natural format via [auto-parse](https://github.com/greenpioneersolutions/auto-parse). Some examples:

| HTML `data` attribute value         | Value format inside Vue.js
|-------------------------------------|--------------------
| `data-vue-mu-config-foo="Test"`     | String
| `data-vue-mu-config-foo="90.99"`    | Number
| `data-vue-mu-config-foo="true"`     | Boolean


### Global configuration property

You can use `data-vue-mu-config='{ "some": "json", "config": "data" }'` directly to pass all configuration properties at once. This can be combined with additive `data-vue-mu-config-*` attributes, which will in turn override duplicate properties defined in `data-vue-mu-config`.

```html
<div
  data-vue-mu-el="myapp"
  data-vue-mu-config='{
    "hello": "Hello from instance configuration",
    "isAdmin": true,
    "price": 90.99
  }'
  data-vue-mu-config-hello="Hello world!"
></div>
```

Results in:

```js
// console.log(this.$mu.config)
{
  hello: 'Hello world!',
  isAdmin: true,
  price: 90.99
}
```


## Options

| Format             | Required | Property   | Default value | Description
|--------------------|----------|------------|---------------|------------
| String             | `true`   | `el`       | `undefined`   | Identifier for the Vue.js app instances
| String             | `false`  | `ident`    | `'vue-mu'`    | Data attribute identifier `data-vue-mu-*`. Change this eg. to `app` if you want to access `vue-mu` by `data-app-*`.
| Boolean / Selector | `false`  | `observe`  | `false`       | Observe DOM changes and initialize app instances dynamically. `true` observes the whole document `<body>`, `document.querySelector('.foo')` or `document.querySelectorAll('.bar')` observes only changes in these elements. Selector elements must be present before `vue-mu` gets loaded.
| Boolean            | `false`  | `silent`   | `false` *     | If set to `false` `vue-mu` throws errors on misconfiguration (*: defaults `true` in minified browser/umd version)
| Boolean            | `false`  | `strict`   | `false`       | Only accept `data-vue-mu-config-*` properties defined in `config` option
| Object             | `false`  | `config`   | `{}`          | Use this to define a default configuration for instances, overwritable by `data` properties.

Example configuration:

```js
new VueMu(
  {
    // some vue data, computed properties, methods...
    created() {
      console.log(this.$mu.config);
    }
  },
  {
    el: 'myapp',
    ident: 'vue-mu',
    silent: false,
    strict: true,
    config: {
      hello: '',
      isAdmin: false,
    }
  }
);
```


## Advanced usage

### Usage inside Vuex

Access `vue-mu` configuration inside Vuex the same way you are using it inside your Vue.js app:

```js
new Vuex.Store({
  // state, getters, mutations
  actions: {
    someAction() {
      console.log(this.$mu.config.hello);
      // more action specific code
    }
  }
});
```


### Instance scoped Vuex

If you have multiple instances of the same app running Vuex, you may want to scope the store to each instance individually.

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// change this
export default new Vuex.Store({ /* store config */});

// to this
export default () => new Vuex.Store({ /* store config */});
```


### Global installation for multiple Vue.js apps

If multiple different apps use `vue-mu` you should think about loading `vue-mu` and `vue` globally (for example via CDN) to save bandwith and bundle size.

```html
<!-- entry elements go here -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-mu/dist/vue-mu.umd.js"></script>
<!-- import vue-app scripts here -->
```

If you are using `vue-cli` you should mark `vue` and `vue-mu` as external dependencies inside `vue.config.js` in each app:

```js
module.exports = {
  chainWebpack: (config) => {
    config.externals({
      vue: 'Vue',
      'vue-mu': 'VueMu',
    });
  },
};
```


### Global configuration defaults

Set some global defaults, used by every app. Apps can overwrite these defaults via their instance settings:

```html
<!-- entry elements go here -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-mu/dist/vue-mu.umd.js"></script>
<script>
VueMu.defaults = {
  strict: true,
  silent: false,
  // ...
};
</script>
<!-- import vue-app scripts here -->
```

---


**License**

vue-mu is licensed under the MIT license.

Copyright (C) 2019 Leonard Hertel

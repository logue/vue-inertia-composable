# Vue Inertia Composable

[![jsdelivr CDN](https://data.jsdelivr.com/v1/package/npm/vue-inertia-composable/badge)](https://www.jsdelivr.com/package/npm/vue-inertia-composable)
[![NPM Downloads](https://img.shields.io/npm/dm/vue-inertia-composable.svg?style=flat)](https://www.npmjs.com/package/vue-inertia-composable)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/vue-inertia-composable/file/README.md)
[![npm version](https://img.shields.io/npm/v/vue-inertia-composable.svg)](https://www.npmjs.com/package/vue-inertia-composable)
[![Open in Gitpod](https://shields.io/badge/Open%20in-Gitpod-green?logo=Gitpod)](https://gitpod.io/#https://github.com/logue/vue-inertia-composable)
[![Twitter Follow](https://img.shields.io/twitter/follow/logue256?style=plastic)](https://twitter.com/logue256)

A wrapper library for using [Inertia](https://inertiajs.com/) with the [Composition API](https://composition-api.vuejs.org/) in [Vue2](https://v2.vuejs.org/). Rewrite the function starting with `$` (such as `this.$inertia`) to use and use (ex. `const inertia = useInertia();`) it. Please note that due to the implementation of Vue Inertia, it is not always API compatible with Vue3 Inertia.

## Usage

Rewrite entry point script(such as `main.ts` or `app.js`).

```js
import './bootstrap';
import '../css/app.css';

import Vue from 'vue';
import { createInertiaApp } from '@inertiajs/inertia-vue';
import { InertiaProgress } from '@inertiajs/progress';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m';
import ziggy from 'ziggy-js';

/** Application Name */
const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: name =>
    resolvePageComponent(
      `./Pages/${name}.vue`,
      import.meta.glob('./Pages/**/*.vue')
    ),
  setup({ el, app, props, plugin }) {
    const App = new Vue({ render: h => h(app, props) });
    // Add route function.
    App.mixin({ methods: { route: ziggy } });
    // Regist Inertia Vue.
    App.use(plugin);
    // Since Ziggy here is declared globally, there is no import.
    // @ts-ignore
    App.use(ZiggyVue, Ziggy);

    // ... Add some components

    // Mount
    return App.$mount(el);
  },
});

InertiaProgress.init({ color: '#4B5563' });
```

The script tags of various vue files look like the following.

```vue
<template>
  <div class="container">
    <inertia-head title="Demo Page" />
    <input v-model="text" type="text" />
    <input v-model.number="no" type="number" />
    <button type="submit" @click="submit">Submit</button>
    <p><inertia-link :href="href">Link</inertia-link></p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useInertia, route, InertiaLink } from 'vue-inertia-composable';

import { Head as InertiaHead } from '@inertiajs/inertia-vue';

export default defineComponent({
  /** Using Components */
  components: {
    InertiaHead,
    InertiaLink,
  },
  /** Setup */
  setup() {
    /** get Inertia Instance */
    const inertia = useInertia();

    /** Form value */
    const form: Ref<{
      text: string;
      no: number;
      processing?: boolean;
    }> = ref({
      text: '',
      no: 0,
    });

    /** Form submit handler */
    const submit = () => {
      // console.log(form.value);
      inertia.post(route('target'), form.value, {
        onFinish: () => {
          console.log('submit to target');
        },
      });
    };

    return {
      form,
      submit,
    };
  },
});
</script>
```

## Available functions

These functions are basically used to access from within the `setup()` function.

| Function                                                                                                              | information                               |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `useInertia(): typeof Inertia & InertiaFormTrait`                                                                     | Alias of `Vue.$inertia`                   |
| `useHeadManager(): InertiaHeadManager`                                                                                | Alias of `Vue.$headManager`               |
| `usePage<SharedProps = Record<string, any>>(): Page<SharedProps>`                                                     | Alias of `Vue.$page`                      |
| `useForm<TForm = Record<string, any>>(args: TForm): InertiaForm<TForm>`                                               | Alias of `Vue.$inertia.form(...)`         |
| `route(name: string, params?: RouteParamsWithQueryOverload, RouteParam, absolute?: boolean, config?: Config): string` | Alias of `ziggy(...)` or `Vue.route(...)` |
| `InertiaLink`                                                                                                         | Experimental. See bellow.                 |

Originally defined PageProps are similar to key-value pairs, but the value type is defined as unknown. As it is, the TypeScript check doesn't go well, so I changed the value type to any.

### InertiaLink

This component was created experimentally because [@inertiajs/vue](https://github.com/inertiajs/inertia/tree/master/packages/inertia-vue)'s `InertiaLink` causes a type checking error. Not required if you don't use TypeScript.

## See also

- [laravel9-vite-vue2-starter](https://github.com/logue/laravel9-vite-vue2-starter) - Laravel9 + Breeze + Vue2
- [vite-vue2-ts-starter](https://github.com/logue/vite-vue2-ts-starter)

## LICENSE

[MIT](LICENSE)

&copy; 2022 by Logue.

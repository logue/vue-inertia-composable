# Vue Inertia Composable

[![jsdelivr CDN](https://data.jsdelivr.com/v1/package/npm/vue-inertia-composable/badge)](https://www.jsdelivr.com/package/npm/vue-inertia-composable)
[![NPM Downloads](https://img.shields.io/npm/dm/vue-inertia-composable.svg?style=flat)](https://www.npmjs.com/package/vue-inertia-composable)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/vue-inertia-composable/file/README.md)
[![npm version](https://img.shields.io/npm/v/vue-inertia-composable.svg)](https://www.npmjs.com/package/vue-inertia-composable)
[![Open in Gitpod](https://shields.io/badge/Open%20in-Gitpod-green?logo=Gitpod)](https://gitpod.io/#https://github.com/logue/vue-inertia-composable)

Wrapper library for [Vue2](https://v2.vuejs.org/) using [Inertia](https://inertiajs.com/) with [@vue/composition-api](https://github.com/vuejs/composition-api).

## Usage

Rewrite entry point script(such as `main.ts` or `app.js`).

```js
import './bootstrap';
import '../css/app.css';

import Vue from 'vue';
import VueCompositionAPI, { createApp, h } from '@vue/composition-api';
import { createInertiaApp } from '@inertiajs/inertia-vue';
import { InertiaProgress } from '@inertiajs/progress';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m';
import ziggy from 'ziggy-js';

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);

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
    const App = createApp({ render: () => h(app, props) });
    // Add route function.
    App.mixin({ methods: { route: ziggy } });
    // Regist Inertia Vue.
    App.use(plugin);
    // Since Ziggy here is declared globally, there is no import.
    // @ts-ignore
    App.use(ZiggyVue, Ziggy);
    // Mount
    return App.mount(el);
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
import { defineComponent, ref, type Ref } from '@vue/composition-api';
import { useInertia, route } from 'vue-inertia-composable';

import {
  Head as InertiaHead,
  Link as InertiaLink,
} from '@inertiajs/inertia-vue';

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

| Function           | information                               |
| ------------------ | ----------------------------------------- |
| `useInertia()`     | Alias of `Vue.$inertia`                   |
| `useHeadManager()` | Alias of `Vue.$headManager`               |
| `usePage()`        | Alias of `Vue.$page`                      |
| `route(...)`       | Alias of `ziggy(...)` or `Vue.route(...)` |

## See also

- [laravel9-vite-vue2-starter](https://github.com/logue/laravel9-vite-vue2-starter) - Laravel9 + Breeze + Vue2
- [vite-vue2-ts-starter](https://github.com/logue/vite-vue2-ts-starter)

## LICENSE

[MIT](LICENSE)

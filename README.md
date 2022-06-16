# Vue Inertia Composable

[![jsdelivr CDN](https://data.jsdelivr.com/v1/package/npm/vue-inertia-composable/badge)](https://www.jsdelivr.com/package/npm/vue-inertia-composable)
[![NPM Downloads](https://img.shields.io/npm/dm/vue-inertia-composable.svg?style=flat)](https://www.npmjs.com/package/vue-inertia-composable)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/vue-inertia-composable/file/README.md)
[![npm version](https://img.shields.io/npm/v/vue-inertia-composable.svg)](https://www.npmjs.com/package/vue-inertia-composable)
[![Open in Gitpod](https://shields.io/badge/Open%20in-Gitpod-green?logo=Gitpod)](https://gitpod.io/#https://github.com/logue/vue-inertia-composable)

Wrapper library for using [Inertia](https://inertiajs.com/) with [@vue/composition-api](https://github.com/vuejs/composition-api).

## Usage

Rewrite entry point script. (such as `main.ts` or `app.js`)

```js
import Vue from 'vue';
import VueCompositionAPI, { createApp, h } from '@vue/composition-api';

import { createInertiaApp } from '@inertiajs/inertia-vue';
import { importPageComponent } from '@/scripts/vite/import-page-component';
import { InertiaProgress } from '@inertiajs/progress';
import { ZiggyVue } from 'ziggy-js/dist/vue';
import ziggy from 'ziggy-js';

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);

/** Application Name */
const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

/** Register Vue to Inertia */
createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: name =>
    importPageComponent(name, import.meta.glob('../views/pages/**/*.vue')),
  setup({ el, app, props, plugin }) {
    /** Get data-page attribute */
    // @ts-ignore
    const page = JSON.parse(el.dataset.page);

    /** Vue Instance */
    const App = createApp({ render: () => h(app, props) });
    // Add route function.
    App.mixin({ methods: { route: ziggy } });
    // Register inertia
    App.use(plugin);
    // Register route
    App.use(ZiggyVue, page.props.ziggy);
    // Mount
    App.mount(el);
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

## LICENSE

[MIT](LICENSE)

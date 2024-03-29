import { fileURLToPath, URL } from 'node:url';

import { defineConfig, type UserConfig } from 'vite';

import { visualizer } from 'rollup-plugin-visualizer';
import banner from 'vite-plugin-banner';
import { checker } from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const config: UserConfig = {
    // https://vitejs.dev/config/#server-options
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
      },
    },
    plugins: [
      // vite-plugin-checker
      // https://github.com/fi3ework/vite-plugin-checker
      checker({
        typescript: true,
        // vueTsc: true,
        // eslint: { lintCommand: 'eslint' },
      }),
      // vite-plugin-banner
      // https://github.com/chengpeiquan/vite-plugin-banner
      banner(`/**
 * ${pkg.name}
 *
 * @description ${pkg.description}
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @copyright 2022-2023 By Masashi Yoshikawa All rights reserved.
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @see {@link ${pkg.homepage}}
 */
`),
      // vite-plugin-dts
      // https://github.com/qmhc/vite-plugin-dts
      dts(),
    ],
    optimizeDeps: {
      exclude: ['vue-demi'],
    },
    // Build Options
    // https://vitejs.dev/config/#build-options
    build: {
      lib: {
        entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        name: 'InertiaComposable',
        formats: ['umd', 'es', 'iife'],
        fileName: format => `index.${format}.js`,
      },
      rollupOptions: {
        plugins: [
          mode === 'analyze'
            ? // rollup-plugin-visualizer
              // https://github.com/btd/rollup-plugin-visualizer
              visualizer({
                open: true,
                filename: 'dist/stats.html',
                gzipSize: true,
                brotliSize: true,
              })
            : undefined,
        ],
        external: [
          '@inertiajs/vue2',
          '@inertiajs/inertia',
          'axios',
          'deepmerge',
          'has-symbols',
          'qs',
          'side-channel',
          'vue',
          'vue-demi',
          'ziggy-js',
        ],
        output: {
          globals: {
            '@inertiajs/vue2': 'InertiaVue2',
            '@inertiajs/inertia': 'Inertia',
            axios: 'Axios',
            deepmerge: 'Deepmerge',
            qs: 'Qs',
            'side-channel': 'SideChannel',
            vue: 'Vue',
            'vue-demi': 'VueDemi',
            'ziggy-js': 'ziggy',
          },
        },
      },
      target: 'esnext',
      minify: false,
    },
  };

  return config;
});

/**
 * Vue Inertia Composable
 *
 * @license MIT
 * @author Logue {@link logue@hotmail.co.jp}
 * @copyright 2022 Masashi Yoshikawa {@link https://logue.dev/} All rights reserved.
 * @see {@link https://github.com/logue/vue-inertia-composable}
 */

import { getCurrentInstance } from '@vue/composition-api';

import type { Page } from '@inertiajs/inertia';
import type { Router } from '@inertiajs/inertia/types/router';
import type {
  InertiaFormTrait,
  InertiaHeadManager,
} from '@inertiajs/inertia-vue';
import ziggy, {
  type Config,
  type RouteParam,
  type RouteParamsWithQueryOverload,
} from 'ziggy-js';

/**
 * Get head manager instance
 */
export function useHeadManager(): InertiaHeadManager {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error(`Should be used in setup().`);
  }
  return instance.proxy.$headManager;
}

/**
 * Get page instance
 */
export function usePage(): Page<any> {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error(`Should be used in setup().`);
  }
  return instance.proxy.$page;
}

/**
 * Get inertia instance
 */
export function useInertia(): Router & InertiaFormTrait {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error(`Should be used in setup().`);
  }
  return instance.proxy.$inertia;
}

/**
 * Get route instance
 */
export function route(
  name: string,
  params?: RouteParamsWithQueryOverload | RouteParam | undefined,
  absolute?: boolean | undefined,
  config?: Config | undefined
): string {
  /** Get Instance */
  const instance = getCurrentInstance();

  if (!instance) {
    // if not instance get ziggy directly
    return ziggy(name, params, absolute, config);
    // throw new Error(`Should be used in setup().`);
  }

  return instance.proxy.route(name, params, absolute, config);
}

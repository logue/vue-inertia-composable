import { getCurrentInstance } from 'vue-demi';
import ziggy from 'ziggy-js';

import type { Page, PageProps } from '@inertiajs/inertia';
import type { Router } from '@inertiajs/inertia/types/router';
import type {
  InertiaForm,
  InertiaFormTrait,
  InertiaHeadManager,
} from '@inertiajs/inertia-vue';
import type {
  Router as ZiggyRouter,
  Config,
  RouteParam,
  RouteParamsWithQueryOverload,
} from 'ziggy-js';

/**
 * Get head manager instance
 */
export function useHeadManager(): InertiaHeadManager {
  /** Vue instance */
  const instance = getCurrentInstance();
  if (instance) {
    return instance.proxy.$headManager;
  } else {
    warn();
  }
  return undefined as any;
}

/**
 * Get page instance
 */
export function usePage(): Page<PageProps> {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (instance) {
    return instance.proxy.$page;
  } else {
    warn();
  }
  return undefined as any;
}

/**
 * Get inertia instance
 */
export function useInertia(): Router & InertiaFormTrait {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (instance) {
    return instance.proxy.$inertia;
  } else {
    warn();
  }
  return undefined as any;
}

/**
 * Get Form
 */
export function useForm<T>(args: T): InertiaForm<T> {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (instance) {
    return instance.proxy.$inertia.form<T>(args);
  } else {
    warn();
  }
  return undefined as any;
}

/**
 * Get route instance
 */
export function route(
  name?: undefined,
  params?: RouteParamsWithQueryOverload | RouteParam,
  absolute?: boolean,
  config?: Config
): string | ZiggyRouter {
  /** Get Instance */
  const instance = getCurrentInstance();

  if (instance) {
    // @ts-ignore
    return instance.proxy.route(name, params, absolute, config);
  }
  // if not instance get ziggy directly
  return ziggy(name, params, absolute, config);
}

/** output warn message. */
const warn = () =>
  console.warn(
    `[Inertia Composable] getCurrentInstance() returned null. Method must be called at the top of a setup() function.`
  );

// @ts-ignore
if (window.route === undefined) {
  // @ts-ignore
  window.route = route;
}

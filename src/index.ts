import { getCurrentInstance } from 'vue-demi';
import ziggy from 'ziggy-js';

import { useForm as _useForm, usePage as _usePage } from '@inertiajs/vue2';
import type { Inertia } from '@inertiajs/inertia';
import type {
  Router,
  Config,
  RouteParam,
  RouteParamsWithQueryOverload,
} from 'ziggy-js';
import { InertiaLink, install } from './link';

import type { Page } from '@inertiajs/core';

/**
 * Get head manager instance
 */
export function useHeadManager() {
  /** Vue instance */
  const instance = getCurrentInstance();
  if (instance) {
    // @ts-ignore
    return instance.proxy.$headManager;
  } else {
    warn();
  }
  return undefined as any;
}

/**
 * Get page instance
 *
 * @deprecated use \@inertiajs/vue2's usePage().
 */
export function usePage<
  // Originally defined PageProps are similar to key-value pairs,
  // but the value type is defined as unknown.
  // As it is, the TypeScript check doesn't go well,
  // so I changed the value type to any.
  SharedProps = Record<string, any>
>(): Page<SharedProps> {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (instance) {
    // @ts-ignore
    return instance.proxy.$page as Page<SharedProps>;
  }
  return _usePage();
}

/**
 * Get inertia instance
 */
export function useInertia(): typeof Inertia {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (instance) {
    // @ts-ignore
    return instance.proxy.$inertia;
  } else {
    warn();
  }
  return undefined as any;
}

/**
 * Get Form
 *
 * @param data - Form Key-Value Pair.
 * @param rememberKey - Cancel token
 *
 * @deprecated use \@inertiajs/vue2's useForm()
 */
export function useForm<TForm = Record<string, any>>(
  rememberKey?: string,
  data?: TForm
): TForm {
  /** Get Instance */
  const instance = getCurrentInstance();

  if (rememberKey) {
    return instance
      ? // @ts-ignore
        instance.proxy.$inertia.form<TForm>(rememberKey, data)
      : _useForm(rememberKey, data);
  }
  return instance
    ? // @ts-ignore
      instance.proxy.$inertia.form<TForm>(data)
    : _useForm(data);
}

/**
 * Get route instance.
 *
 * @param name - router name.
 * @param params - query strings key value pair.
 * @param absolute - return to absolute url flag.
 * @param config - override confing. (Host, Port, etc.)
 */
export function route(
  name?: string,
  params?: RouteParamsWithQueryOverload | RouteParam,
  absolute?: boolean,
  config?: Config
): string | Router {
  /** Get Instance */
  const instance = getCurrentInstance();
  // @ts-ignore
  if (instance && instance.proxy.route) {
    // @ts-ignore
    return instance.proxy.route(name, params, absolute, config);
  }
  // if not instance get ziggy directly
  if (name) {
    // If name is defined, return string.
    return ziggy(name, params, absolute, config);
  }
  // If Name does not defined, return Route object
  return ziggy(undefined, params, absolute, config);
}

/** output warn message. */
const warn = () =>
  console.warn(
    `[Inertia Composable] getCurrentInstance() returned null. Method must be called at the top of a setup() function.`
  );

// For CDN.
// @ts-ignore
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.route = route;
}

export { InertiaLink, install };

import {
  useForm as _useForm,
  usePage as _usePage,
  type InertiaHeadManager,
} from '@inertiajs/vue2';
import { getCurrentInstance } from 'vue-demi';
import ziggy from 'ziggy-js';

import { InertiaLink, install } from './link';

import type { Page } from '@inertiajs/core';
import type { Inertia } from '@inertiajs/inertia';
import type { Config, RouteParams } from 'ziggy-js';

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
 *
 * @deprecated use \@inertiajs/vue2's usePage().
 */
export function usePage<
  // Originally defined PageProps are similar to key-value pairs,
  // but the value type is defined as unknown.
  // As it is, the TypeScript check doesn't go well,
  // so I changed the value type to any.
  PageProps extends Record<string, any>,
>(): Page<PageProps> {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (instance) {
    return instance.proxy.$page as Page<PageProps>;
  }
  return _usePage() as any;
}

/**
 * Get inertia instance
 */
export function useInertia(): typeof Inertia {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (instance) {
    // @ts-expect-error Inertia
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
): TForm | undefined {
  /** Get Instance */
  const instance = getCurrentInstance();

  if (!data) {
    return;
  }

  if (rememberKey) {
    return instance
      ? // @ts-expect-error Inertia Form
        instance.proxy.$inertia.form<TForm>(rememberKey, data)
      : _useForm(rememberKey, data);
  }
  return instance
    ? // @ts-expect-error Inertia Form
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
  name: string,
  params?: RouteParams<string> | undefined,
  absolute?: boolean,
  config?: Config
): string {
  /** Get Instance */
  const instance = getCurrentInstance();
  // @ts-expect-error Ziggy exists
  if (instance?.proxy.route) {
    // @ts-expect-error get Ziggy
    return instance.proxy.route(name, params, absolute, config);
  }
  // if not instance get ziggy directly
  return ziggy(name, params, absolute, config);
}

/** output warn message. */
const warn = (): void => {
  console.warn(
    `[Inertia Composable] getCurrentInstance() returned null. Method must be called at the top of a setup() function.`
  );
};

// For CDN.
if (typeof window !== 'undefined') {
  // @ts-expect-error Register route to global
  window.route = route;
}

export { InertiaLink, install };

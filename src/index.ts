import { getCurrentInstance } from 'vue-demi';
import ziggy from 'ziggy-js';

import type { Inertia, Page } from '@inertiajs/inertia';
import type {
  InertiaForm,
  InertiaFormTrait,
  InertiaHeadManager,
} from '@inertiajs/inertia-vue';
import type {
  Router,
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
    return instance.proxy.$page as Page<SharedProps>;
  } else {
    warn();
  }
  return undefined as any;
}

/**
 * Get inertia instance
 */
export function useInertia(): typeof Inertia & InertiaFormTrait {
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
 *
 * @param args - Form Key-Value Pair.
 */
export function useForm<TForm = Record<string, any>>(
  args: TForm
): InertiaForm<TForm> {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (instance) {
    return instance.proxy.$inertia.form<TForm>(args);
  } else {
    warn();
  }
  return undefined as any;
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
  name?: undefined,
  params?: RouteParamsWithQueryOverload | RouteParam,
  absolute?: boolean,
  config?: Config
): string | Router {
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

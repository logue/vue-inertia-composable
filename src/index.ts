import { getCurrentInstance } from '@vue/composition-api';

import type { Page } from '@inertiajs/inertia';
import type { Router } from '@inertiajs/inertia/types/router';
import type {
  InertiaFormTrait,
  InertiaHeadManager,
} from '@inertiajs/inertia-vue';
import ziggy from 'ziggy-js';

/** Get head manager instance (For Composition api) */
export function useHeadManager(): InertiaHeadManager {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error(`Should be used in setup().`);
  }
  return instance.proxy.$headManager;
}

/** Get page instance (For Composition api) */
export function usePage(): Page<any> {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error(`Should be used in setup().`);
  }
  return instance.proxy.$page;
}

/** Get inertia instance (For Composition api) */
export function useInertia(): Router & InertiaFormTrait {
  /** Get Instance */
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error(`Should be used in setup().`);
  }
  return instance.proxy.$inertia;
}

/** Get route instance (For Composition api) */
export function route(...args): string {
  /** Get Instance */
  const instance = getCurrentInstance();

  if (!instance) {
    // if not instance get ziggy directly
    // @ts-ignore
    return ziggy(args);
    // throw new Error(`Should be used in setup().`);
  }

  return instance.proxy.route(args);
}

import { defineComponent, h, type PropType } from 'vue-demi';
import {
  Inertia,
  mergeDataIntoQueryString,
  shouldIntercept,
  type FormDataConvertible,
  type Method,
  type PreserveStateOption,
  type VisitOptions,
} from '@inertiajs/inertia';

/**
 * Alternate of Inertia Link Component
 *
 * @experimental
 */
const InertiaLink = defineComponent({
  name: 'InertiaLink',
  props: {
    as: {
      type: String,
      default: 'a',
    },
    href: {
      type: String,
      default: import.meta.url,
    },
    method: {
      type: String as PropType<'get' | 'post' | 'put' | 'patch' | 'delete'>,
      default: 'get',
    },
    data: {
      type: Object as PropType<Record<string, FormDataConvertible>>,
      default: () => {
        return {};
      },
    },
    replace: {
      type: Boolean,
      default: false,
    },
    preserveScroll: {
      type: Boolean as PropType<PreserveStateOption>,
      default: false,
    },
    preserveState: {
      type: Boolean as PropType<PreserveStateOption>,
      default: false,
    },
    only: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
    },
    headers: {
      type: Function as PropType<Record<string, string>>,
      default: () => {
        return {};
      },
    },
    errorBag: {
      type: String,
      default: '',
    },
    forceFormData: {
      type: Boolean,
      default: false,
    },
    queryStringArrayFormat: {
      type: String as PropType<'indices' | 'brackets'>,
      default: 'brackets',
    },
  },
  render() {
    const as = (this.$props.as.toLowerCase() || 'a') as string;
    const method = (this.$props.method.toLocaleLowerCase() || 'get') as Method;
    const attrs = this.$attrs as VisitOptions;

    const [href, data] = mergeDataIntoQueryString(
      method,
      this.$props.href,
      this.$props.data,
      this.$props.queryStringArrayFormat
    );

    if (as === 'a' && method !== 'get') {
      console.warn(
        `Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues.\n\nPlease specify a more appropriate element using the "as" attribute. For example:\n\n<inertia-link href="${href}" method="${method}" as="button">...</inertia-link>`
      );
    }
    return h(
      as,
      {
        ...this.$attrs,
        ...(as === 'a' ? { href: href } : {}),
        // @ts-ignore
        onClick: (event: KeyboardEvent) => {
          event.preventDefault();
          if (!shouldIntercept(event)) {
            return;
          }

          Inertia.visit(href, {
            method: method,
            data: data,
            replace: this.$props.replace,
            preserveScroll: this.$props.preserveScroll,
            preserveState: this.$props.preserveState ?? method !== 'get',
            only: this.$props.only,
            headers: this.$props.headers,
            errorBag: this.$props.errorBag,
            forceFormData: this.$props.forceFormData,
            onCancelToken: attrs.onCancelToken || (() => undefined),
            onBefore: attrs.onBefore || (() => undefined),
            onStart: attrs.onStart || (() => undefined),
            onProgress: attrs.onProgress || (() => undefined),
            onFinish: attrs.onFinish || (() => undefined),
            onCancel: attrs.onCancel || (() => undefined),
            onSuccess: attrs.onSuccess || (() => undefined),
            onError: attrs.onError || (() => undefined),
          });
        },
      },
      this.$slots.default
    );
  },
});

const installInertiaLink = (app: any) =>
  app.component('InertiaLink', InertiaLink);

export { InertiaLink, installInertiaLink as install };

if (typeof window !== 'undefined' && window.Vue) {
  // @ts-ignore
  window.Vue.use(InertiaLink);
}

import { defineComponent, h, type PropType, type SetupContext } from 'vue-demi';
import {
  Inertia,
  mergeDataIntoQueryString,
  shouldIntercept,
  type Method,
  type PreserveStateOption,
  type RequestPayload,
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
    data: {
      type: Object as PropType<RequestPayload>,
      default: () => {},
    },
    href: {
      type: String as PropType<string | URL>,
      default: '',
    },
    method: {
      type: String as PropType<'get' | 'post' | 'put' | 'patch' | 'delete'>,
      default: 'get',
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
      default: () => [],
    },
    headers: {
      type: Object as PropType<Record<string, string>>,
      default: () => {},
    },
    queryStringArrayFormat: {
      type: String as PropType<'indices' | 'brackets'>,
      default: 'brackets',
    },
  },
  setup(_props, { slots, attrs }: SetupContext) {
    return (props: any) => {
      const as = props.as.toLowerCase();
      const method = props.method.toLowerCase() as Method;
      const [href, data] = mergeDataIntoQueryString(
        method,
        props.href || '',
        props.data,
        props.queryStringArrayFormat
      );

      if (as === 'a' && method !== 'get') {
        console.warn(
          `Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues.\n\nPlease specify a more appropriate element using the "as" attribute. For example:\n\n<Link href="${href}" method="${method}" as="button">...</Link>`
        );
      }

      return h(
        props.as,
        {
          ...attrs,
          ...(as === 'a' ? { href } : {}),
          onClick: (event: KeyboardEvent) => {
            if (shouldIntercept(event)) {
              event.preventDefault();

              Inertia.visit(href, {
                data: data,
                method: method,
                replace: props.replace,
                preserveScroll: props.preserveScroll,
                preserveState: props.preserveState ?? method !== 'get',
                only: props.only,
                headers: props.headers,
                onCancelToken: attrs.onCancelToken || (() => undefined),
                onBefore: attrs.onBefore || (() => undefined),
                onStart: attrs.onStart || (() => undefined),
                onProgress: attrs.onProgress || (() => undefined),
                onFinish: attrs.onFinish || (() => undefined),
                onCancel: attrs.onCancel || (() => undefined),
                onSuccess: attrs.onSuccess || (() => undefined),
                onError: attrs.onError || (() => undefined),
              } as VisitOptions);
            }
          },
        } as any,
        slots as any
      );
    };
  },
});

const installInertiaLink = (app: any) =>
  app.component('InertiaLink', InertiaLink);

export { InertiaLink, installInertiaLink as install };

if (typeof window !== 'undefined' && window.Vue) {
  // @ts-ignore
  window.Vue.use(InertiaLink);
}

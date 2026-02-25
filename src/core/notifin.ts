import { notifinStore } from './store';
import type {
    NotifinFn,
    NotifinPromiseMessages,
    NotifinShowOptions,
    NotifinType,
    NotifinUpdateOptions,
} from './types';

function normalizeInput(input: NotifinShowOptions | string) {
    if (typeof input === 'string') {
        return {
            title: input,
        } satisfies NotifinShowOptions;
    }

    return input;
}

function resolveMessage<TData>(
    input: ((data: TData) => NotifinShowOptions | string) | string,
    value: TData
) {
    if (typeof input === 'function') {
        return input(value);
    }

    return input;
}

function notify(
    type: NotifinType,
    title: string,
    options?: NotifinShowOptions
) {
    return notifinStore.create(type, title, options);
}

export const notifin: NotifinFn = Object.assign(
    (title: string, options?: NotifinShowOptions) =>
        notify('default', title, options),
    {
        dismiss: (id?: string) => notifinStore.dismiss(id),
        error: (title: string, options?: NotifinShowOptions) =>
            notify('error', title, options),
        info: (title: string, options?: NotifinShowOptions) =>
            notify('info', title, options),
        loading: (title: string, options?: NotifinShowOptions) =>
            notify('loading', title, { dismissible: false, ...options }),
        async promise<TData>(
            promise: Promise<TData>,
            messages: NotifinPromiseMessages<TData>
        ) {
            const loadingConfig = normalizeInput(messages.loading);
            const loadingId = notify(
                'loading',
                loadingConfig.title ?? 'Loading...',
                {
                    dismissible: false,
                    ...loadingConfig,
                }
            );

            try {
                const data = await promise;
                const next = resolveMessage(messages.success, data);
                const successConfig = normalizeInput(next);

                notifinStore.update(loadingId, {
                    ...successConfig,
                    dismissible: successConfig.dismissible ?? true,
                    open: true,
                    title: successConfig.title ?? 'Success',
                    type: 'success',
                });

                return data;
            } catch (error) {
                const next = resolveMessage(messages.error, error);
                const errorConfig = normalizeInput(next);

                notifinStore.update(loadingId, {
                    ...errorConfig,
                    dismissible: errorConfig.dismissible ?? true,
                    open: true,
                    title: errorConfig.title ?? 'Something went wrong',
                    type: 'error',
                });

                throw error;
            }
        },
        success: (title: string, options?: NotifinShowOptions) =>
            notify('success', title, options),
        update: (id: string, options: NotifinUpdateOptions) => {
            notifinStore.update(id, {
                ...options,
                title: options.title,
                type: options.type,
            });
        },
        warning: (title: string, options?: NotifinShowOptions) =>
            notify('warning', title, options),
    }
);

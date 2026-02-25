import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { notifinStore } from '../core/store';
import type {
    NotifinBodyProps,
    NotifinProps,
    NotifinThemeClassMap,
    NotifinThemeIcons,
} from '../core/types';
import { useNotifinStore } from '../core/use-notifin';
import { cn } from '../core/utils';

function IconCheckCircle({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function IconCircleAlert({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    );
}

function IconCircleX({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
        </svg>
    );
}

function IconInfo({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    );
}

function IconLoader({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

const defaultIcons: NotifinThemeIcons = {
    default: IconInfo,
    error: IconCircleX,
    info: IconInfo,
    loading: IconLoader,
    success: IconCheckCircle,
    warning: IconCircleAlert,
};

const defaultDialogToneClasses: NotifinThemeClassMap = {
    default: 'border-neutral-200 bg-white text-neutral-950',
    error: 'border-red-200 bg-white text-red-950',
    info: 'border-blue-200 bg-white text-blue-950',
    loading: 'border-neutral-200 bg-white text-neutral-950',
    success: 'border-green-200 bg-white text-neutral-950',
    warning: 'border-yellow-200 bg-white text-neutral-950',
};

const defaultIconToneClasses: NotifinThemeClassMap = {
    default: 'border-neutral-200 bg-neutral-100 text-neutral-700',
    error: 'border-red-300 bg-red-50 text-red-600',
    info: 'border-blue-300 bg-blue-50 text-blue-600',
    loading: 'border-neutral-200 bg-neutral-100 text-neutral-600',
    success: 'border-green-300 bg-green-50 text-green-600',
    warning: 'border-yellow-300 bg-yellow-50 text-yellow-600',
};

export function Notifin({
    showQueueCount = true,
    theme,
}: NotifinProps) {
    const { current, pendingCount } = useNotifinStore();
    const icons = {
        ...defaultIcons,
        ...theme?.icons,
    };
    const dialogToneClasses = {
        ...defaultDialogToneClasses,
        ...theme?.dialogToneClasses,
    };
    const iconToneClasses = {
        ...defaultIconToneClasses,
        ...theme?.iconToneClasses,
    };

    return (
        <AlertDialog.Root
            onOpenChange={(open) => {
                if (!open && current?.dismissible) {
                    notifinStore.dismiss(current.id);
                }
            }}
            open={Boolean(current?.open)}
        >
            {current ? (
                <DialogBody
                    dialog={current}
                    dialogToneClasses={dialogToneClasses}
                    icons={icons}
                    iconToneClasses={iconToneClasses}
                    pendingCount={pendingCount}
                    showQueueCount={showQueueCount}
                />
            ) : null}
        </AlertDialog.Root>
    );
}

function DialogBody({
    dialog,
    dialogToneClasses,
    icons,
    iconToneClasses,
    pendingCount,
    showQueueCount,
}: NotifinBodyProps) {
    const Icon = icons[dialog.type];
    const shouldRenderAction = Boolean(dialog.action) || dialog.dismissible;
    const isLoading = dialog.type === 'loading';
    const toneClasses = dialogToneClasses[dialog.type];
    const iconClasses = iconToneClasses[dialog.type];

    return (
        <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
            <AlertDialog.Content
                className={cn(
                    'fixed top-1/2 left-1/2 z-50 w-[min(92vw,24rem)] max-h-[90dvh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-xl border p-4 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2 motion-reduce:animate-none motion-reduce:duration-0',
                    toneClasses
                )}
                onEscapeKeyDown={(event) => {
                    if (!dialog.dismissible || !dialog.allowEscapeClose) {
                        event.preventDefault();
                    }
                }}
            >
                <div className="space-y-1.5">
                    <div className='flex items-center gap-x-2'>
                        <div
                            className={cn(
                                'flex size-7 shrink-0 rounded-full items-center justify-center border',
                                iconClasses
                            )}
                        >
                            <Icon
                                className={cn(
                                    'size-4',
                                    dialog.type === 'loading' && 'animate-spin'
                                )}
                            />
                        </div>
                        <AlertDialog.Title className="wrap-break-word font-semibold text-neutral-900">
                            {dialog.title}
                        </AlertDialog.Title>
                    </div>
                    <AlertDialog.Description
                        aria-live={dialog.type === 'error' ? 'assertive' : 'polite'}
                        className="wrap-break-word text-neutral-600 text-sm"
                    >
                        {dialog.description ? (
                            dialog.description
                        ) : (
                            <VisuallyHidden>
                                Notification dialog
                            </VisuallyHidden>
                        )}
                    </AlertDialog.Description>
                </div>

                <div className="mt-4 space-y-2">
                    {showQueueCount && pendingCount > 0 ? (
                        <div className="text-xs text-neutral-500">
                            {pendingCount} pending
                        </div>
                    ) : null}

                    <div className="flex w-full items-center gap-x-2 sm:justify-end">
                        {dialog.cancel ? (
                            <AlertDialog.Cancel asChild>
                                <button
                                    className="inline-flex h-8 w-full items-center justify-center rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-24"
                                    disabled={isLoading}
                                    onClick={() => {
                                        void dialog.cancel?.onClick?.();
                                        notifinStore.dismiss(dialog.id);
                                    }}
                                    type="button"
                                >
                                    {dialog.cancel.label}
                                </button>
                            </AlertDialog.Cancel>
                        ) : null}

                        {shouldRenderAction ? (
                            <AlertDialog.Action asChild>
                                <button
                                    className={cn(
                                        'inline-flex h-8 w-full items-center justify-center rounded-md px-4 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 sm:w-auto sm:min-w-24',
                                        'disabled:cursor-not-allowed disabled:opacity-60',
                                        dialog.type === 'error' && 'bg-red-600 hover:bg-red-700',
                                        dialog.type === 'info' && 'bg-blue-600 hover:bg-blue-700',
                                        dialog.type === 'success' && 'bg-green-600 hover:bg-green-700',
                                        dialog.type === 'warning' && 'bg-yellow-600 hover:bg-yellow-700',
                                        (dialog.type === 'default' || dialog.type === 'loading') &&
                                            'bg-neutral-900 hover:bg-neutral-800'
                                    )}
                                    disabled={isLoading}
                                    onClick={() => {
                                        void dialog.action?.onClick?.();
                                        notifinStore.dismiss(dialog.id);
                                    }}
                                    type="button"
                                >
                                    {dialog.action?.label ?? 'OK'}
                                </button>
                            </AlertDialog.Action>
                        ) : null}
                    </div>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Portal>
    );
}

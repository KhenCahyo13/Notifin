import '../styles/index.css';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEffect } from 'react';

import { notifinStore } from '../core/store';
import type {
    NotifinBodyProps,
    NotifinProps,
    NotifinThemeClassMap,
    NotifinThemeIcons,
} from '../core/types';
import { useNotifinStore } from '../core/use-notifin';
import { cn } from '../core/utils';
import {
    IconCheckCircle,
    IconCircleAlert,
    IconCircleX,
    IconInfo,
    IconLoader,
} from './icons';

const defaultIcons: NotifinThemeIcons = {
    default: IconInfo,
    error: IconCircleX,
    info: IconInfo,
    loading: IconLoader,
    success: IconCheckCircle,
    warning: IconCircleAlert,
};

const defaultDialogToneClasses: NotifinThemeClassMap = {
    default: 'nf-dialog-tone-default',
    error: 'nf-dialog-tone-error',
    info: 'nf-dialog-tone-info',
    loading: 'nf-dialog-tone-loading',
    success: 'nf-dialog-tone-success',
    warning: 'nf-dialog-tone-warning',
};

const defaultIconToneClasses: NotifinThemeClassMap = {
    default: 'nf-icon-tone-default',
    error: 'nf-icon-tone-error',
    info: 'nf-icon-tone-info',
    loading: 'nf-icon-tone-loading',
    success: 'nf-icon-tone-success',
    warning: 'nf-icon-tone-warning',
};

export function Notifin({ showQueueCount = true, theme }: NotifinProps) {
    const { current, pendingCount } = useNotifinStore();

    useEffect(() => notifinStore.registerHost(), []);

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
    const actionToneClass = cn(
        dialog.type === 'error' && 'nf-action-error',
        dialog.type === 'info' && 'nf-action-info',
        dialog.type === 'success' && 'nf-action-success',
        dialog.type === 'warning' && 'nf-action-warning',
        (dialog.type === 'default' || dialog.type === 'loading') &&
            'nf-action-default'
    );

    return (
        <AlertDialog.Portal>
            <AlertDialog.Overlay className="nf-overlay" />
            <AlertDialog.Content
                className={cn('nf-content', toneClasses)}
                onEscapeKeyDown={(event) => {
                    if (!dialog.dismissible || !dialog.allowEscapeClose) {
                        event.preventDefault();
                    }
                }}
            >
                <div className="nf-header">
                    <div className="nf-title-row">
                        <div className={cn('nf-icon-wrap', iconClasses)}>
                            <Icon
                                className={cn(
                                    'nf-icon',
                                    dialog.type === 'loading' && 'nf-icon-spin'
                                )}
                            />
                        </div>
                        <AlertDialog.Title className="nf-title">
                            {dialog.title}
                        </AlertDialog.Title>
                    </div>
                    <AlertDialog.Description
                        aria-live={
                            dialog.type === 'error' ? 'assertive' : 'polite'
                        }
                        className="nf-description"
                    >
                        {dialog.description ? (
                            dialog.description
                        ) : (
                            <VisuallyHidden>Notification dialog</VisuallyHidden>
                        )}
                    </AlertDialog.Description>
                </div>

                <div className="nf-footer">
                    {showQueueCount && pendingCount > 0 ? (
                        <div className="nf-pending">{pendingCount} pending</div>
                    ) : null}

                    <div className="nf-actions">
                        {dialog.cancel ? (
                            <AlertDialog.Cancel asChild>
                                <button
                                    className="nf-button nf-button-cancel"
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
                                        'nf-button nf-button-action',
                                        actionToneClass
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

import type { ComponentType } from 'react';

export type NotifinType =
    | 'default'
    | 'error'
    | 'info'
    | 'loading'
    | 'success'
    | 'warning';

export interface NotifinAction {
    label: string;
    onClick?: () => Promise<void> | void;
}

export interface NotifinShowOptions {
    action?: NotifinAction;
    allowEscapeClose?: boolean;
    cancel?: NotifinAction;
    description?: string;
    dismissible?: boolean;
    duration?: number;
    id?: string;
    onDismiss?: () => void;
    title?: string;
}

export interface NotifinItem extends Required<
    Pick<NotifinShowOptions, 'dismissible'>
> {
    action?: NotifinAction;
    allowEscapeClose?: boolean;
    cancel?: NotifinAction;
    createdAt: number;
    description?: string;
    duration?: number;
    id: string;
    onDismiss?: () => void;
    open: boolean;
    title: string;
    type: NotifinType;
}

export interface NotifinSnapshot {
    current: NotifinItem | null;
    pendingCount: number;
}

export interface NotifinPromiseMessages<TData = unknown> {
    error: ((error: unknown) => NotifinShowOptions | string) | string;
    loading: NotifinShowOptions | string;
    success: ((data: TData) => NotifinShowOptions | string) | string;
}

export interface NotifinUpdateOptions extends Partial<NotifinShowOptions> {
    title?: string;
    type?: NotifinType;
}

export interface NotifinFn {
    (title: string, options?: NotifinShowOptions): string;
    dismiss: (id?: string) => void;
    error: (title: string, options?: NotifinShowOptions) => string;
    info: (title: string, options?: NotifinShowOptions) => string;
    loading: (title: string, options?: NotifinShowOptions) => string;
    promise: <TData>(
        promise: Promise<TData>,
        messages: NotifinPromiseMessages<TData>
    ) => Promise<TData>;
    success: (title: string, options?: NotifinShowOptions) => string;
    update: (id: string, options: NotifinUpdateOptions) => void;
    warning: (title: string, options?: NotifinShowOptions) => string;
}

export type NotifinIconComponent = ComponentType<{
    className?: string;
}>;

export type NotifinThemeClassMap = Record<NotifinType, string>;

export type NotifinThemeIcons = Record<NotifinType, NotifinIconComponent>;

export type NotifinColorScheme = 'dark' | 'light' | 'system';

export interface NotifinSchemeThemeConfig {
    className?: string;
    dialogToneClasses?: Partial<NotifinThemeClassMap>;
    iconToneClasses?: Partial<NotifinThemeClassMap>;
}

export interface NotifinThemeConfig {
    dialogToneClasses?: Partial<NotifinThemeClassMap>;
    icons?: Partial<NotifinThemeIcons>;
    iconToneClasses?: Partial<NotifinThemeClassMap>;
    schemes?: Partial<Record<'dark' | 'light', NotifinSchemeThemeConfig>>;
}

export interface NotifinProps {
    colorScheme?: NotifinColorScheme;
    showQueueCount?: boolean;
    theme?: NotifinThemeConfig;
}

export interface NotifinBodyProps {
    dialog: NotifinItem;
    dialogToneClasses: NotifinThemeClassMap;
    icons: NotifinThemeIcons;
    iconToneClasses: NotifinThemeClassMap;
    pendingCount: number;
    showQueueCount: boolean;
}

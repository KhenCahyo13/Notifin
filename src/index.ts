import { ensureNotifinStyles } from './core/inject-style';

ensureNotifinStyles();

export { notifin } from './core/notifin';
export type {
    NotifinAction,
    NotifinBodyProps,
    NotifinColorScheme,
    NotifinFn,
    NotifinIconComponent,
    NotifinItem,
    NotifinPromiseMessages,
    NotifinProps,
    NotifinShowOptions,
    NotifinThemeClassMap,
    NotifinThemeConfig,
    NotifinThemeIcons,
    NotifinType,
    NotifinUpdateOptions,
} from './core/types';
export { Notifin } from './provider/notifin';

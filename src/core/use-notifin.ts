import { useSyncExternalStore } from 'react';

import { notifinStore } from './store';

export function useNotifinStore() {
    return useSyncExternalStore(
        (listener) => notifinStore.subscribe(listener),
        () => notifinStore.getSnapshot(),
        () => notifinStore.getSnapshot()
    );
}

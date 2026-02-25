import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
    vi.useRealTimers();
});

async function loadModules() {
    vi.resetModules();

    const [{ notifin }, { notifinStore }] = await Promise.all([
        import('../notifin'),
        import('../store'),
    ]);

    return {
        notifin,
        notifinStore,
    };
}

describe('notifin core flow', () => {
    it('queues dialogs and promotes next after dismiss', async () => {
        vi.useFakeTimers();
        const { notifin, notifinStore } = await loadModules();
        const unregisterHost = notifinStore.registerHost();

        notifin.success('First');
        notifin.error('Second');

        expect(notifinStore.getSnapshot().current?.title).toBe('First');
        expect(notifinStore.getSnapshot().pendingCount).toBe(1);

        notifin.dismiss();
        vi.advanceTimersByTime(130);

        expect(notifinStore.getSnapshot().current?.title).toBe('Second');
        expect(notifinStore.getSnapshot().pendingCount).toBe(0);
        unregisterHost();
    });

    it('auto-dismisses active dialog when duration is set', async () => {
        vi.useFakeTimers();
        const { notifin, notifinStore } = await loadModules();
        const unregisterHost = notifinStore.registerHost();

        notifin('Autoclose', { duration: 50 });
        expect(notifinStore.getSnapshot().current?.title).toBe('Autoclose');

        vi.advanceTimersByTime(50);
        vi.advanceTimersByTime(130);

        expect(notifinStore.getSnapshot().current).toBeNull();
        expect(notifinStore.getSnapshot().pendingCount).toBe(0);
        unregisterHost();
    });

    it('updates loading dialog on promise success', async () => {
        const { notifin, notifinStore } = await loadModules();
        const unregisterHost = notifinStore.registerHost();

        await expect(
            notifin.promise(Promise.resolve('ok'), {
                error: () => 'Failed',
                loading: 'Loading...',
                success: (data) => `Done: ${data}`,
            })
        ).resolves.toBe('ok');

        expect(notifinStore.getSnapshot().current?.type).toBe('success');
        expect(notifinStore.getSnapshot().current?.title).toBe('Done: ok');
        unregisterHost();
    });

    it('throws when notifin is called without mounted host', async () => {
        const { notifin } = await loadModules();

        expect(() => notifin('No host')).toThrow(
            '[notifin] <Notifin /> is not mounted. Render <Notifin /> once in your app root before calling notifin(...).'
        );
    });
});

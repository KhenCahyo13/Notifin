import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type MockElement = {
    id: string;
    textContent: null | string;
};

type MockDocument = {
    createElement: (tagName: string) => MockElement;
    getElementById: (id: string) => MockElement | null;
    head: {
        appendChild: (element: MockElement) => void;
    };
};

function createMockDocument() {
    const elementsById = new Map<string, MockElement>();

    const mockDocument: MockDocument = {
        createElement: () => ({
            id: '',
            textContent: null,
        }),
        getElementById: (id) => elementsById.get(id) ?? null,
        head: {
            appendChild: (element) => {
                if (element.id) {
                    elementsById.set(element.id, element);
                }
            },
        },
    };

    return {
        document: mockDocument,
        getById: (id: string) => elementsById.get(id) ?? null,
    };
}

async function loadConsumerModules() {
    vi.resetModules();

    const [{ notifin }, { notifinStore }] = await Promise.all([
        import('../index'),
        import('../core/store'),
    ]);

    return {
        notifin,
        notifinStore,
    };
}

describe('consumer install flow', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('injects styles automatically when package entry is imported', async () => {
        const { document, getById } = createMockDocument();

        vi.stubGlobal('document', document);

        await import('../index');

        const injectedStyle = getById('notifin-style');

        expect(injectedStyle).toBeTruthy();
        expect(injectedStyle?.textContent).not.toBeUndefined();
    });

    it('throws if notifin is called without mounted host', async () => {
        const { notifin } = await loadConsumerModules();

        expect(() => notifin('Hello')).toThrow(
            '[notifin] <Notifin /> is not mounted. Render <Notifin /> once in your app root before calling notifin(...).'
        );
    });

    it('supports queue and promise flow when host is mounted', async () => {
        const { notifin, notifinStore } = await loadConsumerModules();
        const unregisterHost = notifinStore.registerHost();

        notifin.success('First');
        notifin.error('Second');

        expect(notifinStore.getSnapshot().current?.title).toBe('First');
        expect(notifinStore.getSnapshot().pendingCount).toBe(1);

        notifin.dismiss();
        vi.advanceTimersByTime(130);

        expect(notifinStore.getSnapshot().current?.title).toBe('Second');
        expect(notifinStore.getSnapshot().pendingCount).toBe(0);

        notifin.dismiss();
        vi.advanceTimersByTime(130);

        expect(notifinStore.getSnapshot().current).toBeNull();

        await expect(
            notifin.promise(Promise.resolve('ok'), {
                error: () => 'Failed',
                loading: 'Loading...',
                success: (data) => `Done: ${data}`,
            })
        ).resolves.toBe('ok');

        expect(notifinStore.getSnapshot().current?.title).toBe('Done: ok');
        expect(notifinStore.getSnapshot().current?.type).toBe('success');

        unregisterHost();
    });
});

import type {
    NotifinItem,
    NotifinShowOptions,
    NotifinSnapshot,
    NotifinType,
} from './types';

const REMOVE_DELAY = 120;

const createId = () =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

type Listener = () => void;
type DialogPatch = Partial<Omit<NotifinItem, 'createdAt' | 'id'>>;

class NotifinStore {
    private listeners = new Set<Listener>();
    private dialogs = new Map<string, NotifinItem>();
    private order: string[] = [];
    private activeId: null | string = null;
    private snapshot: NotifinSnapshot = {
        current: null,
        pendingCount: 0,
    };
    private removeTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
    private durationTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
    private hostCount = 0;

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    registerHost() {
        this.hostCount += 1;

        return () => {
            this.hostCount = Math.max(0, this.hostCount - 1);
        };
    }

    hasHost() {
        return this.hostCount > 0;
    }

    getSnapshot(): NotifinSnapshot {
        return this.snapshot;
    }

    create(type: NotifinType, title: string, options: NotifinShowOptions = {}) {
        const id = options.id ?? createId();
        const existing = this.dialogs.get(id);
        const isActive = this.activeId === id || this.activeId === null;

        const dialog: NotifinItem = {
            action: options.action,
            allowEscapeClose: options.allowEscapeClose,
            cancel: options.cancel,
            createdAt: existing?.createdAt ?? Date.now(),
            description: options.description,
            dismissible: options.dismissible ?? true,
            duration: options.duration,
            id,
            onDismiss: options.onDismiss,
            open: isActive,
            title,
            type,
        };

        this.clearDurationTimer(id);
        this.clearRemoveTimer(id);
        this.dialogs.set(id, dialog);

        if (!this.order.includes(id)) {
            this.order.push(id);
        }

        if (this.activeId === null) {
            this.activeId = id;
            this.startDurationTimer(id);
        }

        this.emit();
        return id;
    }

    update(id: string, patch: DialogPatch) {
        const current = this.dialogs.get(id);
        if (!current) {
            return;
        }

        const next = {
            ...current,
            ...patch,
            createdAt: current.createdAt,
            id,
        } satisfies NotifinItem;

        this.dialogs.set(id, next);

        if (this.activeId === id) {
            this.startDurationTimer(id);
        }

        this.emit();
    }

    dismiss(id?: string) {
        if (!id) {
            if (this.activeId) {
                this.dismissActive(this.activeId);
            }
            return;
        }

        if (this.activeId === id) {
            this.dismissActive(id);
            return;
        }

        this.removeImmediately(id);
    }

    private dismissActive(id: string) {
        const current = this.dialogs.get(id);
        if (!current || !current.open) {
            return;
        }

        this.clearDurationTimer(id);

        this.dialogs.set(id, {
            ...current,
            open: false,
        });

        this.emit();

        const timeout = setTimeout(() => {
            this.removeImmediately(id);
            this.promoteNext();
        }, REMOVE_DELAY);

        this.removeTimeouts.set(id, timeout);
    }

    private removeImmediately(id: string) {
        const current = this.dialogs.get(id);
        if (!current) {
            return;
        }

        this.clearDurationTimer(id);
        this.clearRemoveTimer(id);
        this.dialogs.delete(id);
        this.order = this.order.filter((dialogId) => dialogId !== id);

        if (this.activeId === id) {
            this.activeId = null;
        }

        current.onDismiss?.();
        this.emit();
    }

    private promoteNext() {
        if (this.activeId !== null) {
            return;
        }

        const nextId = this.order[0];
        if (!nextId) {
            return;
        }

        const next = this.dialogs.get(nextId);
        if (!next) {
            this.order.shift();
            this.promoteNext();
            return;
        }

        this.activeId = nextId;
        this.dialogs.set(nextId, {
            ...next,
            open: true,
        });
        this.startDurationTimer(nextId);
        this.emit();
    }

    private startDurationTimer(id: string) {
        this.clearDurationTimer(id);

        const dialog = this.dialogs.get(id);
        if (!dialog?.duration || this.activeId !== id) {
            return;
        }

        const timeout = setTimeout(() => this.dismiss(id), dialog.duration);
        this.durationTimeouts.set(id, timeout);
    }

    private clearDurationTimer(id: string) {
        const timeout = this.durationTimeouts.get(id);
        if (!timeout) {
            return;
        }

        clearTimeout(timeout);
        this.durationTimeouts.delete(id);
    }

    private clearRemoveTimer(id: string) {
        const timeout = this.removeTimeouts.get(id);
        if (!timeout) {
            return;
        }

        clearTimeout(timeout);
        this.removeTimeouts.delete(id);
    }

    private emit() {
        const current = this.activeId
            ? (this.dialogs.get(this.activeId) ?? null)
            : null;
        const pendingCount = Math.max(this.order.length - (current ? 1 : 0), 0);
        this.snapshot = {
            current,
            pendingCount,
        };

        for (const listener of this.listeners) {
            listener();
        }
    }
}

export const notifinStore = new NotifinStore();

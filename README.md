# Notifin

Function-first alert dialog library for React, built on Radix Alert Dialog primitives with bundled styles and optional theme overrides.

## Install

```bash
pnpm add @khencahyo13/notifin
# or: npm i @khencahyo13/notifin
# or: yarn add @khencahyo13/notifin
```

Peer dependency: `react` and `react-dom` version `>=18`.

## Usage

Mount host once in app root:

```tsx
import { Notifin } from '@khencahyo13/notifin';

export function AppLayout() {
    return (
        <>
            <Notifin />
            {/* your app */}
        </>
    );
}
```

Call notifications anywhere:

```tsx
import { notifin } from '@khencahyo13/notifin';

notifin('Saved draft');
notifin.success('Profile updated');
notifin.error('Upload failed', {
    description: 'Please retry in a few seconds.',
});
```

`Notifin` props:

- `colorScheme?: 'system' | 'light' | 'dark'` (default `system`)
- `showQueueCount?: boolean` (default `true`)
- `theme?: { icons?, dialogToneClasses?, iconToneClasses? }`

## Custom Theme

You can override per-type visuals with the `theme` prop on `Notifin`. For icons, you can override the default icons using lucide icons or tabler icons, or others icon packages

```tsx
import { Notifin } from '@khencahyo13/notifin';

function RocketIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path d="M5 19c2.5 0 4.5-2 4.5-4.5v-1l5-5c2-2 4.5-2 5.5-2-.1 1-.1 3.5-2 5.5l-5 5h-1C9 17 7 19 7 21" />
            <circle cx="14.5" cy="9.5" r="1.5" />
        </svg>
    );
}

export function AppLayout() {
    return (
        <Notifin
            theme={{
                dialogToneClasses: {
                    success:
                        'border-emerald-300 bg-emerald-50 text-emerald-950',
                    error: 'border-rose-300 bg-rose-50 text-rose-950',
                },
                iconToneClasses: {
                    success:
                        'border-emerald-400 bg-emerald-100 text-emerald-700',
                    error: 'border-rose-400 bg-rose-100 text-rose-700',
                },
                icons: {
                    success: RocketIcon,
                },
            }}
        />
    );
}
```

Theme shape:

- `theme.dialogToneClasses`: partial map of `default | success | error | warning | info | loading` to class string for dialog container.
- `theme.iconToneClasses`: partial map of `default | success | error | warning | info | loading` to class string for icon chip.
- `theme.icons`: partial map of `default | success | error | warning | info | loading` to custom React icon component.

With actions:

```tsx
notifin.warning('Delete this item?', {
    description: 'This action cannot be undone.',
    action: {
        label: 'Delete',
        onClick: () => console.log('delete'),
    },
    cancel: {
        label: 'Cancel',
    },
});
```

Promise helper:

```tsx
await notifin.promise(saveProfile(), {
    loading: {
        title: 'Saving profile...',
        description: 'Please wait',
    },
    success: () => 'Profile saved',
    error: () => 'Failed to save profile',
});
```

## API

- `notifin(title, options?)` -> returns `id`
- `notifin.success(title, options?)` -> returns `id`
- `notifin.error(title, options?)` -> returns `id`
- `notifin.warning(title, options?)` -> returns `id`
- `notifin.info(title, options?)` -> returns `id`
- `notifin.loading(title, options?)` -> returns `id`
- `notifin.update(id, options)`
- `notifin.dismiss(id?)`
- `notifin.promise(promise, messages)`

## Notes

- Powered by `@radix-ui/react-alert-dialog`.
- Styles are injected automatically when you import from `@khencahyo13/notifin`.
- Optional: import `@khencahyo13/notifin/style.css` manually if you prefer explicit CSS loading.
- Built-in dark theme support via `colorScheme` (`system`, `light`, `dark`).
- No Tailwind setup is required.
- `@radix-ui/react-alert-dialog` and `@radix-ui/react-visually-hidden` are already included by this package, so no manual install is needed.
- `Notifin` must be mounted for dialogs to render.
- Calling `notifin(...)` without a mounted `<Notifin />` will throw an error to prevent silent failures.
- Dialogs are queued; one dialog is shown at a time.

## License

This project is licensed under the `ISC` license.

## Contributing

Contributions are welcome.

1. Fork this repository.
2. Create a feature/fix branch.
3. Make your changes with tests and documentation updates.
4. Open a pull request with clear context and change summary.

Before submitting, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm prettier:fix
pnpm test:e2e
pnpm build
```

## Bug Report

If you find a bug, please open an issue and include:

- package version (`@khencahyo13/notifin`)
- React version
- minimal reproduction (repo or code snippet)
- expected vs actual behavior
- screenshots/error logs (if available)

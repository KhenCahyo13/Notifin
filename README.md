# Notifin

Function-first alert dialog library for React, using Radix Alert Dialog primitives with Tailwind-based UI classes.

## Install

```bash
pnpm add @khencahyo/notifin
# or: npm i @khencahyo/notifin
# or: yarn add @khencahyo/notifin
```

## Usage

Mount host once in app root:

```tsx
import { Notifin } from '@khencahyo/notifin';

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
import { notifin } from '@khencahyo/notifin';

notifin('Saved draft');
notifin.success('Profile updated');
notifin.error('Upload failed', {
    description: 'Please retry in a few seconds.',
});
```

`Notifin` props:

- `showQueueCount?: boolean` (default `true`)
- `theme?: { icons?, dialogToneClasses?, iconToneClasses? }`

## Custom Theme

You can override per-type visuals with the `theme` prop on `Notifin`.

```tsx
import { Notifin } from '@khencahyo/notifin';

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

- `theme.dialogToneClasses`: partial map of `default | success | error | warning | info | loading` to Tailwind class string for dialog container.
- `theme.iconToneClasses`: partial map of `default | success | error | warning | info | loading` to Tailwind class string for icon chip.
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

- `notifin(title, options?)`
- `notifin.success(title, options?)`
- `notifin.error(title, options?)`
- `notifin.warning(title, options?)`
- `notifin.info(title, options?)`
- `notifin.loading(title, options?)`
- `notifin.update(id, options)`
- `notifin.dismiss(id?)`
- `notifin.promise(promise, messages)`

## Notes

- Powered by `@radix-ui/react-alert-dialog`.
- Required for consumer app: `tailwindcss` (this library styles are pure Tailwind utility classes).
- Required for consumer app: `tw-animate-css` (or equivalent) for `animate-in/out`, `fade`, and `zoom` animation classes.
- `@radix-ui/react-alert-dialog` and `@radix-ui/react-visually-hidden` are already included by this package, so no manual install is needed.
- Make sure your Tailwind config scans this package path in `node_modules`.
- `Notifin` must be mounted for dialogs to render.
- Dialogs are queued; one dialog is shown at a time.

Example Tailwind content/source setup:

```ts
// tailwind.config.ts (Tailwind v3)
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './node_modules/@khencahyo/notifin/dist/**/*.{js,mjs,cjs}',
    ],
    plugins: [require('tw-animate-css')],
};
```

```css
/* app.css / index.css (Tailwind v4) */
@import 'tailwindcss';
@import 'tw-animate-css';
@source '../node_modules/@khencahyo13/notifin/dist/**/*.js';
```

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
pnpm build
```

## Bug Report

If you find a bug, please open an issue and include:

- package version (`@khencahyo13/notifin`)
- React version
- Tailwind version and config (`v3` or `v4`)
- minimal reproduction (repo or code snippet)
- expected vs actual behavior
- screenshots/error logs (if available)

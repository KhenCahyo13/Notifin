# notifin

Function-first alert dialog library for React, using Radix Alert Dialog primitives with Tailwind-based UI classes.

## Install

```bash
pnpm add notifin
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
- Uses Tailwind animation utility classes (`animate-in/out`, `fade`, `zoom`), so install `tw-animate-css` (or equivalent plugin) in consumer app for full motion.
- `Notifin` must be mounted for dialogs to render.
- Dialogs are queued; one dialog is shown at a time.
- If your Tailwind setup does not scan `node_modules`, include this package path in your scan/source config so classes are generated.

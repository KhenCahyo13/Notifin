import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ['src'],
            insertTypesEntry: true,
        }),
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'notifin',
            formats: ['es', 'cjs'],
            fileName: (format) =>
                format === 'es' ? 'notifin.js' : 'notifin.cjs',
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') {
                        return 'notifin.css';
                    }

                    return assetInfo.name ?? 'asset-[hash][extname]';
                },
            },
        },
    },
});

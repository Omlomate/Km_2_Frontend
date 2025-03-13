import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    base: '/', // Ensure trailing slash
    plugins: [
        react(),
        tailwindcss(),
    ],
    assetsInclude: ['**/*.otf', '**/*.ttf'], // Include font files
});


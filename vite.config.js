import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from "path";

export default defineConfig({
    base: '/', // Ensure trailing slash
    envDir: path.resolve(__dirname, ".."),
    plugins: [
        react(),
        tailwindcss(),
    ],
    assetsInclude: ['**/*.otf', '**/*.ttf'], // Include font files
});


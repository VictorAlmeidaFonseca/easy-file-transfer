import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

import path from 'path';

export default defineConfig({
  plugins: [
    svelte(),
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    },
  base: './',
  root:  'src',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});

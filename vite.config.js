import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({      
	plugins: [sveltekit()],
  resolve: {
    alias: {
      'svelte-tabs': 'svelte-tabs/src/index.js'
    }
  },
  build: {
    target: 'esnext'
  }
});
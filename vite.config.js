import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({      
	plugins: [sveltekit()],
  optimizeDeps: {
    exclude: ['svelte-tabs'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  ssr: {
    noExternal: ['svelte-tabs']
  },
  build: {
    target: 'esnext'
  }
});
import adapter from '@sveltejs/adapter-static';
import {
    vitePreprocess
} from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    paths: {
        relative: false,
    },
    kit: {
        adapter: adapter(),

    }
};
 
export default config;
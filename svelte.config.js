import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Vite's dev server evaluates modules with eval. Production builds leave this off.
const dev = process.env.NODE_ENV !== "production";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      fallback: "404.html",
    }),
    csp: {
      mode: "auto",
      directives: {
        "default-src": ["self"],
        "base-uri": ["self"],
        "object-src": ["none"],
        "form-action": ["self"],
        "script-src": [
          "self",
          "https://cdn.jsdelivr.net",
          "https://tableau.dsc.umich.edu",
          ...(dev ? ["unsafe-eval"] : []),
        ],
        "style-src": [
          "self",
          "unsafe-inline",
          "https://fonts.googleapis.com",
          "https://use.typekit.net",
          "https://p.typekit.net",
        ],
        "font-src": [
          "self",
          "data:",
          "https://fonts.gstatic.com",
          "https://use.typekit.net",
          "https://p.typekit.net",
        ],
        "img-src": ["self", "data:", "blob:", "https://pbs.twimg.com"],
        "worker-src": ["self", "blob:", "https://cdn.jsdelivr.net"],
        "connect-src": [
          "self",
          "https://d4gumsi.pythonanywhere.com",
          "http://localhost:8000",
          "http://127.0.0.1:8000",
          "https://cdn.jsdelivr.net",
          "https://tableau.dsc.umich.edu",
          "https://api.iconify.design",
          "https://api.unisvg.com",
          "https://api.simplesvg.com",
        ],
        "frame-src": [
          "self",
          "https://www.figma.com",
          "https://tableau.dsc.umich.edu",
          "https://docs.google.com",
        ],
      },
    },
  },
};

export default config;

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));
const modules = fs.realpathSync(path.join(root, "node_modules"));

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      // Worktrees symlink node_modules. Vite follows the link and then
      // refuses the real path unless it is allowlisted.
      allow: [root, modules],
    },
  },
  build: {
    target: "esnext",
  },
  ssr: {
    noExternal: ["svelte-material-icons"],
  },
});

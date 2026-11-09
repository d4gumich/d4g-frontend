import path from "node:path";
import { fileURLToPath } from "node:url";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

const practiceDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(practiceDir, "..");

export default defineConfig({
  root: practiceDir,
  envDir: repoRoot,
  envPrefix: ["VITE_", "PUBLIC_"],
  base: "./",
  publicDir: false,
  plugins: [svelte({ preprocess: vitePreprocess() })],
  resolve: {
    alias: {
      $lib: path.resolve(repoRoot, "src/lib"),
      "$app/environment": path.resolve(practiceDir, "shims/environment.js"),
      "$app/paths": path.resolve(practiceDir, "shims/paths.js"),
      "$env/dynamic/public": path.resolve(practiceDir, "shims/env-public.js"),
    },
  },
  build: {
    outDir: path.resolve(practiceDir, "dist"),
    emptyOutDir: true,
    target: "esnext",
    sourcemap: false,
  },
  server: {
    port: 5173,
    strictPort: false,
    fs: {
      allow: [repoRoot, practiceDir],
    },
  },
});

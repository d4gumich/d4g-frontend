/**
 * Central configuration for the frontend.
 * Uses build-safe environment variable access with fallback.
 */

import { env } from "$env/dynamic/public";

// Production builds have no PUBLIC_BACKEND_URL, so they stay on PythonAnywhere.
// Dev mode loads PUBLIC_BACKEND_URL from .env.development. Vite only puts VITE_* on
// import.meta.env, so the documented PUBLIC_ name has to come from SvelteKit's env.
const DEFAULT_BACKEND_URL = "https://d4gumsi.pythonanywhere.com/";

const configured =
  env.PUBLIC_BACKEND_URL ||
  import.meta.env.VITE_PUBLIC_BACKEND_URL ||
  DEFAULT_BACKEND_URL;

export const PUBLIC_BACKEND_URL = configured;

export const HOST_URL = configured.endsWith("/")
  ? configured
  : `${configured}/`;

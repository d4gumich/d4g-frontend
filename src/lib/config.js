/**
 * Central configuration for the frontend.
 * Uses build-safe environment variable access with fallback.
 */

// Fallback to PythonAnywhere production URL
const DEFAULT_BACKEND_URL = 'https://d4gumsi.pythonanywhere.com/';

// In SvelteKit/Vite, import.meta.env handles optional variables without crashing the build
export const PUBLIC_BACKEND_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL;

export const HOST_URL = PUBLIC_BACKEND_URL.endsWith('/') ? PUBLIC_BACKEND_URL : `${PUBLIC_BACKEND_URL}/`;

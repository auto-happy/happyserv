export const CONFIG = {
  SITE_URL: import.meta.env.VITE_SITE_URL || 'http://localhost:3000',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  BASE_PATH: import.meta.env.VITE_BASE_PATH || '/',
  DOWNLOAD_BASE_URL: import.meta.env.VITE_DOWNLOAD_BASE_URL || 'https://github.com/auto-happy/happyserv/releases/download',
} as const

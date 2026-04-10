/**
 * Centralized API configuration.
 * Uses the VITE_API_URL environment variable if available,
 * otherwise falls back to the production URL.
 */
export const API_URL = import.meta.env.VITE_API_URL || 'https://aakt-backend-production.up.railway.app';

// API Configuration
// In production, uses VITE_API_URL from .env.production
// In development, uses localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

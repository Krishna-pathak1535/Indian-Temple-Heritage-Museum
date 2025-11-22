import axios from 'axios';
import { Temple, User, Weapon, Fossil, Visit, HighScore, Feedback } from '../types';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await api.post('/api/v1/auth/register', { email, password });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    return response.data;
  },
};

export const userAPI = {
  getMe: async (): Promise<User> => {
    const response = await api.get('/api/v1/user/me');
    return response.data;
  },

  // Submit user feedback (rating and message)
  submitFeedback: async (rating: number, message: string): Promise<Feedback> => {
    const response = await api.post('/api/v1/user/feedback', { rating, message });
    return response.data;
  },

  // Track room visit
  trackVisit: async (room: string): Promise<Visit> => {
    const response = await api.post('/api/v1/user/track-visit', { room });
    return response.data;
  },

  // Get user's high scores
  getUserHighScores: async (): Promise<HighScore[]> => {
    const response = await api.get('/api/v1/user/high-scores');
    return response.data;
  },
};
export const contentAPI = {
  // Temples
  getAllTemples: async (): Promise<Temple[]> => {
    const response = await api.get('/api/v1/content/temples');
    return response.data;
  },
  
  // Weapons
  getAllWeapons: async (): Promise<Weapon[]> => {
    const response = await api.get('/api/v1/content/weapons');
    return response.data;
  },
  
  // Fossils (replaces animals)
  getAllFossils: async (): Promise<Fossil[]> => {
    const response = await api.get('/api/v1/content/fossils');
    return response.data;
  },
  
  // Media URL builder - supports categorized directory structure
  getMediaURL: (category: 'temples' | 'weapons' | 'fossils', mediaType: 'images' | 'audio', filename: string): string => {
    // Extract just the filename if it includes category prefix
    const cleanFilename = filename.includes('/') ? filename.split('/')[1] : filename;
    return `${API_BASE_URL}/api/v1/content/media/${category}/${mediaType}/${cleanFilename}`;
  },
  
  // Helper methods for specific media types
  getImageURL: (category: 'temples' | 'weapons' | 'fossils', filename: string): string => {
    return contentAPI.getMediaURL(category, 'images', filename);
  },
  
  getAudioURL: (category: 'temples' | 'weapons' | 'fossils', filename: string): string => {
    return contentAPI.getMediaURL(category, 'audio', filename);
  },
};

// Gamification API (public endpoints)
export const gamificationAPI = {
  // Get leaderboard (top scores)
  getLeaderboard: async (gameMode?: string, limit: number = 20): Promise<HighScore[]> => {
    const params = { limit };
    if (gameMode) {
      (params as any).game_mode = gameMode;
    }
    const response = await api.get('/api/v1/gamification/leaderboard', { params });
    return response.data;
  },

  // Submit game score
  submitScore: async (score: number, gameMode: string): Promise<HighScore> => {
    const response = await api.post('/api/v1/gamification/score', { score, game_mode: gameMode });
    return response.data;
  },
};

// Admin API (admin-only endpoints)
export const adminAPI = {
  // Temple management
  createTemple: async (templeData: any): Promise<Temple> => {
    const response = await api.post('/api/v1/admin/temples', templeData);
    return response.data;
  },

  updateTemple: async (id: number, templeData: any): Promise<Temple> => {
    const response = await api.put(`/api/v1/admin/temples/${id}`, templeData);
    return response.data;
  },

  deleteTemple: async (id: number): Promise<any> => {
    const response = await api.delete(`/api/v1/admin/temples/${id}`);
    return response.data;
  },

  // Weapon management
  createWeapon: async (weaponData: any): Promise<Weapon> => {
    const response = await api.post('/api/v1/admin/weapons', weaponData);
    return response.data;
  },

  updateWeapon: async (id: number, weaponData: any): Promise<Weapon> => {
    const response = await api.put(`/api/v1/admin/weapons/${id}`, weaponData);
    return response.data;
  },

  deleteWeapon: async (id: number): Promise<any> => {
    const response = await api.delete(`/api/v1/admin/weapons/${id}`);
    return response.data;
  },

  // Fossil management
  createFossil: async (fossilData: any): Promise<Fossil> => {
    const response = await api.post('/api/v1/admin/fossils', fossilData);
    return response.data;
  },

  updateFossil: async (id: number, fossilData: any): Promise<Fossil> => {
    const response = await api.put(`/api/v1/admin/fossils/${id}`, fossilData);
    return response.data;
  },

  deleteFossil: async (id: number): Promise<any> => {
    const response = await api.delete(`/api/v1/admin/fossils/${id}`);
    return response.data;
  },

  // Analytics
  getVisitStats: async (): Promise<any> => {
    const response = await api.get('/api/v1/admin/visits/stats');
    return response.data;
  },

  // Leaderboard (admin view with all data)
  getLeaderboardAdmin: async (gameMode?: string, limit: number = 50): Promise<HighScore[]> => {
    const params = { limit };
    if (gameMode) {
      (params as any).game_mode = gameMode;
    }
    const response = await api.get('/api/v1/admin/leaderboard', { params });
    return response.data.leaderboard || [];
  },

  // Get all feedback
  getAllFeedback: async (limit: number = 100): Promise<Feedback[]> => {
    const response = await api.get('/api/v1/admin/feedback', { params: { limit } });
    return response.data.feedback || [];
  },
};

export default api;

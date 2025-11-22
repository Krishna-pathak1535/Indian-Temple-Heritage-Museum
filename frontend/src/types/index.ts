export interface Temple {
  id: number;
  name: string;
  dynasty: string;
  builder: string;
  time_period: string;
  historical_significance: string;
  weapon_used: string;
  static_image_url: string;
  model_3d_embed?: string;  // Sketchfab model ID for 3D embed
  audio_story_url: string;
}

export interface Weapon {
  id: number;
  name: string;
  dynasty_context: string[];
  type: string;
  description: string;
  image_url: string;
  model_3d_embed?: string;  // Sketchfab model ID for 3D embed
  audio_story_url: string;
}

export interface Fossil {
  id: number;
  name: string;
  fossil_type: string;
  era: string;
  age_in_years: number;
  description: string;
  origin_location: string;
  image_url: string;
  model_3d_embed?: string;  // Sketchfab model ID for 3D embed
  audio_story_url: string;
}

export interface Visit {
  id: number;
  user_id: number;
  room: string;
  visited_at: string;
}

export interface HighScore {
  id: number;
  user_id: number;
  score: number;
  game_mode: string;
  achieved_at: string;
}

export interface Feedback {
  id: number;
  user_id: number;
  rating: number;
  message: string;
  submitted_at: string;
}

export interface User {
  id: number;
  email: string;
  is_admin: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface TemplePosition {
  temple: Temple;
  position: [number, number, number];
}

export interface WeaponPosition {
  weapon: Weapon;
  position: [number, number, number];
}

export interface FossilPosition {
  fossil: Fossil;
  position: [number, number, number];
}

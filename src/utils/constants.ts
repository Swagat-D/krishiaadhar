// src/utils/constants.ts
export const BASE_URL = 'https://krishiaadhar.devsomeware.com/api';

// App Configuration
export const APP_CONFIG = {
  name: 'KrishiAadhar',
  version: '2.0.0',
  termsUrl: 'https://krishiaadhar-frontend.vercel.app/terms-condition',
  privacyUrl: 'https://krishiaadhar-frontend.vercel.app/privacy-policy',
} as const;

// Crop Types
export const CROP_TYPE_OPTIONS = [
  'Cereal', 
  'Vegetable', 
  'Fruit', 
  'Pulses', 
  'Oilseeds'
] as const;

// Season Types
export const SEASON_OPTIONS = [
  'Rabi', 
  'Kharif', 
  'Zaid'
] as const;

// Irrigation Types
export const IRRIGATION_TYPE_OPTIONS = [
  "DRIP", 
  "SPRINKLER", 
  "SURFACE", 
  "SUBSURFACE"
] as const;

// User Roles
export const USER_ROLES = {
  FARMER: 'FARMER',
  EXPERT: 'AGRIEXPERT',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  FARMER_LOGIN: '/farmer/login',
  FARMER_REGISTER: '/farmer',
  EXPERT_LOGIN: '/expert/login',
  EXPERT_REGISTER: '/expert',
  
  // Services
  SMART_IRRIGATION: '/farmer/service/smart-irrigation',
  DRONE_SPRAYING: '/farmer/service/drone-spraying',
  
  // Crop Calendar
  CROP_CALENDAR: '/farmer/cropcalendar',
  CROP_CALENDAR_ALL: '/farmer/cropcalendar/all',
  
  // Posts
  POSTS_ALL: '/posts/all',
  POSTS_CREATE: '/farmer/posts/create',
  POSTS_LIKE: '/like/post',
} as const;
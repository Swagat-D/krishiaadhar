// src/types/index.ts
import { CROP_TYPE_OPTIONS, SEASON_OPTIONS, IRRIGATION_TYPE_OPTIONS, USER_ROLES } from '../utils/constants';

// User Types
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type CropType = typeof CROP_TYPE_OPTIONS[number];
export type Season = typeof SEASON_OPTIONS[number];
export type IrrigationType = typeof IRRIGATION_TYPE_OPTIONS[number];

export interface User {
  id?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  profilePic?: string;
  role: UserRole;
  token: string;
  location?: string;
}

// Crop Calendar Types
export interface CropCalendar {
  id: string;
  projectName: string;
  projectDescription: string;
  cropName: string;
  cropType: CropType;
  fieldSize: number;
  location: string;
  season: Season;
  startDate: string;
  seedVariety?: string;
  cropVariety?: string;
  status: 'PENDING' | 'COMPLETED';
  expert?: {
    id: string;
    name: string;
  };
}

// Post Types
export interface Post {
  id: string;
  content: string;
  image?: string;
  likeCount: number;
  farmer: {
    id: string;
    name: string;
    image?: string;
  };
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image?: string;
    role: UserRole;
  };
  createdAt: string;
}

// Service Request Types
export interface SmartIrrigationRequest {
  farmLocation: string;
  irrigationType: IrrigationType;
  areaInHectares: number;
  cropType: CropType;
  query: string;
}

export interface DroneSprayingRequest {
  farmLocation: string;
  cropType: CropType;
  areaInHectares: number;
  sprayDate: string;
  query: string;
}

export interface SoilHealthRequest {
  farmLocation: string;
  soilType: string;
  cropType: string;
  areaInHectares: string;
  query: string;
}

export interface ExpertVisitRequest {
  farmLocation: string;
  soilType: string;
  cropType: string;
  areaInHectares: string;
  query: string;
}

// Navigation Types
export type AuthStackParamList = {
  Welcome: undefined;
  Authentication: { role: UserRole };
};

export type MainStackParamList = {
  Main: undefined;
  CropCalendar: undefined;
  Calendar: { id: string };
  YourCropCalendar: undefined;
  CreateCropCalendar: { type: string };
  SmartIrrigation: undefined;
  DroneSprayingService: undefined;
  SoilHealthMap: undefined;
  CropHealthMonitor: undefined;
  ExpertVisit: undefined;
  SubmissionSuccess: {
    message: string;
    navigateBackTo: string;
  };
  TermsAndService: { path: 'terms' | 'privacy' };
};

export type TabParamList = {
  Home: undefined;
  Feed: undefined;
  Profile: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  response: T;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Form Types
export interface LoginFormData {
  phoneNumber?: string;
  email?: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  phoneNumber?: string;
  email?: string;
  password: string;
  role: UserRole;
}
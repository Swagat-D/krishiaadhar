// src/store/userStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface UserState {
  userData: User | null;
  isLoading: boolean;
  setUserData: (data: User) => void;
  resetUserData: () => void;
  updateUserData: (updates: Partial<User>) => void;
  loadUserData: () => Promise<void>;
  saveUserData: () => Promise<void>;
}

const initialUserData: User = {
  name: '',
  email: '',
  phoneNumber: '',
  profilePic: '',
  role: 'FARMER',
  token: '',
  location: '',
};

export const useUserStore = create<UserState>((set, get) => ({
  userData: null,
  isLoading: false,

  setUserData: (data: User) => {
    set({ userData: data });
    // Auto-save to AsyncStorage
    AsyncStorage.setItem('userData', JSON.stringify(data));
  },

  resetUserData: () => {
    set({ userData: null });
    AsyncStorage.removeItem('userData');
    AsyncStorage.removeItem('location');
  },

  updateUserData: (updates: Partial<User>) => {
    const currentData = get().userData;
    if (currentData) {
      const updatedData = { ...currentData, ...updates };
      set({ userData: updatedData });
      AsyncStorage.setItem('userData', JSON.stringify(updatedData));
    }
  },

  loadUserData: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem('userData');
      if (stored) {
        const userData = JSON.parse(stored);
        set({ userData });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveUserData: async () => {
    try {
      const userData = get().userData;
      if (userData) {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },
}));
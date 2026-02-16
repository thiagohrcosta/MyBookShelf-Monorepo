import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface UserProfile {
  id: number;
  full_name?: string | null;
  email: string;
  role?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const profileService = {
  async getUserProfile(): Promise<UserProfile> {
    const token = await AsyncStorage.getItem('authToken');

    const response = await axios.get<UserProfile>(`${API_BASE_URL}/api/v1/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export interface UserProfileResponse {
  data: UserProfile;
}

export const profileService = {
  async getUserProfile(): Promise<UserProfileResponse> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = axios.get<any>(
        `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
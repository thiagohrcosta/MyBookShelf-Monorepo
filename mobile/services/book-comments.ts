import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"


export const bookComents = {
  async getBookComments(bookId: number): Promise<any[]> {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = axios.get<any>(
        `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/books/${bookId}/reviews`, {
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
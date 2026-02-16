import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface BookInYear {
  id: number;
  title: string;
  author: string;
  publisher: string;
  month: number;
  year: number;
  box_cover_url?: string;
  pages: number;
}

export interface MonthData {
  month: number;
  count: number;
}

export interface YearData {
  year: number;
  count: number;
}

export interface UserStatistics {
  books_per_year: YearData[];
  books_per_month: MonthData[];
  books_in_year: BookInYear[];
  total_books: number;
  total_pages: number;
  books_this_year: number;
  selected_year: number;
  available_years: number[];
}

/**
 * Fetches authenticated user reading statistics for a specific year.
 *
 * Keeping this logic in a dedicated service follows SRP and keeps
 * screen components focused on rendering state.
 */
async function getStatistics(year: number): Promise<UserStatistics> {
  const token = await AsyncStorage.getItem('authToken');

  const response = await axios.get<UserStatistics>(`${API_BASE_URL}/api/v1/statistics`, {
    params: { year },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export const userStatisticsService = {
  getStatistics,
};

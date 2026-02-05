import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface RecentActivity {
  id: number;
  user_name: string;
  book_title: string;
  author_name: string;
  action: string;
  date: string;
}

export interface PlatformStatistics {
  total_books: number;
  total_pages: number;
  most_read_author: {
    id: number;
    name: string;
    read_count: number;
  } | null;
  recent_activities?: RecentActivity[];
}

export const platformStatisticsService = {
  async getStatistics(): Promise<PlatformStatistics> {
    const response = await axios.get<PlatformStatistics>(
      `${API_BASE_URL}/api/v1/platform_statistics`
    );
    return response.data;
  },
};

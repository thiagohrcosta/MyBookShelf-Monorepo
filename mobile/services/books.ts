import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface Author {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author_id: number;
  author?: Author;
  cover_image_url?: string;
  box_cover_url?: string;
  created_at?: string;
  publication_year?: number;
  release_year?: number;
  description?: string;
  summary?: string;
  isbn: string;
}

export interface BooksResponse {
  data: Book[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export const booksService = {
  async getBooks(
    page: number = 1,
    per_page: number = 9,
    search?: string,
    status?: string
  ): Promise<BooksResponse> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const params: any = { page, per_page };

      if (search) {
        params.search = search;
      }

      if (status && status !== 'all') {
        params.status = status;
      }

      const response = await axios.get<any>(
        `${API_BASE_URL}/api/v1/books`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle both wrapped and unwrapped responses
      const data = response.data.data || response.data;
      const books = Array.isArray(data) ? data : data.books || [];

      console.log('Books fetched:', books.length);
      if (books.length > 0) {
        console.log('First book:', JSON.stringify(books[0], null, 2));
      }

      return {
        data: books,
        pagination: {
          current_page: page,
          total_pages: Math.ceil((books.length || 0) / per_page),
          total_count: books.length || 0,
          per_page,
        },
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Books API Error:', error.response?.data);
        throw new Error(error.response?.data?.error || 'Failed to fetch books');
      }
      throw error;
    }
  },

  async getBook(id: number): Promise<Book> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get<any>(
        `${API_BASE_URL}/api/v1/books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data || response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch book');
      }
      throw error;
    }
  },
};

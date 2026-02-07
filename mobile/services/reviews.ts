import axios from "axios"


interface BookReview {
  id: number;
  book_id: number;
  user_id: number;
  rating: number;
  review: string;
  created_at: string;
  updated_at: string;
}

interface ReviewsResponse {
  data: BookReview[];
}

export const reviewsService = {
  async getReviews(): Promise<ReviewsResponse> {
    try {
      const response = await axios.get<ReviewsResponse>(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/books_with_reviews`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
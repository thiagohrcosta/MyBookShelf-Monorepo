import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type PostBookReviewParams = {
  rating: number;
  review: string;
  bookId: number;
}

export default function PostBookReview({rating, review, bookId}: PostBookReviewParams) {
  const postReview = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/book_reviews`, {
        "book_review": {
          "rating": rating,
          "review": review,
          "book_id": bookId
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  return { postReview };
}
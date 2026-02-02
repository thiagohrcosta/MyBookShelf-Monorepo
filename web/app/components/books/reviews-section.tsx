"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ReviewCard } from "./review-card";

interface ReviewsSectionProps {
  bookId: string;
  refreshKey?: number;
}

interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  likes: number;
}

interface ApiReview {
  id: number;
  rating: number;
  review: string;
  user_id: number;
  book_id: number;
  created_at: string;
  updated_at: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

function formatReviewDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function mapReview(review: ApiReview): Review {
  const author = review.user_id ? `Reader #${review.user_id}` : "Reader";
  const avatar = review.user_id ? `U${review.user_id}` : "U";

  return {
    id: review.id,
    author,
    avatar,
    rating: review.rating,
    date: formatReviewDate(review.created_at),
    content: review.review,
    likes: 0
  };
}

export function ReviewsSection({ bookId, refreshKey }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadReviews() {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ApiReview[]>(
          `${baseUrl}/api/v1/books/${bookId}/reviews`
        );
        const data = response.data;
        if (!isActive) return;
        setReviews((data || []).map(mapReview));
      } catch {
        if (!isActive) return;
        setError("Unable to load reviews.");
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    }

    loadReviews();

    return () => {
      isActive = false;
    };
  }, [bookId, refreshKey]);

  if (loading) {
    return <div className="text-gray-500">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-gray-500">{error}</div>;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-serif text-gray-900 mb-6">Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet. Be the first to share your thoughts.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

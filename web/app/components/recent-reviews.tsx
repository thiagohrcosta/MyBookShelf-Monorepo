"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface RecentReview {
  id: number;
  rating: number;
  review: string;
  user_name: string;
  user_email: string;
  created_at: string;
  book: {
    id: number;
    title: string;
    author: string;
  };
}

function formatReviewDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function truncateText(text: string, maxLength: number = 100) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export function RecentReviews() {
  const [reviews, setReviews] = useState<RecentReview[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const router = useRouter();

  useEffect(() => {
    async function fetchRecentReviews() {
      try {
        const response = await axios.get<RecentReview[]>(
          `${baseUrl}/api/v1/book_reviews/recent?limit=5`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching recent reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentReviews();
  }, [baseUrl]);
  return (
    <section className="px-8 py-6">
      <h2 className="text-2xl font-serif text-gray-800 mb-6">Recent Reviews</h2>

      {loading ? (
        <div className="text-gray-600">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-600">No reviews yet</div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push(`/books/${review.book.id}`)}>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-sm font-semibold text-gray-600">
                {review.user_name.substring(0, 1).toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800 hover:text-blue-600 transition-colors">{review.book.title}</h3>
                    <p className="text-sm text-gray-600">{review.book.author}</p>
                  </div>
                  <span className="text-sm text-gray-500">{formatReviewDate(review.created_at)}</span>
                </div>

                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-700 line-clamp-2">
                  {truncateText(review.review, 100)}
                </p>
                <button className="text-sm text-gray-500 hover:text-gray-700 mt-1">
                  Read more →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

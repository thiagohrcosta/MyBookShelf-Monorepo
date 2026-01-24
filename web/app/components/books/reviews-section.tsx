"use client";

import { useEffect, useState } from "react";
import { ReviewCard } from "./review-card";

interface ReviewsSectionProps {
  bookId: string;
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

export function ReviewsSection({ bookId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock reviews - será substituído por dados reais da API
    const mockReviews: Review[] = [
      {
        id: 1,
        author: "Michael Harrison",
        avatar: "MH",
        rating: 5,
        date: "Feb 9",
        content:
          '"An intense psychological drama that delves into the darkest corners of human guilt and redemption"\n\nFyodor Dostoevsky\'s "Crime and Punishment" is a powerful and compelling novel. From the first page, I was drawn into Raskolnikov\'s tortured mindset, experiencing his inner turmoil and justifications for his actions. The psychological tension is palpable as Dostoevsky masterfully explores themes of morality, guilt, and redemption. A must-read for anyone interested in philosophy.',
        likes: 12,
      },
      {
        id: 2,
        author: "David Johnson",
        avatar: "DJ",
        rating: 5,
        date: "January 28",
        content:
          "A gripping tale of moral conflict. Dostoevsky's 'Crime and Punishment' left me reflecting on ethics and morality. Brilliantly written.",
        likes: 0,
      },
    ];

    setReviews(mockReviews);
    setLoading(false);
  }, [bookId]);

  if (loading) {
    return <div className="text-gray-500">Loading reviews...</div>;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-serif text-gray-900 mb-6">Reviews</h2>

      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <button className="mt-8 text-blue-600 hover:text-blue-700 font-medium text-sm">
        Read all (3) →
      </button>
    </div>
  );
}

import { Heart, MessageCircle, Star } from "lucide-react";
import { ReviewComments } from "./review-comments";

interface ReviewCardProps {
  review: {
    id: number;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    content: string;
    likes: number;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const starRating = Math.round(review.rating / 2);
  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold flex-shrink-0">
          {review.avatar}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-gray-900">{review.author}</p>
            <span className="text-xs text-gray-500">Posted {review.date}</span>
          </div>

          {/* Rating */}
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < starRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">{review.rating}/10</span>
          </div>

          {/* Review Text */}
          <p className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
            {review.content}
          </p>

          {/* Actions */}
          <div className="flex gap-4 text-sm text-gray-600">
            <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
              <Heart size={16} />
              <span>{review.likes} Likes</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <MessageCircle size={16} />
              <span>Reply</span>
            </button>
          </div>

          <ReviewComments reviewId={review.id} />
        </div>
      </div>
    </div>
  );
}

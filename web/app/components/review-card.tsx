"use client";

import Link from "next/link";
import { Star } from "lucide-react";

interface ReviewCardProps {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookCover?: string;
  userName: string;
  userEmail: string;
  rating: number;
  review: string;
  createdAt: string;
}

function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export function ReviewCard({
  id,
  bookId,
  bookTitle,
  bookAuthor,
  bookCover,
  userName,
  userEmail,
  rating,
  review,
  createdAt,
}: ReviewCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
      {/* Header with user info and date */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
              {userName.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{userName}</h3>
              <p className="text-sm text-gray-500">{formatReviewDate(createdAt)}</p>
            </div>
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Book info and review content */}
      <div className="px-6 py-4">
        <div className="flex gap-4">
          {/* Book cover/placeholder */}
          <div className="flex-shrink-0">
            {bookCover ? (
              <img
                src={bookCover}
                alt={bookTitle}
                className="w-24 h-36 object-cover rounded-md shadow-sm"
              />
            ) : (
              <div className="w-24 h-36 rounded-md bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs text-gray-500 text-center p-2">
                <span>No cover</span>
              </div>
            )}
          </div>

          {/* Review content */}
          <div className="flex-1 min-w-0">
            <Link href={`/books/${bookId}`}>
              <h4 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                {bookTitle}
              </h4>
            </Link>
            <p className="text-sm text-gray-600 mb-3">{bookAuthor}</p>
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
              {review}
            </p>
          </div>
        </div>
      </div>

      {/* Footer with link */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <Link
          href={`/books/${bookId}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View book →
        </Link>
      </div>
    </article>
  );
}

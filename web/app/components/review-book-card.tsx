"use client";

import Link from "next/link";
import { Star } from "lucide-react";

interface BookReviewData {
  id: number;
  title: string;
  description: string;
  box_cover_url?: string;
  author: {
    id: number;
    name: string;
  };
  publisher: {
    id: number;
    name: string;
  };
  review_count: number;
  avg_rating: number;
  reviewers: Array<{
    name: string;
    initials: string;
  }>;
}

interface ReviewBookCardProps {
  book: BookReviewData;
}

const colors = [
  "bg-slate-400",
  "bg-slate-500",
  "bg-slate-600",
  "bg-gray-400",
  "bg-gray-500",
  "bg-gray-600",
  "bg-stone-400",
  "bg-stone-500",
];

export function ReviewBookCard({ book }: ReviewBookCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden border border-stone-200">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {book.box_cover_url ? (
            <img
              src={book.box_cover_url}
              alt={book.title}
              className="w-full md:w-40 h-64 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full md:w-40 h-64 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-sm text-center p-4">
              <span>No cover</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => {
                  const ratingInStars = book.avg_rating / 2;
                  const fillPercentage = Math.max(0, Math.min(1, ratingInStars - i));

                  return (
                    <div key={i} className="relative w-5 h-5">
                      <Star className="w-5 h-5 text-gray-300" />
                      <div
                        className="absolute top-0 left-0 overflow-hidden"
                        style={{ width: `${fillPercentage * 100}%` }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {book.avg_rating.toFixed(1)} ({book.review_count} {book.review_count === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Title and Author */}
            <Link href={`/books/${book.id}`}>
              <h3 className="text-xl font-serif font-bold text-gray-900 hover:text-stone-700 transition-colors mb-1">
                {book.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mb-3">By {book.author.name}</p>

            {/* Genre/Publisher */}
            <p className="text-sm text-gray-500 mb-3">
              {book.publisher.name}
            </p>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {book.description}
            </p>
          </div>

          {/* Footer: Reviewers and CTA */}
          <div className="flex items-center justify-between">
            {/* Reviewer Avatars */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {book.reviewers.slice(0, 3).map((reviewer, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-white text-xs font-bold border-2 border-white`}
                    title={reviewer.name}
                  >
                    {reviewer.initials}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {book.review_count} reviews
              </span>
            </div>

            {/* Read Now Button */}
            <Link href={`/books/${book.id}`}>
              <button className="bg-stone-700 hover:bg-stone-800 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                View book
              </button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

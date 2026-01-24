"use client";

import { Star } from "lucide-react";

interface RatingSectionProps {
  bookId: string;
}

export function RatingSection({ bookId }: RatingSectionProps) {
  // Mock data - será substituído por dados reais da API
  const overallRating = 4.7;
  const totalRatings = 573;

  const ratingDistribution = [
    { stars: 5, count: 382 },
    { stars: 4, count: 120 },
    { stars: 3, count: 56 },
    { stars: 2, count: 10 },
    { stars: 1, count: 5 },
  ];

  const maxCount = Math.max(...ratingDistribution.map((r) => r.count));

  return (
    <div className="border-t border-b border-gray-200 py-6">
      <div className="flex items-start gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-5xl font-serif text-gray-900 mb-1">
            {overallRating.toFixed(1)}
          </div>
          <div className="flex gap-1 mb-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(overallRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">{totalRatings} ratings</p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {ratingDistribution.map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-6 text-right">
                {stars}
              </span>
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-10">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

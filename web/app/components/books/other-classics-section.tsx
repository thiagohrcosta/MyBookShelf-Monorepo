"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

interface ClassicBook {
  id: number;
  title: string;
  author: string;
  rating: number;
  coverUrl?: string;
  date: string;
}

interface OtherClassicsSectionProps {
  currentBookId: string;
}

export function OtherClassicsSection({
  currentBookId,
}: OtherClassicsSectionProps) {
  const [books, setBooks] = useState<ClassicBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock books - será substituído por dados reais da API
    const mockBooks: ClassicBook[] = [
      {
        id: 1,
        title: "The Picture of Dorian Gray",
        author: "Oscar Wilde",
        rating: 4.8,
        date: "Feb 3",
        coverUrl: undefined,
      },
      {
        id: 2,
        title: "Brave New World",
        author: "Aldous Huxley",
        rating: 4.6,
        date: "Feb 5",
        coverUrl: undefined,
      },
      {
        id: 3,
        title: "One Hundred Years of Solitude",
        author: "Gabriel García Márquez",
        rating: 4.7,
        date: "Feb 7",
        coverUrl: undefined,
      },
    ];

    setBooks(mockBooks.filter((book) => book.id.toString() !== currentBookId));
    setLoading(false);
  }, [currentBookId]);

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-serif text-gray-900 mb-4">Other Classics</h3>

      <div className="space-y-4">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="block hover:opacity-75 transition-opacity"
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="w-12 h-20 rounded bg-gradient-to-br from-stone-300 to-stone-500 flex-shrink-0 flex items-center justify-center text-white text-xs text-center p-2">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="font-serif">{book.title}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {book.title}
                </p>
                <p className="text-xs text-gray-600 mb-1">{book.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={`${
                        i < Math.floor(book.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">
                    {book.date}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

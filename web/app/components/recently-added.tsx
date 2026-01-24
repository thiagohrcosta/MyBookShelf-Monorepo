"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Book {
  id: number;
  title: string;
  edition: string;
  language_version: string;
  isbn: string | null;
  author: {
    id: number;
    name: string;
  };
  publisher: {
    id: number;
    name: string;
  };
  box_cover_url?: string;
  created_at: string;
}

export function RecentlyAdded() {
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    async function fetchRecentBooks() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const response = await axios.get(`${baseUrl}/api/v1/books`);

        const sortedBooks = response.data.sort((a: Book, b: Book) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecentBooks(sortedBooks.slice(0, 5));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecentBooks();
  }, []);

  if (loading) {
    return (
      <section className="px-8 py-6">
        <h2 className="text-2xl font-serif text-gray-800 mb-6">Recently Added</h2>
        <div className="text-gray-600">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-8 py-6">
        <h2 className="text-2xl font-serif text-gray-800 mb-6">Recently Added</h2>
        <div className="text-red-600">Error: {error}</div>
      </section>
    );
  }

  return (
    <section className="px-8 py-6">
      <h2 className="text-2xl font-serif text-gray-800 mb-6">Recently Added</h2>

      <div className="relative">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {recentBooks.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <div className="flex-shrink-0 w-32 cursor-pointer hover:opacity-75 transition-opacity">
                <div className="w-32 h-48 bg-gradient-to-br from-stone-400 to-stone-600 rounded shadow-md mb-3 flex items-center justify-center text-white font-bold text-xs text-center p-4">
                  {book.box_cover_url ? (
                    <img
                      src={`${book.box_cover_url}`}
                      alt={book.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    book.title
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600">{book.author.name}</p>
                <p className="text-xs text-gray-500">{book.edition}</p>
              </div>
            </Link>
          ))}
        </div>

        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Header } from "@/app/components/header";
import { BookCover } from "./book-cover";
import { BookHeader } from "./book-header";
import { BookInfo } from "./book-info";
import { RatingSection } from "./rating-section";
import { ReadingStatus } from "./reading-status";
import { ReviewsSection } from "./reviews-section";
import { OtherClassicsSection } from "./other-classics-section";

interface Book {
  id: number;
  title: string;
  original_title: string;
  summary: string;
  pages: number;
  edition: string;
  language_version: string;
  release_year: number;
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
  updated_at: string;
}

interface BookDetailProps {
  book: Book;
  bookId: string;
}

export function BookDetail({ book, bookId }: BookDetailProps) {
  const [isRating, setIsRating] = useState(false);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Left: Book Cover */}
              <div className="md:col-span-1">
                <BookCover
                  coverUrl={book.box_cover_url}
                  title={book.title}
                  author={book.author.name}
                />
              </div>

              {/* Right: Book Info */}
              <div className="md:col-span-2 space-y-6">
                <BookHeader
                  title={book.title}
                  author={book.author.name}
                  originalTitle={book.original_title}
                  releaseYear={book.release_year}
                  genre="Classics"
                  category="Fiction"
                />

                <RatingSection bookId={bookId} />

                <ReadingStatus />

                <BookInfo
                  pages={book.pages}
                  edition={book.edition}
                  isbn="9788491051666"
                  language={book.language_version}
                  publisher={book.publisher.name}
                />

                <button
                  onClick={() => setIsRating(!isRating)}
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium py-3 px-4 rounded transition-colors"
                >
                  Rate this book
                </button>
              </div>
            </div>

            {/* Book Summary */}
            <div className="mb-12">
              <h2 className="text-xl font-serif text-gray-800 mb-4">Summary</h2>
              <p className="text-gray-600 leading-relaxed text-justify">
                {book.summary}
              </p>
            </div>

            {/* Reviews Section */}
            <ReviewsSection bookId={bookId} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OtherClassicsSection currentBookId={bookId} />
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/components/header";
import { BookCover } from "./book-cover";
import { BookHeader } from "./book-header";
import { BookInfo } from "./book-info";
import { RatingSection } from "./rating-section";
import { ReadingStatus } from "./reading-status";
import { ReviewsSection } from "./reviews-section";
import { OtherClassicsSection } from "./other-classics-section";
import { useAuth } from "@/app/context/auth-context";

interface BookList {
  id: number;
  status: string;
  read_month?: number | null;
  read_year?: number | null;
}

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
  const router = useRouter();
  const { isAuthenticated, authFetch } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const [bookList, setBookList] = useState<BookList | null>(null);
  const [status, setStatus] = useState<string>("");
  const [readMonth, setReadMonth] = useState<string>("");
  const [readYear, setReadYear] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, index) => currentYear - index);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadBookList() {
      try {
        const response = await authFetch(`${baseUrl}/api/v1/books/${bookId}/book_list`);
        if (!response.ok) return;

        const data = await response.json();
        if (data?.book_list === null) {
          setBookList(null);
          setStatus("");
          setReadMonth("");
          setReadYear("");
          return;
        }

        setBookList(data as BookList);
        setStatus(data.status || "");
        setReadMonth(data.read_month ? String(data.read_month) : "");
        setReadYear(data.read_year ? String(data.read_year) : "");
      } catch {
        // ignore
      }
    }

    loadBookList();
  }, [authFetch, baseUrl, bookId, isAuthenticated]);

  async function handleSaveStatus() {
    if (!status) {
      setStatusError("Select a status first.");
      return;
    }

    if (status === "finished" && (!readMonth || !readYear)) {
      setStatusError("Select month and year for finished books.");
      return;
    }

    setIsSaving(true);
    setStatusError(null);

    try {
      const response = await authFetch(`${baseUrl}/api/v1/book_lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_list: {
            book_id: book.id,
            status: status,
            read_month: readMonth ? Number(readMonth) : undefined,
            read_year: readYear ? Number(readYear) : undefined
          }
        })
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setStatusError(data?.errors?.read_month?.[0] || "Unable to save status.");
        return;
      }

      setBookList(data as BookList);
      setStatus(data.status || status);
      setReadMonth(data.read_month ? String(data.read_month) : readMonth);
      setReadYear(data.read_year ? String(data.read_year) : readYear);
    } catch {
      setStatusError("Unable to save status.");
    } finally {
      setIsSaving(false);
    }
  }

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

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsRating(!isRating)}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium py-3 px-4 rounded transition-colors"
                  >
                    Rate this book
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={() => router.push(`/books/${bookId}/edit`)}
                      className="px-6 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 border border-stone-200 rounded transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isAuthenticated && (
                  <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">My status</h3>
                      {bookList && (
                        <span className="text-xs text-gray-500">Saved</span>
                      )}
                    </div>

                    {statusError ? (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                        {statusError}
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                        <select
                          value={status}
                          onChange={(event) => setStatus(event.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                        >
                          <option value="">Select</option>
                          <option value="acquired">I own it</option>
                          <option value="reading">Reading</option>
                          <option value="finished">Finished</option>
                          <option value="abandoned">Abandoned</option>
                          <option value="wishlist">Wishlist</option>
                        </select>
                      </div>

                      {status === "finished" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
                            <select
                              value={readMonth}
                              onChange={(event) => setReadMonth(event.target.value)}
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                            >
                              <option value="">Month</option>
                              {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                                <option key={month} value={month}>
                                  {month}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                            <select
                              value={readYear}
                              onChange={(event) => setReadYear(event.target.value)}
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                            >
                              <option value="">Year</option>
                              {yearOptions.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveStatus}
                      disabled={isSaving}
                      className="w-full rounded-lg bg-amber-900 py-2 text-sm font-medium text-white hover:bg-amber-950 disabled:opacity-70"
                    >
                      {isSaving ? "Saving..." : "Save status"}
                    </button>
                  </div>
                )}
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

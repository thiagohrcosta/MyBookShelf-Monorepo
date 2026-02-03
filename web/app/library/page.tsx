"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useAuth } from "../context/auth-context";

interface BookList {
  id: number;
  book_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Book {
  id: number;
  title: string;
  author: {
    id: number;
    name: string;
  };
  box_cover_url?: string;
}

const STATUS_META: Record<
  string,
  { label: string; classes: string }
> = {
  acquired: {
    label: "Owned",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  reading: {
    label: "Reading",
    classes: "bg-blue-50 text-blue-700 border-blue-200"
  },
  finished: {
    label: "Finished",
    classes: "bg-purple-50 text-purple-700 border-purple-200"
  },
  abandoned: {
    label: "Abandoned",
    classes: "bg-rose-50 text-rose-700 border-rose-200"
  },
  wishlist: {
    label: "Wishlist",
    classes: "bg-amber-50 text-amber-700 border-amber-200"
  }
};

export default function MyLibraryPage() {
  const router = useRouter();
  const { authRequest, isAuthenticated, isLoading } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const [bookLists, setBookLists] = useState<BookList[]>([]);
  const [booksById, setBooksById] = useState<Record<number, Book>>({});
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusByBookId, setStatusByBookId] = useState<Record<number, string>>({});
  const [readMonthByBookId, setReadMonthByBookId] = useState<Record<number, string>>({});
  const [readYearByBookId, setReadYearByBookId] = useState<Record<number, string>>({});
  const [saveErrorByBookId, setSaveErrorByBookId] = useState<Record<number, string>>({});
  const [isSavingByBookId, setIsSavingByBookId] = useState<Record<number, boolean>>({});
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, index) => currentYear - index);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchLibrary() {
      setIsFetching(true);
      setError(null);

      try {
        const listsResponse = await authRequest<BookList[]>({
          url: `${baseUrl}/api/v1/book_lists`,
          method: "GET"
        });

        const listsData = listsResponse.data || [];
        setBookLists(listsData);

        const uniqueBookIds = Array.from(
          new Set((listsData || []).map((list) => list.book_id))
        );

        if (uniqueBookIds.length === 0) {
          setBooksById({});
          return;
        }

        const bookResponses = await Promise.all(
          uniqueBookIds.map((bookId) =>
            authRequest<Book>({ url: `${baseUrl}/api/v1/books/${bookId}`, method: "GET" })
          )
        );

        const mappedBooks: Record<number, Book> = {};
        bookResponses.forEach((response) => {
          if (response.data) {
            mappedBooks[response.data.id] = response.data;
          }
        });

        setBooksById(mappedBooks);

        const booksResponse = await authRequest<Book[]>({
          url: `${baseUrl}/api/v1/books`,
          method: "GET"
        });
        setAllBooks(booksResponse.data || []);
      } catch {
        setError("Unable to load library.");
      } finally {
        setIsFetching(false);
      }
    }

    fetchLibrary();
  }, [authRequest, baseUrl, isAuthenticated]);

  const libraryItems = useMemo(() => {
    return bookLists
      .map((list) => ({
        list,
        book: booksById[list.book_id]
      }))
      .filter((item) => item.book);
  }, [bookLists, booksById]);

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return allBooks;
    const query = searchQuery.toLowerCase();
    return allBooks.filter((book) => {
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.name.toLowerCase().includes(query)
      );
    });
  }, [allBooks, searchQuery]);

  async function handleAddToLibrary(book: Book) {
    const status = statusByBookId[book.id];
    const readMonth = readMonthByBookId[book.id];
    const readYear = readYearByBookId[book.id];

    if (!status) {
      setSaveErrorByBookId((prev) => ({
        ...prev,
        [book.id]: "Select a status before saving."
      }));
      return;
    }

    if (status === "finished" && (!readMonth || !readYear)) {
      setSaveErrorByBookId((prev) => ({
        ...prev,
        [book.id]: "Select month and year for finished books."
      }));
      return;
    }

    setIsSavingByBookId((prev) => ({ ...prev, [book.id]: true }));
    setSaveErrorByBookId((prev) => ({ ...prev, [book.id]: "" }));

    try {
      const response = await authRequest<BookList>({
        url: `${baseUrl}/api/v1/book_lists`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          book_list: {
            book_id: book.id,
            status: status,
            read_month: readMonth ? Number(readMonth) : undefined,
            read_year: readYear ? Number(readYear) : undefined
          }
        }
      });

      const data = response.data;
      setBookLists((prev) => {
        const existingIndex = prev.findIndex((list) => list.book_id === book.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        }
        return [...prev, data];
      });

      setBooksById((prev) => ({
        ...prev,
        [book.id]: book
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { errors?: Record<string, string[]> } | undefined;
        setSaveErrorByBookId((prev) => ({
          ...prev,
          [book.id]: data?.errors?.read_month?.[0] || "Unable to save status."
        }));
        return;
      }
      setSaveErrorByBookId((prev) => ({
        ...prev,
        [book.id]: "Unable to save status."
      }));
    } finally {
      setIsSavingByBookId((prev) => ({ ...prev, [book.id]: false }));
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-gray-900">My Library</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              All the books you marked as owned, reading, finished, abandoned, or wishlist.
            </p>
          </div>
          <a
            href="#add-book"
            className="px-4 py-2 rounded-lg bg-amber-900 text-white text-sm font-medium hover:bg-amber-950 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            Add from catalog
          </a>
        </div>

        {isFetching ? (
          <div className="text-gray-600">Loading your library...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : libraryItems.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-gray-600">
            No books in your library yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryItems.map(({ list, book }) => {
              const statusMeta = STATUS_META[list.status] || {
                label: list.status,
                classes: "bg-gray-100 text-gray-700 border-gray-200"
              };

              return (
                <Link
                  key={list.id}
                  href={`/books/${book?.id}`}
                  className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      {book?.box_cover_url ? (
                        <img
                          src={book.box_cover_url}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-stone-400">
                          No cover
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-amber-900 transition-colors">
                          {book?.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${statusMeta.classes}`}
                        >
                          {statusMeta.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{book?.author?.name}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <section id="add-book" className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif text-gray-900">Add from catalog</h2>
              <p className="text-gray-600 mt-2">
                Search books already registered and mark your status.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title or author"
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
            />
          </div>

          {filteredBooks.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-gray-600">
              No books found.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredBooks.map((book) => {
                const statusValue = statusByBookId[book.id] || "";
                const isFinished = statusValue === "finished";

                return (
                  <div
                    key={book.id}
                    className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {book.box_cover_url ? (
                          <img
                            src={book.box_cover_url}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-stone-400">
                            No cover
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author.name}</p>
                        <Link
                          href={`/books/${book.id}`}
                          className="text-xs text-amber-900 hover:text-amber-950"
                        >
                          View details
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                        <select
                          value={statusValue}
                          onChange={(event) =>
                            setStatusByBookId((prev) => ({
                              ...prev,
                              [book.id]: event.target.value
                            }))
                          }
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

                      <div className="md:col-span-2 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
                          <select
                            value={readMonthByBookId[book.id] || ""}
                            onChange={(event) =>
                              setReadMonthByBookId((prev) => ({
                                ...prev,
                                [book.id]: event.target.value
                              }))
                            }
                            disabled={!isFinished}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30 disabled:bg-gray-50"
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
                            value={readYearByBookId[book.id] || ""}
                            onChange={(event) =>
                              setReadYearByBookId((prev) => ({
                                ...prev,
                                [book.id]: event.target.value
                              }))
                            }
                            disabled={!isFinished}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30 disabled:bg-gray-50"
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
                    </div>

                    {saveErrorByBookId[book.id] ? (
                      <div className="mt-3 text-xs text-red-600">
                        {saveErrorByBookId[book.id]}
                      </div>
                    ) : null}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {bookLists.find((list) => list.book_id === book.id)
                          ? "Already in your library"
                          : "Not in your library"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToLibrary(book)}
                        className="px-3 py-2 rounded-lg bg-amber-900 text-white text-xs font-medium hover:bg-amber-950 transition-colors disabled:opacity-70"
                        disabled={isSavingByBookId[book.id]}
                      >
                        {isSavingByBookId[book.id] ? "Saving..." : "Save status"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

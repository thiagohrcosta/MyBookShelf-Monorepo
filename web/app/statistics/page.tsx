"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useAuth } from "../context/auth-context";
import {
  BookOpen,
  Calendar,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface BookInYear {
  id: number;
  title: string;
  author: string;
  publisher: string;
  month: number;
  year: number;
  box_cover_url?: string;
  pages: number;
}

interface MonthData {
  month: number;
  count: number;
}

interface YearData {
  year: number;
  count: number;
}

interface StatisticsData {
  books_per_year: YearData[];
  books_per_month: MonthData[];
  books_in_year: BookInYear[];
  total_books: number;
  total_pages: number;
  books_this_year: number;
  selected_year: number;
  available_years: number[];
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function StatisticsPage() {
  const router = useRouter();
  const { authRequest, isAuthenticated, isLoading } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const [data, setData] = useState<StatisticsData | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchStatistics() {
      if (!isAuthenticated) {
        setIsFetching(false);
        return;
      }

      try {
        const response = await authRequest<StatisticsData>({
          url: `${baseUrl}/api/v1/statistics?year=${selectedYear}`,
          method: "GET"
        });

        setData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching statistics:", error.message);
        }
        setError("Unable to load statistics.");
      } finally {
        setIsFetching(false);
      }
    }

    if (!isLoading && isAuthenticated) {
      setIsFetching(true);
      fetchStatistics();
    }
  }, [authRequest, baseUrl, isAuthenticated, isLoading, selectedYear]);

  const handleYearChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedYear((prev) => prev + 1);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="px-6 py-12">
          <div className="max-w-7xl mx-auto text-center text-gray-600">
            Loading statistics...
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="px-6 py-12">
          <div className="max-w-7xl mx-auto text-center text-red-600">
            {error || "No data available"}
          </div>
        </main>
      </div>
    );
  }

  const maxMonthCount = Math.max(...data.books_per_month.map((m) => m.count), 1);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-gray-800 mb-2">Reading Statistics</h1>
            <p className="text-gray-600">Track your reading journey over time</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <BookOpen className="w-6 h-6 text-amber-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Books Read</p>
                  <p className="text-3xl font-bold text-gray-800">{data.total_books}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Books This Year</p>
                  <p className="text-3xl font-bold text-gray-800">{data.books_this_year}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <FileText className="w-6 h-6 text-green-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pages</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {data.total_pages.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Year Selector */}
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-gray-800">Books Read in {selectedYear}</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleYearChange("prev")}
                  className="p-2 hover:bg-stone-50 rounded-lg transition-colors"
                  aria-label="Previous year"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <span className="text-lg font-semibold text-gray-800 min-w-[80px] text-center">
                  {selectedYear}
                </span>
                <button
                  onClick={() => handleYearChange("next")}
                  className="p-2 hover:bg-stone-50 rounded-lg transition-colors"
                  aria-label="Next year"
                  disabled={selectedYear >= new Date().getFullYear()}
                >
                  <ChevronRight
                    className={`w-5 h-5 ${
                      selectedYear >= new Date().getFullYear()
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Monthly Bar Chart */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Books per Month</h3>
              <div className="flex items-end justify-between gap-2 h-64">
                {data.books_per_month.map((monthData) => {
                  const heightPercent = maxMonthCount > 0
                    ? (monthData.count / maxMonthCount) * 100
                    : 0;

                  return (
                    <div key={monthData.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center justify-end h-full">
                        {monthData.count > 0 && (
                          <span className="text-xs font-semibold text-gray-700 mb-1">
                            {monthData.count}
                          </span>
                        )}
                        <div
                          className="w-full bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-lg transition-all hover:from-amber-800 hover:to-amber-600"
                          style={{ height: `${heightPercent}%`, minHeight: monthData.count > 0 ? "20px" : "0" }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {MONTH_NAMES[monthData.month - 1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Books Per Year Trend */}
          {data.books_per_year.length > 1 && (
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-amber-900" />
                <h2 className="text-2xl font-serif text-gray-800">Reading Trend</h2>
              </div>

              <div className="flex items-end justify-between gap-3 h-48">
                {data.books_per_year.map((yearData) => {
                  const maxYear = Math.max(...data.books_per_year.map((y) => y.count), 1);
                  const heightPercent = (yearData.count / maxYear) * 100;
                  const isSelected = yearData.year === selectedYear;

                  return (
                    <button
                      key={yearData.year}
                      onClick={() => setSelectedYear(yearData.year)}
                      className="flex-1 flex flex-col items-center gap-2 group"
                    >
                      <div className="w-full flex flex-col items-center justify-end h-full">
                        {yearData.count > 0 && (
                          <span className={`text-xs font-semibold mb-1 ${
                            isSelected ? "text-amber-900" : "text-gray-700"
                          }`}>
                            {yearData.count}
                          </span>
                        )}
                        <div
                          className={`w-full rounded-t-lg transition-all ${
                            isSelected
                              ? "bg-gradient-to-t from-amber-900 to-amber-700"
                              : "bg-gradient-to-t from-gray-400 to-gray-300 group-hover:from-amber-800 group-hover:to-amber-600"
                          }`}
                          style={{ height: `${heightPercent}%`, minHeight: yearData.count > 0 ? "20px" : "0" }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${
                        isSelected ? "text-amber-900" : "text-gray-600"
                      }`}>
                        {yearData.year}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Books List */}
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-serif text-gray-800 mb-6">
              Books Read in {selectedYear} ({data.books_in_year.length})
            </h2>

            {data.books_in_year.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No books read in {selectedYear} yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.books_in_year.map((book) => (
                  <div
                    key={`${book.id}-${book.month}`}
                    className="flex items-center gap-4 p-4 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => router.push(`/books/${book.id}`)}
                  >
                    <div className="w-16 h-24 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                      {book.box_cover_url ? (
                        <img
                          src={book.box_cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-stone-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{book.title}</h3>
                      <p className="text-sm text-gray-600 truncate">{book.author}</p>
                      <p className="text-xs text-gray-500">{book.pages} pages</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        {MONTH_NAMES_FULL[book.month - 1]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>      <Footer />    </div>
  );
}

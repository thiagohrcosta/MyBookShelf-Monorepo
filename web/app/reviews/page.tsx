import { Header } from "../components/header";
import { ReviewBookCard } from "../components/review-book-card";
import { Footer } from "../components/footer";

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

const baseUrl = process.env.API_BASE_URL || "http://backend:3000";

async function getBooksWithReviews(): Promise<BookReviewData[]> {
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/books_with_reviews`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch books with reviews:", error);
    return [];
  }
}

export default async function ReviewsPage() {
  const books = await getBooksWithReviews();

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero Section */}
      <section className="px-8 py-12 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Community Reviews
          </h1>
          <p className="text-lg text-gray-600">
            Discover what readers are saying about their favorite books
          </p>
        </div>
      </section>

      {/* Books Grid */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No books with reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {books.map((book) => (
                <ReviewBookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

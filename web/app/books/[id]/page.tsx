import { notFound } from "next/navigation";
import axios from "axios";
import { BookDetail } from "@/app/components/books/book-detail";
import { Footer } from "@/app/components/footer";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getBookDetails(id: string) {
  const baseUrl = "http://backend:3000";
  const url = `${baseUrl}/api/v1/books/${id}`;

  try {
    // Usar http://backend:3000 para SSR (dentro da rede Docker)
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `API responded with status ${error.response?.status} for URL: ${url}`
      );
      return null;
    }
    console.error("Error fetching book:", error);
    return null;
  }
}

export async function generateMetadata({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = await getBookDetails(id);

  if (!book) {
    return {
      title: "Book Not Found",
    };
  }

  return {
    title: `${book.title} by ${book.author.name} | My Bookshelf`,
    description: book.summary?.substring(0, 160),
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = await getBookDetails(id);

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <BookDetail book={book} bookId={id} />
      <Footer />
    </main>
  );
}

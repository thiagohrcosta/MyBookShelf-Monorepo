import { notFound } from "next/navigation";
import { BookDetail } from "@/app/components/books/book-detail";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getBookDetails(id: string) {
  try {
    // Usar http://backend:3000 para SSR (dentro da rede Docker)
    const baseUrl = "http://backend:3000";
    const url = `${baseUrl}/api/v1/books/${id}`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`API responded with status ${response.status} for URL: ${url}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
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
    </main>
  );
}

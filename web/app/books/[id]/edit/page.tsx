"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";

import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { useAuth } from "../../../context/auth-context";

interface Author {
  id: number;
  name: string;
  nationality?: string | null;
  biography?: string | null;
}

interface Publisher {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  original_title: string;
  summary: string;
  pages: number;
  edition: string;
  release_year: number;
  author: Author;
  publisher: Publisher;
  box_cover_url?: string | null;
}

interface EditBookFormValues {
  publisherQuery: string;
  authorQuery: string;
  authorNationality: string;
  authorBiography: string;
  title: string;
  original_title: string;
  summary: string;
  pages: string;
  edition: string;
  release_year: string;
  box_cover?: FileList;
}

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params?.id as string;
  const { authRequest, isAuthenticated, isLoading } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const [book, setBook] = useState<Book | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [isCreatingAuthor, setIsCreatingAuthor] = useState(false);
  const [isCreatingPublisher, setIsCreatingPublisher] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, getValues, setValue, watch, reset } = useForm<EditBookFormValues>({
    defaultValues: {
      publisherQuery: "",
      authorQuery: "",
      authorNationality: "",
      authorBiography: "",
      title: "",
      original_title: "",
      summary: "",
      pages: "",
      edition: "",
      release_year: "",
    },
  });

  const publisherQuery = watch("publisherQuery");
  const authorQuery = watch("authorQuery");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated || !bookId) {
        setIsFetching(false);
        return;
      }

      try {
        const [bookRes, authorsRes, publishersRes] = await Promise.all([
          authRequest<Book>({ url: `${baseUrl}/api/v1/books/${bookId}`, method: "GET" }),
          authRequest<Author[]>({ url: `${baseUrl}/api/v1/authors`, method: "GET" }),
          authRequest<Publisher[]>({ url: `${baseUrl}/api/v1/publishers`, method: "GET" }),
        ]);

        setBook(bookRes.data);
        setAuthors(authorsRes.data || []);
        setPublishers(publishersRes.data || []);

        // Set form values with book data
        reset({
          title: bookRes.data.title || "",
          original_title: bookRes.data.original_title || "",
          summary: bookRes.data.summary || "",
          pages: String(bookRes.data.pages || ""),
          edition: bookRes.data.edition || "",
          release_year: String(bookRes.data.release_year || ""),
          authorQuery: bookRes.data.author?.name || "",
          publisherQuery: bookRes.data.publisher?.name || "",
          authorNationality: "",
          authorBiography: "",
        });

        setSelectedAuthor(bookRes.data.author);
        setSelectedPublisher(bookRes.data.publisher);
        setImagePreview(bookRes.data.box_cover_url || null);
      } catch {
        setError("Unable to load book data.");
      } finally {
        setIsFetching(false);
      }
    }

    if (!isLoading) {
      fetchData();
    }
  }, [authRequest, baseUrl, isAuthenticated, isLoading, bookId, reset]);

  const filteredAuthors = useMemo(() => {
    if (!authorQuery.trim()) return authors;
    return authors.filter((author) =>
      author.name.toLowerCase().includes(authorQuery.toLowerCase())
    );
  }, [authors, authorQuery]);

  const filteredPublishers = useMemo(() => {
    if (!publisherQuery.trim()) return publishers;
    return publishers.filter((publisher) =>
      publisher.name.toLowerCase().includes(publisherQuery.toLowerCase())
    );
  }, [publishers, publisherQuery]);

  async function handleCreatePublisher() {
    const query = getValues("publisherQuery").trim();
    if (!query) return;
    setIsWorking(true);
    setError(null);

    try {
      const response = await authRequest<Publisher>({
        url: `${baseUrl}/api/v1/publishers`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: { publisher: { name: query } },
      });

      const created = response.data;
      setPublishers((prev) => [created, ...prev]);
      setSelectedPublisher(created);
      setValue("publisherQuery", created.name, { shouldDirty: true });
      setIsCreatingPublisher(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { errors?: Record<string, string[]> } | undefined;
        setError(data?.errors?.name?.[0] || "Unable to create the publisher.");
        return;
      }
      setError("Unable to create the publisher.");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleCreateAuthor() {
    const query = getValues("authorQuery").trim();
    if (!query) return;
    setIsWorking(true);
    setError(null);

    try {
      const response = await authRequest<Author>({
        url: `${baseUrl}/api/v1/authors`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          author: {
            name: query,
            nationality: getValues("authorNationality") || "",
            biography: getValues("authorBiography") || "",
          },
        },
      });

      const created = response.data;
      setAuthors((prev) => [created, ...prev]);
      setSelectedAuthor(created);
      setValue("authorQuery", created.name, { shouldDirty: true });
      setIsCreatingAuthor(false);
      setValue("authorNationality", "");
      setValue("authorBiography", "");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { errors?: Record<string, string[]> } | undefined;
        setError(data?.errors?.name?.[0] || "Unable to create the author.");
        return;
      }
      setError("Unable to create the author.");
    } finally {
      setIsWorking(false);
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedAuthor || !selectedPublisher) {
      setError("Select an author and a publisher.");
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("book[title]", values.title);
      formData.append("book[original_title]", values.original_title);
      formData.append("book[summary]", values.summary);
      formData.append("book[edition]", values.edition);
      formData.append("book[pages]", values.pages ? String(Number(values.pages)) : "0");
      formData.append("book[release_year]", values.release_year ? String(Number(values.release_year)) : "0");
      formData.append("book[author_id]", String(selectedAuthor.id));
      formData.append("book[publisher_id]", String(selectedPublisher.id));

      if (values.box_cover && values.box_cover.length > 0) {
        formData.append("book[box_cover]", values.box_cover[0]);
      }

      await authRequest({
        url: `${baseUrl}/api/v1/books/${bookId}`,
        method: "PATCH",
        data: formData,
      });

      router.push(`/books/${bookId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { errors?: Record<string, string[]> } | undefined;
        setError(data?.errors?.title?.[0] || "Unable to update the book.");
        return;
      }
      setError("Unable to update the book.");
    } finally {
      setIsWorking(false);
    }
  });

  if (isFetching) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="px-6 py-12">
          <div className="max-w-5xl mx-auto text-center text-gray-600">
            Loading book...
          </div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="px-6 py-12">
          <div className="max-w-5xl mx-auto text-center text-red-600">
            Book not found
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-gray-800">Edit book</h1>
            <p className="text-gray-600 mt-2">
              Update book details, cover image, author or publisher.
            </p>
          </div>

          <form className="space-y-8" onSubmit={onSubmit}>
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <section className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Publisher</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="publisher">
                    Search publisher
                  </label>
                  <input
                    id="publisher"
                    name="publisher"
                    {...register("publisherQuery", {
                      onChange: () => {
                        setSelectedPublisher(null);
                        setIsCreatingPublisher(false);
                      },
                    })}
                    placeholder="Type the publisher name"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  />
                </div>

                {filteredPublishers.length > 0 ? (
                  <div className="max-h-52 overflow-auto rounded-lg border border-stone-200">
                    {filteredPublishers.map((publisher) => (
                      <button
                        type="button"
                        key={publisher.id}
                        onClick={() => {
                          setSelectedPublisher(publisher);
                          setValue("publisherQuery", publisher.name, { shouldDirty: true });
                          setIsCreatingPublisher(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-stone-50 ${
                          selectedPublisher?.id === publisher.id
                            ? "bg-amber-50 text-amber-900"
                            : "text-gray-700"
                        }`}
                      >
                        {publisher.name}
                      </button>
                    ))}
                  </div>
                ) : null}

                {!selectedPublisher && publisherQuery.trim() ? (
                  <button
                    type="button"
                    className="text-sm text-amber-900 hover:text-amber-950"
                    onClick={() => setIsCreatingPublisher(true)}
                  >
                    Create publisher "{publisherQuery.trim()}"
                  </button>
                ) : null}

                {isCreatingPublisher ? (
                  <div className="rounded-lg border border-stone-200 p-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Confirm to create the publisher.
                    </p>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-amber-900 text-white text-sm font-medium hover:bg-amber-950 disabled:opacity-70"
                      onClick={handleCreatePublisher}
                      disabled={isWorking}
                    >
                      {isWorking ? "Creating..." : "Create publisher"}
                    </button>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Author</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="author">
                    Search author
                  </label>
                  <input
                    id="author"
                    name="author"
                    {...register("authorQuery", {
                      onChange: () => {
                        setSelectedAuthor(null);
                        setIsCreatingAuthor(false);
                      },
                    })}
                    placeholder="Type the author name"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  />
                </div>

                {filteredAuthors.length > 0 ? (
                  <div className="max-h-52 overflow-auto rounded-lg border border-stone-200">
                    {filteredAuthors.map((author) => (
                      <button
                        type="button"
                        key={author.id}
                        onClick={() => {
                          setSelectedAuthor(author);
                          setValue("authorQuery", author.name, { shouldDirty: true });
                          setIsCreatingAuthor(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-stone-50 ${
                          selectedAuthor?.id === author.id
                            ? "bg-amber-50 text-amber-900"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="font-medium">{author.name}</div>
                        {author.nationality ? (
                          <div className="text-xs text-gray-500">{author.nationality}</div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}

                {!selectedAuthor && authorQuery.trim() ? (
                  <button
                    type="button"
                    className="text-sm text-amber-900 hover:text-amber-950"
                    onClick={() => setIsCreatingAuthor(true)}
                  >
                    Create author "{authorQuery.trim()}"
                  </button>
                ) : null}

                {isCreatingAuthor ? (
                  <div className="rounded-lg border border-stone-200 p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality
                      </label>
                      <input
                        {...register("authorNationality")}
                        placeholder="e.g. Brazilian"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Biography
                      </label>
                      <textarea
                        {...register("authorBiography")}
                        rows={3}
                        placeholder="Short biography"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-amber-900 text-white text-sm font-medium hover:bg-amber-950 disabled:opacity-70"
                      onClick={handleCreateAuthor}
                      disabled={isWorking}
                    >
                      {isWorking ? "Creating..." : "Create author"}
                    </button>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Book details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        {...register("box_cover", {
                          onChange: (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          },
                        })}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                      />
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB. Leave empty to keep current image.</p>
                    </div>
                    {imagePreview && (
                      <div className="w-24 h-32 border border-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    {...register("title")}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original title
                  </label>
                  <input
                    {...register("original_title")}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edition</label>
                  <input
                    {...register("edition")}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    {...register("release_year")}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
                  <input
                    type="number"
                    {...register("pages")}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                  <textarea
                    rows={4}
                    {...register("summary")}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Author: {selectedAuthor?.name ?? "not selected"} · Publisher:{" "}
                  {selectedPublisher?.name ?? "not selected"}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/books/${bookId}`)}
                    className="px-6 py-3 rounded-lg border border-stone-200 text-gray-700 font-medium hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-amber-900 text-white font-medium hover:bg-amber-950 disabled:opacity-70"
                    disabled={isWorking}
                  >
                    {isWorking ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

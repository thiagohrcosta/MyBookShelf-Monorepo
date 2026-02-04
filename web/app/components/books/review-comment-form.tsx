"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/auth-context";

interface ReviewCommentFormProps {
  reviewId: number;
  parentId?: number | null;
  onCreated: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export function ReviewCommentForm({
  reviewId,
  parentId = null,
  onCreated,
  onCancel,
  autoFocus = false,
  placeholder = "Add a comment...",
}: ReviewCommentFormProps) {
  const { authRequest, isAuthenticated } = useAuth();
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError("Sign in to comment.");
      return;
    }

    if (!body.trim()) {
      setError("Write a comment before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authRequest({
        url: `${baseUrl}/api/v1/book_reviews/${reviewId}/comments`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          book_review_comment: {
            body: body.trim(),
            parent_id: parentId,
          },
        },
      });

      setBody("");
      onCreated();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { errors?: Record<string, string[]> } | undefined;
        const message =
          data?.errors?.body?.[0] ||
          data?.errors?.parent_id?.[0] ||
          "Unable to submit comment.";
        setError(message);
      } else {
        setError("Unable to submit comment.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/20"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-amber-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-950 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Comment"}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-stone-200 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-stone-50"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

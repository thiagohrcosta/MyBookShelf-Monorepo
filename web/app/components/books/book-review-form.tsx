"use client";

import { useState, useEffect, type FormEvent } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/auth-context";
import { subscriptionService } from "@/app/services/subscription";

interface BookReviewFormProps {
  bookId: string;
  onReviewCreated: () => void;
}

const ratingOptions = Array.from({ length: 11 }, (_, index) => index);

export function BookReviewForm({ bookId, onReviewCreated }: BookReviewFormProps) {
  const { authRequest, isAuthenticated, token } = useAuth();
  const [rating, setRating] = useState<string>("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    async function checkSubscription() {
      if (!isAuthenticated || !token) {
        setIsCheckingSubscription(false);
        return;
      }

      try {
        const status = await subscriptionService.getSubscriptionStatus(token);
        setHasActiveSubscription(status.has_active_subscription);
      } catch (err) {
        console.error("Failed to check subscription status", err);
        setHasActiveSubscription(false);
      } finally {
        setIsCheckingSubscription(false);
      }
    }

    checkSubscription();
  }, [isAuthenticated, token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isAuthenticated) {
      setError("Sign in to submit a review.");
      return;
    }

    if (!hasActiveSubscription) {
      setError("You need an active subscription to submit reviews. Visit your profile to subscribe.");
      return;
    }

    if (!rating) {
      setError("Select a rating before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authRequest({
        url: `${baseUrl}/api/v1/book_reviews`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          book_review: {
            book_id: Number(bookId),
            rating: Number(rating),
            review: review.trim() || "No comment."
          }
        }
      });

      const data = response.data;

      setRating("");
      setReview("");
      setSuccess("Your review has been submitted.");
      onReviewCreated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { errors?: Record<string, string[]> } | undefined;
        const message =
          data?.errors?.review?.[0] ||
          data?.errors?.rating?.[0] ||
          data?.errors?.book_id?.[0] ||
          "Unable to submit your review.";
        setError(message);
        return;
      }
      setError("Unable to submit your review.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-xl border border-stone-200 bg-white p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Your review</h3>
        <span className="text-xs text-gray-500">Rating scale 0-10</span>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          {success}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Rating
          <select
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
          >
            <option value="">Select</option>
            {ratingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Comment (optional)
          <textarea
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="Share your thoughts about this book."
            rows={4}
            className="resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !hasActiveSubscription || isCheckingSubscription}
        className="w-full rounded-lg bg-amber-900 py-2 text-sm font-medium text-white hover:bg-amber-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        title={!hasActiveSubscription && !isCheckingSubscription ? "Active subscription required" : ""}
      >
        {isCheckingSubscription
          ? "Checking subscription..."
          : isSubmitting
          ? "Submitting..."
          : !hasActiveSubscription
          ? "Subscription Required"
          : "Submit review"}
      </button>

      {!hasActiveSubscription && !isCheckingSubscription && isAuthenticated && (
        <p className="text-xs text-amber-700 text-center mt-2">
          You need an active subscription to create reviews.{" "}
          <a href="/profile" className="underline font-medium hover:text-amber-900">
            Subscribe now
          </a>
        </p>
      )}
    </form>
  );
}

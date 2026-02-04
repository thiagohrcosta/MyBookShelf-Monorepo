"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/auth-context";
import { ReviewCommentForm } from "./review-comment-form";
import { ReviewCommentItem } from "./review-comment-item";

export interface ReviewComment {
  id: number;
  body: string;
  user_id: number;
  user_name: string;
  user_email: string;
  book_review_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  likes_count: number;
  liked_by_current_user: boolean;
  replies: ReviewComment[];
}

interface ReviewCommentsProps {
  reviewId: number;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export function ReviewComments({ reviewId }: ReviewCommentsProps) {
  const { authRequest, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadComments() {
      try {
        setLoading(true);
        setError(null);

        const request = isAuthenticated
          ? authRequest<ReviewComment[]>({
              url: `${baseUrl}/api/v1/book_reviews/${reviewId}/comments`,
              method: "GET",
            })
          : axios.get<ReviewComment[]>(`${baseUrl}/api/v1/book_reviews/${reviewId}/comments`);

        const response = await request;
        if (!isActive) return;
        setComments(response.data || []);
      } catch {
        if (!isActive) return;
        setError("Unable to load comments.");
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    }

    loadComments();

    return () => {
      isActive = false;
    };
  }, [authRequest, isAuthenticated, reviewId, reloadKey]);

  function handleRefresh() {
    setReloadKey((prev) => prev + 1);
  }

  return (
    <div className="mt-4 rounded-lg border border-stone-200 bg-white p-3">
      <h4 className="text-sm font-semibold text-gray-800">Comments</h4>

      <div className="mt-3">
        {isAuthenticated ? (
          <ReviewCommentForm reviewId={reviewId} onCreated={handleRefresh} />
        ) : (
          <p className="text-xs text-gray-500">Sign in to add a comment.</p>
        )}
      </div>

      {loading ? (
        <p className="mt-3 text-xs text-gray-500">Loading comments...</p>
      ) : error ? (
        <p className="mt-3 text-xs text-gray-500">{error}</p>
      ) : comments.length === 0 ? (
        <p className="mt-3 text-xs text-gray-500">No comments yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {comments.map((comment) => (
            <ReviewCommentItem
              key={comment.id}
              comment={comment}
              reviewId={reviewId}
              onRefresh={handleRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}

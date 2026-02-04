"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";
import { ReviewCommentForm } from "./review-comment-form";
import type { ReviewComment } from "./review-comments";

interface ReviewCommentItemProps {
  comment: ReviewComment;
  reviewId: number;
  depth?: number;
  onRefresh: () => void;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

function formatCommentDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ReviewCommentItem({ comment, reviewId, depth = 0, onRefresh }: ReviewCommentItemProps) {
  const { authRequest, isAuthenticated, user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(comment.liked_by_current_user);
  const [likesCount, setLikesCount] = useState(comment.likes_count);

  useEffect(() => {
    setLiked(comment.liked_by_current_user);
    setLikesCount(comment.likes_count);
  }, [comment.liked_by_current_user, comment.likes_count]);

  async function handleLikeToggle() {
    setLikeError(null);

    if (!isAuthenticated) {
      setLikeError("Sign in to like comments.");
      return;
    }

    const previousLiked = liked;
    const previousCount = likesCount;
    const nextLiked = !previousLiked;
    const nextCount = previousLiked ? Math.max(0, previousCount - 1) : previousCount + 1;

    setLiked(nextLiked);
    setLikesCount(nextCount);
    let hasError = false;
    setIsLiking(true);

    try {
      const method = previousLiked ? "DELETE" : "POST";
      const response = await authRequest({
        url: `${baseUrl}/api/v1/book_review_comments/${comment.id}/like`,
        method,
      });
      const data = response.data as { likes_count?: number; liked_by_current_user?: boolean };
      if (typeof data.likes_count === "number") {
        setLikesCount(data.likes_count);
      }
      if (typeof data.liked_by_current_user === "boolean") {
        setLiked(data.liked_by_current_user);
      } else {
        setLiked(!liked);
      }
    } catch (err) {
      hasError = true;
      if (axios.isAxiosError(err)) {
        setLikeError(err.response?.data?.error || "Unable to update like.");
      } else {
        setLikeError("Unable to update like.");
      }
    } finally {
      if (hasError) {
        setLiked(previousLiked);
        setLikesCount(previousCount);
      }
      setIsLiking(false);
    }
  }

  const authorLabel = comment.user_name || "Anonymous";
  const isOwnComment = Boolean(user?.id && user.id === comment.user_id);
  const avatar = authorLabel.substring(0, 1).toUpperCase();

  return (
    <div className={`flex gap-3 ${depth > 0 ? "pl-6 border-l border-stone-200" : ""}`}>
      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
        {avatar}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{authorLabel}</p>
          {isOwnComment ? (
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-500">
              You
            </span>
          ) : null}
          <span className="text-xs text-gray-500">{formatCommentDate(comment.created_at)}</span>
        </div>

        <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{comment.body}</p>

        {likeError ? (
          <div className="mt-2 text-xs text-red-600">{likeError}</div>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <button
            type="button"
            onClick={handleLikeToggle}
            disabled={isLiking}
            className={`flex items-center gap-1 transition-colors ${
              liked ? "text-red-600" : "hover:text-red-600"
            }`}
            title={isOwnComment ? "You cannot like your own comment" : ""}
          >
            <Heart size={14} className={liked ? "fill-red-500" : ""} />
            <span>{likesCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReply((prev) => !prev)}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <MessageCircle size={14} />
            <span>{showReply ? "Cancel" : "Reply"}</span>
          </button>
        </div>

        {showReply ? (
          <div className="mt-3">
            <ReviewCommentForm
              reviewId={reviewId}
              parentId={comment.id}
              onCreated={() => {
                setShowReply(false);
                onRefresh();
              }}
              onCancel={() => setShowReply(false)}
              autoFocus
              placeholder="Write a reply..."
            />
          </div>
        ) : null}

        {comment.replies?.length ? (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <ReviewCommentItem
                key={reply.id}
                comment={reply}
                reviewId={reviewId}
                depth={depth + 1}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

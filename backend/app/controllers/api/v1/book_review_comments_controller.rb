module Api
  module V1
    class BookReviewCommentsController < ApplicationController
      before_action :set_optional_user, only: :index
      before_action :authenticate_user!, only: %i[create destroy like unlike]
      before_action :set_book_review, only: %i[index create]
      before_action :set_comment, only: %i[destroy like unlike]

      def index
        comments = @book_review.book_review_comments
                               .includes(:user, :book_review_comment_likes,
                                         replies: %i[user book_review_comment_likes])
                               .where(parent_id: nil)
                               .order(created_at: :asc)

        render json: comments.map { |comment| format_comment(comment) }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Review not found" }, status: :not_found
      end

      def create
        comment = @book_review.book_review_comments.new(comment_params)
        comment.user = current_user

        if comment.save
          render json: format_comment(comment), status: :created
        else
          render json: { errors: comment.errors }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Review not found" }, status: :not_found
      end

      def destroy
        unless comment_owner?
          return render json: { error: "Forbidden" }, status: :forbidden
        end

        @comment.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Comment not found" }, status: :not_found
      end

      def like
        if @comment.user_id == current_user&.id
          return render json: { error: "Cannot like your own comment" }, status: :forbidden
        end

        @comment.book_review_comment_likes.find_or_create_by!(user: current_user)
        render json: like_payload(@comment), status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Comment not found" }, status: :not_found
      rescue ActiveRecord::RecordInvalid
        render json: { error: "Unable to like comment" }, status: :unprocessable_entity
      end

      def unlike
        like = @comment.book_review_comment_likes.find_by(user: current_user)
        like&.destroy
        render json: like_payload(@comment), status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Comment not found" }, status: :not_found
      end

      private

      def set_book_review
        @book_review = BookReview.find(params[:book_review_id])
      end

      def set_comment
        @comment = BookReviewComment.find(params[:id])
      end

      def comment_params
        params.require(:book_review_comment).permit(:body, :parent_id)
      end

      def set_optional_user
        token = bearer_token
        return if token.blank?

        decoded_token = JsonWebToken.decode(token)
        @current_user = User.find_by(id: decoded_token[:user_id])
      rescue JWT::DecodeError, JWT::ExpiredSignature
        @current_user = nil
      end

      def format_comment(comment)
        liked = current_user.present? &&
          comment.book_review_comment_likes.exists?(user_id: current_user.id)

        {
          id: comment.id,
          body: comment.body,
          user_id: comment.user_id,
          user_name: comment.user&.full_name || "Anonymous",
          user_email: comment.user&.email,
          book_review_id: comment.book_review_id,
          parent_id: comment.parent_id,
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          likes_count: comment.book_review_comment_likes.count,
          liked_by_current_user: liked,
          replies: comment.replies.sort_by(&:created_at).map { |reply| format_comment(reply) }
        }
      end

      def like_payload(comment)
        comment.reload
        liked = current_user.present? &&
          comment.book_review_comment_likes.exists?(user_id: current_user.id)

        {
          id: comment.id,
          likes_count: comment.book_review_comment_likes.count,
          liked_by_current_user: liked
        }
      end

      def comment_owner?
        current_user&.admin? || @comment.user_id == current_user&.id
      end
    end
  end
end

module Api
  module V1
    class BookReviewsController < ApplicationController
      before_action :authenticate_user!, only: %i[create destroy]
      before_action :check_active_subscription!, only: %i[create]

      def index
        if params[:book_id]
          @book = Book.find(params[:book_id])
          @book_reviews = @book.book_reviews.includes(:user)
        else
          @book_reviews = BookReview.all.includes(:user)
        end
        render json: @book_reviews.map { |review| format_review(review) }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Book not found" }, status: :not_found
      end

      def create
        @book_review = current_user.book_reviews.new(review_params)
        if @book_review.save
          render json: format_review(@book_review), status: :created
        else
          render json: { errors: @book_review.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @book_review = current_user.book_reviews.find(params[:id])
        @book_review.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Review not found" }, status: :not_found
      end

      def recent
        limit = params[:limit]&.to_i || 10
        @book_reviews = BookReview.includes(:user, :book).order(created_at: :desc).limit(limit)
        render json: @book_reviews.map { |review| format_review_with_book(review) }, status: :ok
      end

      private

      def check_active_subscription!
        unless current_user.active_subscription?
          render json: {
            error: "Active subscription required",
            message: "You need an active subscription to create reviews"
          }, status: :forbidden
        end
      end

      def review_params
        params.require(:book_review).permit(:rating, :review, :book_id)
      end

      def format_review(review)
        {
          id: review.id,
          rating: review.rating,
          review: review.review,
          user_id: review.user_id,
          user_name: review.user&.full_name || "Anonymous",
          user_email: review.user&.email,
          book_id: review.book_id,
          created_at: review.created_at,
          updated_at: review.updated_at
        }
      end

      def format_review_with_book(review)
        format_review(review).merge(
          book: {
            id: review.book&.id,
            title: review.book&.title,
            author: review.book&.author&.name
          }
        )
      end
    end
  end
end

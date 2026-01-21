module Api
  module V1
    class BookReviewsController < ApplicationController
      def index
        if params[:book_id]
          @book = Book.find(params[:book_id])
          @book_reviews = @book.book_reviews
        else
          @book_reviews = BookReview.all
        end
        render json: @book_reviews, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Book not found' }, status: :not_found
      end

      def create
        @book_review = BookReview.new(review_params)
        if @book_review.save
          render json: @book_review, status: :created
        else
          render json: { errors: @book_review.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @book_review = BookReview.find(params[:id])
        @book_review.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Review not found' }, status: :not_found
      end

      private

      def review_params
        params.require(:book_review).permit(:rating, :review, :user_id, :book_id)
      end
    end
  end
end

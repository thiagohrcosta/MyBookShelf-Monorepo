module Api
  module V1
    class DashboardController < ApplicationController
      before_action :authenticate_user!

      def index
        render json: {
          reading_statistics: reading_stats(current_user),
          last_10_books_read: last_books_read(current_user),
          last_reviews: last_reviews(current_user),
          latest_global_books: latest_books
        }, status: :ok
      end

      private

      def reading_stats(user)
        {
          total_read: user.read_books.count,
          this_month: user.read_books.where("month = ?", Date.today.month).count,
          this_year: user.read_books.where("year = ?", Date.today.year).count
        }
      end

      def last_books_read(user)
        user.read_books.last(10)
      end

      def last_reviews(user)
        user.book_reviews.last(5)
      end

      def latest_books
        Book.order(created_at: :desc).limit(10)
      end
    end
  end
end

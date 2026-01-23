module Api
  module V1
    class HomeController < ApplicationController
      def index
        render json: {
          latest_books: latest_books,
          latest_publishers: latest_publishers,
          latest_reviews: latest_reviews,
          api_version: "v1"
        }, status: :ok
      end

      private

      def latest_books
        Book.order(created_at: :desc).limit(10)
      end

      def latest_publishers
        Publisher.order(created_at: :desc).limit(5)
      end

      def latest_reviews
        BookReview.order(created_at: :desc).limit(10)
      end
    end
  end
end

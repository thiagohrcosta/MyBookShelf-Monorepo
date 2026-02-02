module Api
  module V1
    class BooksWithReviewsController < ApplicationController
      def index
        @books = Book.select('books.id, books.title, books.summary, books.user_id, authors.id as author_id, authors.name as author_name, publishers.id as publisher_id, publishers.name as publisher_name, COUNT(book_reviews.id) as review_count, AVG(book_reviews.rating) as avg_rating')
                     .joins(:author, :publisher, :book_reviews)
                     .group('books.id', 'authors.id', 'publishers.id')
                     .order('review_count DESC')

        books_with_data = @books.map do |book|
          cover_url = book.box_cover.attached? ? book.box_cover.url : nil
          reviews = BookReview.where(book_id: book.id).limit(3).includes(:user)
          reviewers = reviews.map do |r|
            { name: r.user.full_name, initials: r.user.full_name.split.map(&:first).join }
          end

          {
            id: book.id,
            title: book.title,
            description: book.summary,
            box_cover_url: cover_url,
            author: {
              id: book.author_id,
              name: book.author_name
            },
            publisher: {
              id: book.publisher_id,
              name: book.publisher_name
            },
            review_count: book.review_count.to_i,
            avg_rating: (book.avg_rating&.round(1) || 0).to_f,
            reviewers: reviewers
          }
        end

        render json: books_with_data, status: :ok
      end
    end
  end
end

module Api
  module V1
    class StatisticsController < ApplicationController
      before_action :authenticate_user!

      def index
        year = params[:year]&.to_i || Date.current.year

        # Books read per year
        books_per_year = current_user.read_books
          .select("year, COUNT(DISTINCT book_id) as count")
          .group(:year)
          .order(:year)
          .map { |rb| { year: rb.year, count: rb.count } }

        # Books read per month for selected year
        books_per_month = current_user.read_books
          .where(year: year)
          .select("month, COUNT(DISTINCT book_id) as count")
          .group(:month)
          .order(:month)
          .map { |rb| { month: rb.month, count: rb.count } }

        # Fill missing months with zero
        months_data = (1..12).map do |month|
          data = books_per_month.find { |b| b[:month] == month }
          { month: month, count: data ? data[:count] : 0 }
        end

        # Books read in selected year with details
        books_in_year = current_user.read_books
          .where(year: year)
          .includes(book: [ :author, :publisher ])
          .order(month: :desc)
          .map do |read_book|
            book = read_book.book
            cover_url = book.box_cover.attached? ? book.box_cover.url : nil
            {
              id: book.id,
              title: book.title,
              author: book.author.name,
              publisher: book.publisher.name,
              month: read_book.month,
              year: read_book.year,
              box_cover_url: cover_url,
              pages: book.pages
            }
          end

        # Total statistics
        total_books = current_user.read_books.select(:book_id).distinct.count
        total_pages_result = current_user.read_books
          .joins(:book)
          .sum("books.pages")

        books_this_year = current_user.read_books.where(year: year).select(:book_id).distinct.count

        # Available years
        available_years = current_user.read_books
          .select(:year)
          .distinct
          .order(year: :desc)
          .pluck(:year)

        render json: {
          books_per_year: books_per_year,
          books_per_month: months_data,
          books_in_year: books_in_year,
          total_books: total_books,
          total_pages: total_pages_result || 0,
          books_this_year: books_this_year,
          selected_year: year,
          available_years: available_years
        }, status: :ok
      end
    end
  end
end

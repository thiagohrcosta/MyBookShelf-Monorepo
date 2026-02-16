module Api
  module V1
    class BooksController < ApplicationController
      before_action :authenticate_user!, except: %i[index show]
      before_action :authorize_admin!, only: :destroy
      before_action :set_book, only: %i[show update destroy]

      def index
        books = fetch_books_with_cache
        render json: books
      end

      def show
        book_data = fetch_book_cache(@book)
        render json: book_data, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Book not found" }, status: :not_found
      end

      def create
        @book = current_user.books.new(book_params)
        if @book.save
          invalidate_books_cache
          book_data = serialize_book(@book)
          render json: book_data, status: :created
        else
          render json: { errors: @book.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @book.update(book_params)
          invalidate_book_cache(@book)
          invalidate_books_cache
          book_data = serialize_book(@book)
          render json: book_data, status: :ok
        else
          render json: { errors: @book.errors }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Book not found" }, status: :not_found
      end

      def destroy
        @book.destroy
        invalidate_book_cache(@book)
        invalidate_books_cache
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Book not found" }, status: :not_found
      end

      private

      def set_book
        @book = Book.includes(:author, :publisher).find(params[:id])
      end

      def fetch_books_with_cache
        cache_key = "books/all/#{Book.maximum(:updated_at)&.to_i}/#{Book.count}"
        Rails.cache.fetch(cache_key, expires_in: 24.hours) do
          books = Book.includes(:author, :publisher, box_cover_attachment: :blob)
          books.map { |book| serialize_book(book) }
        end
      end

      def fetch_book_cache(book)
        Rails.cache.fetch(book_cache_key(book), expires_in: 24.hours) do
          serialize_book(book)
        end
      end

      def serialize_book(book)
        cover_url = book.box_cover.attached? ? book.box_cover.url : nil

        book.as_json(
          include: {
            author: { only: [:id, :name] },
            publisher: { only: [:id, :name] }
          }
        ).merge(box_cover_url: cover_url)
      end

      def book_cache_key(book)
        ["book", book.id, book.cache_key_with_version]
      end

      def invalidate_book_cache(book)
        Rails.cache.delete(book_cache_key(book))
      end

      def invalidate_books_cache
        cache_key = "books/all/*"
        # Rails.cache.delete_matched é mais eficiente para padrões
        Rails.cache.delete_matched(/^books\/all\//)
      end

      def book_params
        params.require(:book).permit(:title, :original_title, :summary, :pages, :edition, :language_version, :release_year, :author_id, :publisher_id, :box_cover)
      end
    end
  end
end

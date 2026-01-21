module Api
  module V1
    class BooksController < ApplicationController
      def index
        @books = Book.all
        render json: @books, status: :ok
      end

      def show
        @book = Book.find(params[:id])
        render json: @book, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Book not found' }, status: :not_found
      end

      def create
        @book = Book.new(book_params)
        if @book.save
          render json: @book, status: :created
        else
          render json: { errors: @book.errors }, status: :unprocessable_entity
        end
      end

      def update
        @book = Book.find(params[:id])
        if @book.update(book_params)
          render json: @book, status: :ok
        else
          render json: { errors: @book.errors }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Book not found' }, status: :not_found
      end

      def destroy
        @book = Book.find(params[:id])
        @book.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Book not found' }, status: :not_found
      end

      private

      def book_params
        params.require(:book).permit(:title, :original_title, :summary, :pages, :edition, :language_version, :release_year, :author_id, :publisher_id)
      end
    end
  end
end

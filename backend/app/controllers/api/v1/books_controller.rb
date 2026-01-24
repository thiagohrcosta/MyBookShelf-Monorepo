module Api
  module V1
    class BooksController < ApplicationController
      before_action :authenticate_user!, except: %i[index show]
      before_action :authorize_admin!, only: :destroy
      def index
        @books = Book.includes(:author, :publisher).all
        books_with_cover = @books.map do |book|
          cover_url = book.box_cover.attached? ? book.box_cover.url : nil
          book.as_json(include: { author: { only: [:id, :name] }, publisher: { only: [:id, :name] } }).merge(
            box_cover_url: cover_url
          )
        end
        render json: books_with_cover, status: :ok
      end

      def show
        @book = Book.includes(:author, :publisher).find(params[:id])
        cover_url = @book.box_cover.attached? ? @book.box_cover.url : nil
        book_with_cover = @book.as_json(include: { author: { only: [:id, :name] }, publisher: { only: [:id, :name] } }).merge(
          box_cover_url: cover_url
        )
        render json: book_with_cover, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Book not found" }, status: :not_found
      end

      def create
        @book = current_user.books.new(book_params)
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
        render json: { error: "Book not found" }, status: :not_found
      end

      def destroy
        @book = Book.find(params[:id])
        @book.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Book not found" }, status: :not_found
      end

      private

      def book_params
        params.require(:book).permit(:title, :original_title, :summary, :pages, :edition, :language_version, :release_year, :author_id, :publisher_id, :box_cover)
      end
    end
  end
end

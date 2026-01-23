module Api
  module V1
    class ReadBooksController < ApplicationController
      before_action :authenticate_user!

      def index
        @read_books = current_user.read_books
        render json: @read_books, status: :ok
      end

      def create
        @read_book = current_user.read_books.new(read_book_params)
        if @read_book.save
          render json: @read_book, status: :created
        else
          render json: { errors: @read_book.errors }, status: :unprocessable_entity
        end
      end

      private

      def read_book_params
        params.require(:read_book).permit(:book_id, :month, :year)
      end
    end
  end
end

module Api
  module V1
    class ReadBooksController < ApplicationController
      def index
        @read_books = ReadBook.all
        render json: @read_books, status: :ok
      end

      def create
        @read_book = ReadBook.new(read_book_params)
        if @read_book.save
          render json: @read_book, status: :created
        else
          render json: { errors: @read_book.errors }, status: :unprocessable_entity
        end
      end

      private

      def read_book_params
        params.require(:read_book).permit(:user_id, :book_id, :month, :year)
      end
    end
  end
end

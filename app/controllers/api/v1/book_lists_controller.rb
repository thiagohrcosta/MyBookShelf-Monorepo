module Api
  module V1
    class BookListsController < ApplicationController
      def index
        @book_lists = BookList.all
        render json: @book_lists, status: :ok
      end

      def create
        @book_list = BookList.new(book_list_params)
        if @book_list.save
          render json: @book_list, status: :created
        else
          render json: { errors: @book_list.errors }, status: :unprocessable_entity
        end
      end

      def update
        @book_list = BookList.find(params[:id])
        if @book_list.update(book_list_params)
          render json: @book_list, status: :ok
        else
          render json: { errors: @book_list.errors }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Book list not found' }, status: :not_found
      end

      def destroy
        @book_list = BookList.find(params[:id])
        @book_list.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Book list not found' }, status: :not_found
      end

      private

      def book_list_params
        params.require(:book_list).permit(:user_id, :book_id, :status)
      end
    end
  end
end

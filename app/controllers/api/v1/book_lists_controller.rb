module Api
  module V1
    class BookListsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_book_list, only: %i[update destroy]

      def index
        @book_lists = current_user.book_lists
        render json: @book_lists, status: :ok
      end

      def create
        @book_list = current_user.book_lists.new(book_list_params)
        if @book_list.save
          render json: @book_list, status: :created
        else
          render json: { errors: @book_list.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @book_list.update(book_list_params)
          render json: @book_list, status: :ok
        else
          render json: { errors: @book_list.errors }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Book list not found" }, status: :not_found
      end

      def destroy
        @book_list.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Book list not found" }, status: :not_found
      end

      private

      def set_book_list
        @book_list = current_user.book_lists.find(params[:id])
      end

      def book_list_params
        params.require(:book_list).permit(:book_id, :status)
      end
    end
  end
end

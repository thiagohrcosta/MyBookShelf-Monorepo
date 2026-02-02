module Api
  module V1
    class BookListsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_book_list, only: %i[update destroy]
      before_action :validate_read_book_params, only: %i[create update]

      def index
        @book_lists = current_user.book_lists
        render json: @book_lists, status: :ok
      end

      def show_by_book
        @book_list = current_user.book_lists.find_by(book_id: params[:book_id])
        if @book_list
          render_book_list(@book_list, status: :ok)
        else
          render json: { book_list: nil }, status: :ok
        end
      end

      def create
        @book_list = current_user.book_lists.find_or_initialize_by(book_id: book_list_params[:book_id])
        @book_list.assign_attributes(book_list_params)

        if @book_list.save
          create_read_book_if_finished(@book_list)
          status = @book_list.saved_change_to_id? ? :created : :ok
          render_book_list(@book_list, status: status)
        else
          render json: { errors: @book_list.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @book_list.update(book_list_params)
          create_read_book_if_finished(@book_list)
          render_book_list(@book_list, status: :ok)
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

      def create_read_book_if_finished(book_list)
        return unless book_list.status == "finished"

        month = params.dig(:book_list, :read_month)
        year = params.dig(:book_list, :read_year)

        return unless month.present? && year.present?

        current_user.read_books.find_or_create_by(
          book_id: book_list.book_id,
          month: month.to_i,
          year: year.to_i
        )
      end

      def render_book_list(book_list, status: :ok)
        read_book = current_user.read_books
          .where(book_id: book_list.book_id)
          .order(year: :desc, month: :desc)
          .first

        render json: book_list.as_json.merge(
          read_month: read_book&.month,
          read_year: read_book&.year
        ), status: status
      end

      def validate_read_book_params
        return unless book_list_params[:status] == "finished"

        month = params.dig(:book_list, :read_month)
        year = params.dig(:book_list, :read_year)

        return if month.present? && year.present?

        render json: {
          errors: {
            read_month: [ "can't be blank" ],
            read_year: [ "can't be blank" ]
          }
        }, status: :unprocessable_entity
      end

      def book_list_params
        params.require(:book_list).permit(:book_id, :status)
      end
    end
  end
end

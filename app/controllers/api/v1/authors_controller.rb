module Api
  module V1
    class AuthorsController < ApplicationController
      def index
        authors = Author.all
        render json: authors.map { |author| author_payload(author) }, status: :ok
      end

      def show
        author = Author.find(params[:id])
        render json: author_payload(author), status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Author not found' }, status: :not_found
      end

      def create
        @author = Author.new(author_params)
        if @author.save
          render json: @author, status: :created
        else
          render json: { errors: @author.errors }, status: :unprocessable_entity
        end
      end

      def update
        @author = Author.find(params[:id])
        if @author.update(author_params)
          render json: @author, status: :ok
        else
          render json: { errors: @author.errors }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Author not found' }, status: :not_found
      end

      def destroy
        @author = Author.find(params[:id])
        @author.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Author not found' }, status: :not_found
      end

      private

      def author_params
        params.require(:author).permit(:name, :nationality, :biography, :photo)
      end

      def author_payload(author)
        photo_url = author.photo.attached? ? author.photo.url : nil
        author.as_json.merge(photo_url: photo_url)
      end
    end
  end
end

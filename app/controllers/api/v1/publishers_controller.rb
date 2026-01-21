module Api
  module V1
    class PublishersController < ApplicationController
      def index
        @publishers = Publisher.all
        render json: @publishers, status: :ok
      end

      def show
        @publisher = Publisher.find(params[:id])
        render json: @publisher, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Publisher not found' }, status: :not_found
      end

      def create
        @publisher = Publisher.new(publisher_params)
        if @publisher.save
          render json: @publisher, status: :created
        else
          render json: { errors: @publisher.errors }, status: :unprocessable_entity
        end
      end

      def update
        @publisher = Publisher.find(params[:id])
        if @publisher.update(publisher_params)
          render json: @publisher, status: :ok
        else
          render json: { errors: @publisher.errors }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Publisher not found' }, status: :not_found
      end

      def destroy
        @publisher = Publisher.find(params[:id])
        @publisher.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Publisher not found' }, status: :not_found
      end

      private

      def publisher_params
        params.require(:publisher).permit(:name)
      end
    end
  end
end

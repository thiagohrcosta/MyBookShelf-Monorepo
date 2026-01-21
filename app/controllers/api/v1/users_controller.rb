module Api
  module V1
    class UsersController < ApplicationController
      def register
        @user = User.new(user_params)
        if @user.save
          render json: { user: @user, message: 'User registered successfully' }, status: :created
        else
          render json: { errors: @user.errors }, status: :unprocessable_entity
        end
      end

      def profile
        @user = User.find(params[:user_id])
        render json: @user, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :not_found
      end

      def update_profile
        @user = User.find(params[:user_id])
        if @user.update(user_update_params)
          render json: @user, status: :ok
        else
          render json: { errors: @user.errors }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :not_found
      end

      private

      def user_params
        params.require(:user).permit(:full_name, :email, :password, :password_confirmation)
      end

      def user_update_params
        params.require(:user).permit(:full_name)
      end
    end
  end
end

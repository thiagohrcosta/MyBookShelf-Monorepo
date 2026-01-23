module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!, only: %i[profile update_profile logout]

      def register
        @user = User.new(user_params)
        if @user.save
          token = JsonWebToken.encode(user_id: @user.id, role: @user.role)
          render json: { user: @user, token: token, message: "User registered successfully" }, status: :created
        else
          render json: { errors: @user.errors }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email])
        if user&.valid_password?(params[:password])
          token = JsonWebToken.encode(user_id: user.id, role: user.role)
          render json: { token: token, user: user }, status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def logout
        render json: { message: "Logged out successfully" }, status: :ok
      end

      def profile
        render json: current_user, status: :ok
      end

      def update_profile
        if current_user.update(user_update_params)
          render json: current_user, status: :ok
        else
          render json: { errors: current_user.errors }, status: :unprocessable_entity
        end
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

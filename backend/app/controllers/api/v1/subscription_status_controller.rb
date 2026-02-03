module Api
  module V1
    class SubscriptionStatusController < ApplicationController
      before_action :authenticate_user!

      def show
        has_active_subscription = current_user.active_subscription?

        render json: {
          has_active_subscription: has_active_subscription,
          is_admin: current_user.admin?
        }, status: :ok
      end
    end
  end
end

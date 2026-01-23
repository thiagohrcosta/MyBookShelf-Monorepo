module Api
  module V1
    class SubscriptionsController < ApplicationController
      before_action :authenticate_user!, except: :webhook

      def show
        @subscription = current_user.subscription
        if @subscription
          render json: @subscription, status: :ok
        else
          render json: { error: "Subscription not found" }, status: :not_found
        end
      end

      def create
        @subscription = current_user.subscription || current_user.build_subscription
        @subscription.assign_attributes(subscription_params)

        if @subscription.save
          render json: @subscription, status: :created
        else
          render json: { errors: @subscription.errors }, status: :unprocessable_entity
        end
      end

      def webhook
        # Handle Stripe webhook events
        render json: { status: "received" }, status: :ok
      end

      private

      def subscription_params
        params.require(:subscription).permit(:stripe_id, :status, :current_period_start, :current_period_end)
      end
    end
  end
end

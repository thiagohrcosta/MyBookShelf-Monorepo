module Api
  module V1
    class SubscriptionsController < ApplicationController
      def show
        @subscription = Subscription.find(params[:id])
        render json: @subscription, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Subscription not found' }, status: :not_found
      end

      def create
        @subscription = Subscription.new(subscription_params)
        if @subscription.save
          render json: @subscription, status: :created
        else
          render json: { errors: @subscription.errors }, status: :unprocessable_entity
        end
      end

      def webhook
        # Handle Stripe webhook events
        render json: { status: 'received' }, status: :ok
      end

      private

      def subscription_params
        params.require(:subscription).permit(:user_id, :stripe_id, :status, :current_period_start, :current_period_end)
      end
    end
  end
end

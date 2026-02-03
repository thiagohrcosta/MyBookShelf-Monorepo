module Api
  module V1
    class SubscriptionCancelController < ApplicationController
      before_action :authenticate_user!

      def create
        subscription = current_user.subscription

        unless subscription
          return render json: { error: "No active subscription found" }, status: :not_found
        end

        # Cancel the subscription in Stripe
        stripe_subscription = ::Stripe::Subscription.delete(subscription.stripe_id)
        Rails.logger.info "[CANCEL SUBSCRIPTION] Canceled Stripe subscription: #{subscription.stripe_id}"

        # Update status in database
        subscription.update!(status: "canceled")
        Rails.logger.info "[CANCEL SUBSCRIPTION] Updated database status to canceled"

        render json: subscription, serializer: SubscriptionSerializer, status: :ok
      rescue ::Stripe::StripeError => e
        Rails.logger.error "[CANCEL SUBSCRIPTION] Stripe Error: #{e.message}"
        render json: { error: e.message }, status: :unprocessable_entity
      rescue => e
        Rails.logger.error "[CANCEL SUBSCRIPTION] Error: #{e.message}"
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end
end

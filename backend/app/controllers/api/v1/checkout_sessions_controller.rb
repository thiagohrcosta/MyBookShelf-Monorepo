module Api
  module V1
    class CheckoutSessionsController < ApplicationController
      before_action :authenticate_user!

      def create
        Rails.logger.info "[CHECKOUT] Starting checkout for user #{current_user.id}"

        # Reload user to ensure fresh data from database
        current_user.reload

        customer_id = Stripe::StripeCustomerService.call(current_user)
        Rails.logger.info "[CHECKOUT] Customer ID: #{customer_id}"

        session = ::Stripe::Checkout::Session.create(
          {
            customer: customer_id,
            mode: "subscription",
            line_items: [
              {
                price: ENV.fetch("STRIPE_PRICE_ID"),
                quantity: 1
              }
            ],
            success_url: success_url,
            cancel_url: cancel_url
          },
          {
            idempotency_key: idempotency_key
          }
        )

        Rails.logger.info "[CHECKOUT] Session created: #{session.id} - URL: #{session.url}"
        render json: { url: session.url }, status: :ok
      rescue ::Stripe::StripeError => e
        Rails.logger.error "[CHECKOUT] Stripe Error: #{e.class} - #{e.message}"
        render json: { error: e.message }, status: :unprocessable_entity
      rescue => e
        Rails.logger.error "[CHECKOUT] Unexpected Error: #{e.class} - #{e.message}\n#{e.backtrace.join("\n")}"
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def success_url
        "#{ENV.fetch("FRONTEND_URL")}/success"
      end

      def cancel_url
        "#{ENV.fetch("FRONTEND_URL")}/cancel"
      end

      def idempotency_key
        "checkout_session_user_#{current_user.id}_#{Time.current.to_i}"
      end
    end
  end
end

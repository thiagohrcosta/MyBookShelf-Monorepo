module Api
  module V1
    class StripeWebhooksController < ApplicationController
      skip_before_action :verify_authenticity_token
      skip_before_action :authenticate_user!, if: :json_request?

      def create
        payload = request.body.read
        sig_header = request.env["HTTP_STRIPE_SIGNATURE"]
        webhook_secret = ENV.fetch("STRIPE_WEBHOOK_SECRET")

        Rails.logger.info "[STRIPE WEBHOOK] Received webhook - Signature present: #{sig_header.present?}"

        begin
          event = ::Stripe::Webhook.construct_event(
            payload, sig_header, webhook_secret
          )
          Rails.logger.info "[STRIPE WEBHOOK] Event verified - Type: #{event.type}, ID: #{event.id}"
        rescue JSON::ParserError => e
          Rails.logger.error "[STRIPE WEBHOOK] JSON Parse Error: #{e.message}"
          render json: { error: "Invalid payload" }, status: :bad_request
          return
        rescue ::Stripe::SignatureVerificationError => e
          Rails.logger.error "[STRIPE WEBHOOK] Signature Verification Error: #{e.message}"
          render json: { error: "Invalid signature" }, status: :bad_request
          return
        end

        handle_event(event)

        render json: { status: "success" }, status: :ok
      end

      private

      def handle_event(event)
        case event.type
        when "checkout.session.completed"
          Rails.logger.info "[STRIPE WEBHOOK] Processing checkout.session.completed"
          Stripe::HandleCheckoutSessionService.call(event.data.object)
        when "customer.subscription.updated"
          Rails.logger.info "[STRIPE WEBHOOK] Processing customer.subscription.updated"
          Stripe::HandleSubscriptionUpdateService.call(event.data.object)
        when "customer.subscription.deleted"
          Rails.logger.info "[STRIPE WEBHOOK] Processing customer.subscription.deleted"
          Stripe::HandleSubscriptionDeletedService.call(event.data.object)
        else
          Rails.logger.warn "[STRIPE WEBHOOK] Unhandled event type: #{event.type}"
        end
      end

      def json_request?
        request.format.json?
      end
    end
  end
end

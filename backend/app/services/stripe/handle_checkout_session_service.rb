module Stripe
  class HandleCheckoutSessionService
    def self.call(checkout_session)
      new(checkout_session).call
    end

    def initialize(checkout_session)
      @checkout_session = checkout_session
    end

    def call
      Rails.logger.info "[CHECKOUT SESSION] Mode: #{@checkout_session.mode}, Customer: #{@checkout_session.customer}"

      return unless @checkout_session.mode == "subscription"

      user = find_user
      return unless user

      Rails.logger.info "[CHECKOUT SESSION] Found user: #{user.email} (ID: #{user.id})"

      subscription_stripe = fetch_subscription
      Rails.logger.info "[CHECKOUT SESSION] Stripe subscription: #{subscription_stripe.id} (#{subscription_stripe.status})"

      create_or_update_subscription(user, subscription_stripe)
    end

    private

    def find_user
      stripe_customer_id = @checkout_session.customer
      User.find_by(stripe_customer_id: stripe_customer_id)
    end

    def fetch_subscription
      subscription_id = @checkout_session.subscription
      ::Stripe::Subscription.retrieve(subscription_id)
    end

    def create_or_update_subscription(user, subscription_stripe)
      subscription = user.subscription || user.build_subscription

      subscription.update!(
        stripe_id: subscription_stripe.id,
        status: subscription_stripe.status,
        current_period_start: Time.at(subscription_stripe.current_period_start),
        current_period_end: Time.at(subscription_stripe.current_period_end)
      )

      Rails.logger.info "[CHECKOUT SESSION] Subscription saved: #{subscription.id} (Status: #{subscription.status})"
    end
  end
end

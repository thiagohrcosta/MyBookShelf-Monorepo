module Stripe
  class HandleSubscriptionUpdateService
    def self.call(subscription_stripe)
      new(subscription_stripe).call
    end

    def initialize(subscription_stripe)
      @subscription_stripe = subscription_stripe
    end

    def call
      subscription = find_subscription
      return unless subscription

      subscription.update!(
        status: @subscription_stripe.status,
        current_period_start: Time.at(@subscription_stripe.current_period_start),
        current_period_end: Time.at(@subscription_stripe.current_period_end)
      )
    end

    private

    def find_subscription
      Subscription.find_by(stripe_id: @subscription_stripe.id)
    end
  end
end

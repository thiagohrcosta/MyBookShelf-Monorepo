module Stripe
  class HandleSubscriptionDeletedService
    def self.call(subscription_stripe)
      new(subscription_stripe).call
    end

    def initialize(subscription_stripe)
      @subscription_stripe = subscription_stripe
    end

    def call
      subscription = find_subscription
      return unless subscription

      subscription.update!(status: :canceled)
    end

    private

    def find_subscription
      Subscription.find_by(stripe_id: @subscription_stripe.id)
    end
  end
end

module Stripe
  class StripeCustomerService
    def self.call(user)
      new(user).call
    end

    def initialize(user)
      @user = user
    end

    def call
      return @user.stripe_customer_id if @user.stripe_customer_id.present?

      Rails.logger.info "[STRIPE CUSTOMER] Creating new customer for user #{@user.id}"
      customer = create_customer!
      Rails.logger.info "[STRIPE CUSTOMER] Created customer: #{customer.id}"

      @user.update!(stripe_customer_id: customer.id)
      Rails.logger.info "[STRIPE CUSTOMER] Saved customer ID to database"
      customer.id
    end

    private

    def create_customer!
      ::Stripe::Customer.create(
        {
          email: @user.email,
          metadata: {
            user_id: @user.id
          }
        }
      )
    end
  end
end

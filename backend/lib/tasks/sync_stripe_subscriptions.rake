namespace :stripe do
  desc "Sync subscriptions from Stripe to database for users with stripe_customer_id"
  task sync_subscriptions: :environment do
    User.where.not(stripe_customer_id: nil).each do |user|
      puts "Processing user #{user.id} (#{user.email})..."

      begin
        stripe_customer = Stripe::Customer.retrieve(user.stripe_customer_id)

        if stripe_customer.subscriptions&.data&.any?
          subscription_stripe = stripe_customer.subscriptions.data.first
          puts "  Found subscription: #{subscription_stripe.id} (#{subscription_stripe.status})"

          subscription = user.subscription || user.build_subscription
          subscription.update!(
            stripe_id: subscription_stripe.id,
            status: subscription_stripe.status,
            current_period_start: Time.at(subscription_stripe.current_period_start),
            current_period_end: Time.at(subscription_stripe.current_period_end)
          )

          puts "  ✓ Subscription synced!"
        else
          puts "  No subscriptions found on Stripe"
        end
      rescue Stripe::InvalidRequestError => e
        puts "  ✗ Error: #{e.message}"
      end
    end

    puts "Done!"
  end
end

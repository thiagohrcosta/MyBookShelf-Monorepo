namespace :stripe do
  desc "Create test subscription for user 960"
  task create_test_subscription: :environment do
    user = User.find(960)
    puts "Creating subscription for user: #{user.email}"

    # Create subscription in Stripe
    stripe_sub = ::Stripe::Subscription.create(
      customer: user.stripe_customer_id,
      items: [{ price: "price_1SwjZuCrEEizdeKzB31GsAx9" }]
    )

    puts "✓ Created Stripe subscription: #{stripe_sub.id}"

    # Now sync it to the database
    subscription = user.subscription || user.build_subscription
    subscription.update!(
      stripe_id: stripe_sub.id,
      status: stripe_sub.status,
      current_period_start: Time.at(stripe_sub.current_period_start),
      current_period_end: Time.at(stripe_sub.current_period_end)
    )

    puts "✓ Synced to database: #{subscription.id}"
    puts "Status: #{subscription.status}"
    puts "Valid until: #{subscription.current_period_end}"
  end
end

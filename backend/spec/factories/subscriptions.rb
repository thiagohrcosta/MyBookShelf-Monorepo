FactoryBot.define do
  factory :subscription do
    association :user
    stripe_id { Faker::Alphanumeric.alphanumeric(number: 10) }
    status { "active" }
    current_period_start { Time.current }
    current_period_end { 1.month.from_now }
  end
end

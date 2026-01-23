FactoryBot.define do
  factory :book_review do
    rating { Faker::Number.between(from: 0, to: 10) }
    review { Faker::Lorem.paragraph }
    association :user
    association :book
  end
end

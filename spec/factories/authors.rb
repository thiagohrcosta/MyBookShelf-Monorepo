FactoryBot.define do
  factory :author do
    name { Faker::Book.author }
    nationality { Faker::Address.country }
    biography { Faker::Lorem.paragraph }
    association :user
  end
end

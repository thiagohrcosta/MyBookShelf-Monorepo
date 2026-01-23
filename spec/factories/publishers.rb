FactoryBot.define do
  factory :publisher do
    name { Faker::Company.name }
    association :user
  end
end

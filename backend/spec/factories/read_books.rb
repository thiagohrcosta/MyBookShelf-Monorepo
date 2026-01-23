FactoryBot.define do
  factory :read_book do
    association :user
    association :book
    month { 1 }
    year { 2025 }
  end
end

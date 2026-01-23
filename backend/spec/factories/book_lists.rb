FactoryBot.define do
  factory :book_list do
    association :user
    association :book
    status { "acquired" }
  end
end

FactoryBot.define do
  factory :book do
    title { Faker::Book.title }
    original_title { Faker::Book.title }
    summary { Faker::Lorem.paragraph }
    pages { Faker::Number.between(from: 50, to: 1000) }
    edition { [ "1a edição", "2a edição" ].sample }
    language_version { %w[PT-BR PT EN ES FR IT DE JA ZH-CN ZH-TW RU].sample }
    release_year { Faker::Number.between(from: 1900, to: 2026) }
    association :author
    association :publisher
    association :user
  end
end

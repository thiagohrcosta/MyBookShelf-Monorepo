require 'rails_helper'

RSpec.describe Book, type: :model do
  subject { build(:book) }

  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:language_version) }
  it { should validate_presence_of(:edition) }
  it do
    should define_enum_for(:language_version).with_values(
      pt_br: "PT-BR",
      pt: "PT",
      en: "EN",
      es: "ES",
      fr: "FR",
      it: "IT",
      de: "DE",
      ja: "JA",
      zh_cn: "ZH-CN",
      zh_tw: "ZH-TW",
      ru: "RU"
    ).backed_by_column_of_type(:string)
  end
  it { should belong_to(:author) }
  it { should belong_to(:publisher) }
  it { should have_many(:book_reviews) }
  it { should have_many(:book_lists) }
  it { should have_many(:read_books) }
end

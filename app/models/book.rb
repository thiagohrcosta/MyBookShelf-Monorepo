class Book < ApplicationRecord
  has_one_attached :box_cover
  belongs_to :author
  belongs_to :publisher
  has_many :book_reviews, dependent: :destroy
  has_many :book_lists, dependent: :destroy
  has_many :read_books, dependent: :destroy

  enum language_version: {
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
  }

  validates :title, presence: true
  validates :language_version, presence: true
  validates :edition, presence: true
  validates :title, uniqueness: { scope: %i[edition language_version] }
  validates :author_id, :publisher_id, presence: true
end

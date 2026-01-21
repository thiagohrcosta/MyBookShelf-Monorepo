class ReadBook < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validates :month, presence: true, inclusion: { in: 1..12 }
  validates :year, presence: true
  validates :user_id, uniqueness: { scope: [:book_id, :month, :year] }
end

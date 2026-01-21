class BookReview < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validates :rating, presence: true, inclusion: { in: 0..10 }
  validates :review, presence: true
  validates :user_id, uniqueness: { scope: :book_id, message: "can only review a book once" }
end

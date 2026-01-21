class BookList < ApplicationRecord
  belongs_to :user
  belongs_to :book

  enum :status, { acquired: "acquired", reading: "reading", finished: "finished", abandoned: "abandoned", wishlist: "wishlist" }

  validates :status, presence: true
  validates :user_id, uniqueness: { scope: :book_id }
end

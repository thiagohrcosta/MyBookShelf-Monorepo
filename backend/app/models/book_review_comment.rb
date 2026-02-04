class BookReviewComment < ApplicationRecord
  belongs_to :book_review
  belongs_to :user
  belongs_to :parent, class_name: "BookReviewComment", optional: true, inverse_of: :replies

  has_many :replies,
           class_name: "BookReviewComment",
           foreign_key: :parent_id,
           dependent: :destroy,
           inverse_of: :parent
  has_many :book_review_comment_likes, dependent: :destroy

  validates :body, presence: true
  validate :parent_belongs_to_same_review

  private

  def parent_belongs_to_same_review
    return if parent.nil?
    return if parent.book_review_id == book_review_id

    errors.add(:parent_id, "must belong to the same review")
  end
end

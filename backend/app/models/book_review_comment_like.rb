class BookReviewCommentLike < ApplicationRecord
  belongs_to :book_review_comment
  belongs_to :user

  validates :user_id, uniqueness: { scope: :book_review_comment_id }
  validate :cannot_like_own_comment

  private

  def cannot_like_own_comment
    return if book_review_comment.nil?
    return if book_review_comment.user_id != user_id

    errors.add(:user_id, "cannot like your own comment")
  end
end

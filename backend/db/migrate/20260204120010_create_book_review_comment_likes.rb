class CreateBookReviewCommentLikes < ActiveRecord::Migration[7.2]
  def change
    create_table :book_review_comment_likes do |t|
      t.references :book_review_comment, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end

    add_index :book_review_comment_likes,
              %i[book_review_comment_id user_id],
              unique: true,
              name: "index_book_review_comment_likes_unique"
  end
end

class CreateBookReviewComments < ActiveRecord::Migration[7.2]
  def change
    create_table :book_review_comments do |t|
      t.references :book_review, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :body, null: false
      t.references :parent, foreign_key: { to_table: :book_review_comments }, index: true
      t.timestamps
    end

    add_index :book_review_comments, %i[book_review_id parent_id]
  end
end

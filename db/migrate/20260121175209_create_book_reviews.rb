class CreateBookReviews < ActiveRecord::Migration[7.2]
  def change
    create_table :book_reviews do |t|
      t.integer :rating
      t.text :review
      t.references :user, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true

      t.timestamps
    end
  end
end

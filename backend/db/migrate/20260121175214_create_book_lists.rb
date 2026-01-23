class CreateBookLists < ActiveRecord::Migration[7.2]
  def change
    create_table :book_lists do |t|
      t.references :user, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true
      t.string :status

      t.timestamps
    end
  end
end

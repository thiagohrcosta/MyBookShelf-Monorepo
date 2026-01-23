class AddUserRefsToBooksAuthorsPublishers < ActiveRecord::Migration[7.2]
  def change
    add_reference :authors, :user, foreign_key: true
    add_reference :publishers, :user, foreign_key: true
    add_reference :books, :user, foreign_key: true
  end
end

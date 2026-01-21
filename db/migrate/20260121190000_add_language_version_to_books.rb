class AddLanguageVersionToBooks < ActiveRecord::Migration[7.2]
  def change
    add_column :books, :language_version, :string, null: false, default: "PT-BR"
  end
end

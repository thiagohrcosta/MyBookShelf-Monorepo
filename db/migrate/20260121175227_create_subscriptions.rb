class CreateSubscriptions < ActiveRecord::Migration[7.2]
  def change
    create_table :subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :stripe_id
      t.string :status
      t.datetime :current_period_start
      t.datetime :current_period_end

      t.timestamps
    end
  end
end

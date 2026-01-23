class Subscription < ApplicationRecord
  belongs_to :user

  enum :status, { active: "active", canceled: "canceled", expired: "expired" }

  validates :user_id, presence: true, uniqueness: true
  validates :stripe_id, presence: true, uniqueness: true
  validates :status, presence: true
end

class SubscriptionSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :stripe_id, :status, :current_period_start, :current_period_end, :created_at, :updated_at
end

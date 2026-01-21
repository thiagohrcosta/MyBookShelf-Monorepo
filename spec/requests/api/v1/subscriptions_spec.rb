require 'rails_helper'

RSpec.describe "Api::V1::Subscriptions", type: :request do
  describe "GET /api/v1/subscriptions/:id" do
    it "returns subscription details" do
      subscription = create(:subscription)

      get "/api/v1/subscriptions/#{subscription.id}"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(subscription.id)
    end

    it "returns 404 when subscription not found" do
      get '/api/v1/subscriptions/99999'

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/subscriptions" do
    it "creates a new subscription" do
      user = create(:user)

      post '/api/v1/subscriptions', params: { subscription: { user_id: user.id, stripe_id: 'sub_test123', status: 'active' } }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['status']).to eq('active')
    end

    it "returns error with invalid data" do
      post '/api/v1/subscriptions', params: { subscription: { status: 'active' } }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "POST /api/v1/subscriptions/webhook" do
    it "receives webhook events" do
      post '/api/v1/subscriptions/webhook', params: { type: 'customer.subscription.updated' }

      expect(response).to have_http_status(:ok)
    end
  end
end

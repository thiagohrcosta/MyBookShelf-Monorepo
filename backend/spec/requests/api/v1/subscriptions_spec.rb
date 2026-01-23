require 'rails_helper'

RSpec.describe "Api::V1::Subscriptions", type: :request do
  let(:user) { create(:user) }

  describe "GET /api/v1/subscriptions/:id" do
    it "returns subscription details" do
      subscription = create(:subscription, user: user)

      get "/api/v1/subscriptions/#{subscription.id}", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(subscription.id)
    end

    it "returns 404 when subscription not found" do
      get '/api/v1/subscriptions/99999', headers: auth_headers(user)

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/subscriptions" do
    it "creates a new subscription" do
      post '/api/v1/subscriptions', params: { subscription: { stripe_id: 'sub_test123', status: 'active' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['status']).to eq('active')
    end

    it "returns error with invalid data" do
      post '/api/v1/subscriptions', params: { subscription: { status: 'active' } }, headers: auth_headers(user)

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

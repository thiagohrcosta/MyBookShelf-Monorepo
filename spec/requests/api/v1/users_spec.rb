require 'rails_helper'

RSpec.describe "Api::V1::Users", type: :request do
  describe "GET /api/v1/users/profile" do
    it "returns user profile" do
      user = create(:user)

      get "/api/v1/users/profile", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['id']).to eq(user.id)
      expect(json['email']).to eq(user.email)
    end

    it "returns unauthorized without token" do
      get '/api/v1/users/profile'

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "PATCH /api/v1/users/profile" do
    it "updates user profile" do
      user = create(:user)

      patch "/api/v1/users/profile", params: { user: { full_name: 'Updated Name' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['full_name']).to eq('Updated Name')
    end

    it "returns unauthorized without token" do
      patch '/api/v1/users/profile', params: { user: { full_name: 'Test' } }

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns error with invalid data" do
      user = create(:user)

      patch "/api/v1/users/profile", params: { user: { full_name: '' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end

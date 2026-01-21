require 'rails_helper'

RSpec.describe "Api::V1::Users", type: :request do
  describe "GET /api/v1/users/profile" do
    it "returns user profile" do
      user = create(:user)

      get "/api/v1/users/profile", params: { user_id: user.id }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['id']).to eq(user.id)
      expect(json['email']).to eq(user.email)
    end

    it "returns 404 when user not found" do
      get '/api/v1/users/profile', params: { user_id: 99999 }

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "PATCH /api/v1/users/profile" do
    it "updates user profile" do
      user = create(:user)

      patch "/api/v1/users/profile", params: { user_id: user.id, user: { full_name: 'Updated Name' } }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['full_name']).to eq('Updated Name')
    end

    it "returns 404 when user not found" do
      patch '/api/v1/users/profile', params: { user_id: 99999, user: { full_name: 'Test' } }

      expect(response).to have_http_status(:not_found)
    end

    it "returns error with invalid data" do
      user = create(:user)

      patch "/api/v1/users/profile", params: { user_id: user.id, user: { full_name: '' } }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end

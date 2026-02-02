require 'rails_helper'

RSpec.describe "Api::V1::Publishers", type: :request do
  let(:user) { create(:user) }

  describe "GET /api/v1/publishers" do
    it "returns all publishers" do
      publisher1 = create(:publisher)
      publisher2 = create(:publisher)

      get '/api/v1/publishers'

      expect(response).to have_http_status(:ok)
      response_data = JSON.parse(response.body)
      expect(response_data).to include(hash_including('id' => publisher1.id))
      expect(response_data).to include(hash_including('id' => publisher2.id))
    end
  end

  describe "GET /api/v1/publishers/:id" do
    it "returns a specific publisher" do
      publisher = create(:publisher)

      get "/api/v1/publishers/#{publisher.id}"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(publisher.id)
    end

    it "returns 404 when publisher not found" do
      get '/api/v1/publishers/99999'

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/publishers" do
    it "creates a new publisher" do
      post '/api/v1/publishers', params: { publisher: { name: 'Test Publisher' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['name']).to eq('Test Publisher')
    end

    it "returns error when name is missing" do
      post '/api/v1/publishers', params: { publisher: { name: '' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/v1/publishers/:id" do
    it "updates a publisher" do
      publisher = create(:publisher)

      patch "/api/v1/publishers/#{publisher.id}", params: { publisher: { name: 'Updated Name' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['name']).to eq('Updated Name')
    end

    it "returns 404 when publisher not found" do
      patch '/api/v1/publishers/99999', params: { publisher: { name: 'Updated' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /api/v1/publishers/:id" do
    it "deletes a publisher" do
      publisher = create(:publisher)

      delete "/api/v1/publishers/#{publisher.id}", headers: auth_headers(user)

      expect(response).to have_http_status(:no_content)
    end

    it "returns 404 when publisher not found" do
      delete '/api/v1/publishers/99999', headers: auth_headers(user)

      expect(response).to have_http_status(:not_found)
    end
  end
end

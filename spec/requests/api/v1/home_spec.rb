require 'rails_helper'

RSpec.describe "Api::V1::Homes", type: :request do
  describe "GET /api/v1/home" do
    it "returns home page data" do
      create(:book)
      create(:publisher)
      create(:book_review)

      get '/api/v1/home'

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to have_key('latest_books')
      expect(json).to have_key('latest_publishers')
      expect(json).to have_key('latest_reviews')
      expect(json).to have_key('api_version')
    end
  end
end

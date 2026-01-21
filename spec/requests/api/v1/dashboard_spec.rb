require 'rails_helper'

RSpec.describe "Api::V1::Dashboards", type: :request do
  describe "GET /api/v1/dashboard" do
    it "returns dashboard statistics" do
      user = create(:user)
      book = create(:book)
      create(:read_book, user: user, book: book, month: Date.today.month, year: Date.today.year)

      get '/api/v1/dashboard', params: { user_id: user.id }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to have_key('reading_statistics')
      expect(json['reading_statistics']['total_read']).to eq(1)
    end
  end
end

require 'rails_helper'

RSpec.describe "Api::V1::ReadBooks", type: :request do
  describe "GET /api/v1/read_books" do
    it "returns all read books" do
      user = create(:user)
      book1 = create(:book)
      book2 = create(:book)
      read_book1 = create(:read_book, user: user, book: book1)
      read_book2 = create(:read_book, user: user, book: book2)

      get '/api/v1/read_books'

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(2)
    end
  end

  describe "POST /api/v1/read_books" do
    it "creates a new read book entry" do
      user = create(:user)
      book = create(:book)

      post '/api/v1/read_books', params: { read_book: { user_id: user.id, book_id: book.id, month: 12, year: 2025 } }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['month']).to eq(12)
    end
  end
end

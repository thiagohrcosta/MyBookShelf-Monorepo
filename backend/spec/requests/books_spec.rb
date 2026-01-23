require 'rails_helper'

RSpec.describe 'Books API', type: :request do
  describe 'GET /api/v1/books' do
    it 'returns a list of books' do
      get '/api/v1/books'
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /api/v1/books/:id' do
    it 'returns a book' do
      book = create(:book)
      get "/api/v1/books/#{book.id}"
      expect(response).to have_http_status(:success)
    end
  end
end

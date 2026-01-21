require 'rails_helper'

RSpec.describe "Api::V1::BookLists", type: :request do
  describe "GET /api/v1/book_lists" do
    it "returns all book lists" do
      user = create(:user)
      book = create(:book)
      book_list1 = create(:book_list, user: user, book: book)
      book_list2 = create(:book_list, user: user)

      get '/api/v1/book_lists'

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(2)
    end
  end

  describe "POST /api/v1/book_lists" do
    it "creates a new book list entry" do
      user = create(:user)
      book = create(:book)

      post '/api/v1/book_lists', params: { book_list: { user_id: user.id, book_id: book.id, status: 'reading' } }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['status']).to eq('reading')
    end

    it "returns error with invalid data" do
      post '/api/v1/book_lists', params: { book_list: { status: 'reading' } }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/v1/book_lists/:id" do
    it "updates book list status" do
      book_list = create(:book_list, status: 'acquired')

      patch "/api/v1/book_lists/#{book_list.id}", params: { book_list: { status: 'finished' } }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['status']).to eq('finished')
    end

    it "returns 404 when book list not found" do
      patch '/api/v1/book_lists/99999', params: { book_list: { status: 'finished' } }

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /api/v1/book_lists/:id" do
    it "deletes a book list entry" do
      book_list = create(:book_list)

      delete "/api/v1/book_lists/#{book_list.id}"

      expect(response).to have_http_status(:no_content)
    end

    it "returns 404 when book list not found" do
      delete '/api/v1/book_lists/99999'

      expect(response).to have_http_status(:not_found)
    end
  end
end

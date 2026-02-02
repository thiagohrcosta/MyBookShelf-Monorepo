require 'rails_helper'

RSpec.describe "Api::V1::BookLists", type: :request do
  let(:user) { create(:user) }

  describe "GET /api/v1/book_lists" do
    it "returns all book lists" do
      book = create(:book)
      book_list1 = create(:book_list, user: user, book: book)
      book_list2 = create(:book_list, user: user)

      get '/api/v1/book_lists', headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(2)
    end
  end

  describe "GET /api/v1/books/:book_id/book_list" do
    it "returns the book list for the book when it exists" do
      book = create(:book)
      book_list = create(:book_list, user: user, book: book, status: 'reading')

      get "/api/v1/books/#{book.id}/book_list", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(book_list.id)
    end

    it "returns null when no book list exists" do
      book = create(:book)

      get "/api/v1/books/#{book.id}/book_list", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['book_list']).to be_nil
    end
  end

  describe "POST /api/v1/book_lists" do
    it "creates a new book list entry" do
      book = create(:book)

      post '/api/v1/book_lists', params: { book_list: { book_id: book.id, status: 'reading' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['status']).to eq('reading')
    end

    it "updates existing book list when it already exists" do
      book = create(:book)
      existing = create(:book_list, user: user, book: book, status: 'reading')

      post '/api/v1/book_lists', params: { book_list: { book_id: book.id, status: 'reading' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(existing.id)
      expect(JSON.parse(response.body)['status']).to eq('reading')
    end

    it "requires month and year when status is finished" do
      book = create(:book)

      post '/api/v1/book_lists', params: { book_list: { book_id: book.id, status: 'finished' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:unprocessable_entity)
      json_response = JSON.parse(response.body)
      expect(json_response['errors']['read_month']).to include("can't be blank")
      expect(json_response['errors']['read_year']).to include("can't be blank")
    end

    it "creates a read book entry when status is finished with month/year" do
      book = create(:book)

      post '/api/v1/book_lists', params: { book_list: { book_id: book.id, status: 'finished', read_month: 12, read_year: 2025 } }, headers: auth_headers(user)

      expect(response).to have_http_status(:created)
      json_response = JSON.parse(response.body)
      expect(ReadBook.where(user: user, book: book, month: 12, year: 2025)).to exist
      expect(json_response['read_month']).to eq(12)
      expect(json_response['read_year']).to eq(2025)
    end

    it "returns error with invalid data" do
      post '/api/v1/book_lists', params: { book_list: { status: 'reading' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/v1/book_lists/:id" do
    it "updates book list status" do
      book_list = create(:book_list, status: 'acquired', user: user)

      patch "/api/v1/book_lists/#{book_list.id}", params: { book_list: { status: 'reading' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['status']).to eq('reading')
    end

    it "requires month and year when status is finished" do
      book_list = create(:book_list, status: 'reading', user: user)

      patch "/api/v1/book_lists/#{book_list.id}", params: { book_list: { status: 'finished' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:unprocessable_entity)
      json_response = JSON.parse(response.body)
      expect(json_response['errors']['read_month']).to include("can't be blank")
      expect(json_response['errors']['read_year']).to include("can't be blank")
    end

    it "creates a read book entry when status is finished with month/year" do
      book = create(:book)
      book_list = create(:book_list, status: 'reading', user: user, book: book)

      patch "/api/v1/book_lists/#{book_list.id}", params: { book_list: { status: 'finished', read_month: 1, read_year: 2026 } }, headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(ReadBook.where(user: user, book: book, month: 1, year: 2026)).to exist
      expect(json_response['read_month']).to eq(1)
      expect(json_response['read_year']).to eq(2026)
    end

    it "returns 404 when book list not found" do
      patch '/api/v1/book_lists/99999', params: { book_list: { status: 'finished' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /api/v1/book_lists/:id" do
    it "deletes a book list entry" do
      book_list = create(:book_list, user: user)

      delete "/api/v1/book_lists/#{book_list.id}", headers: auth_headers(user)

      expect(response).to have_http_status(:no_content)
    end

    it "returns 404 when book list not found" do
      delete '/api/v1/book_lists/99999', headers: auth_headers(user)

      expect(response).to have_http_status(:not_found)
    end
  end
end

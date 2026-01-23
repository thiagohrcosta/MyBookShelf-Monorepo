require 'rails_helper'

RSpec.describe "Api::V1::BookReviews", type: :request do
  let(:user) { create(:user) }
  describe "GET /api/v1/books/:book_id/reviews" do
    it "returns all book reviews for a book" do
      book = create(:book)
      review1 = create(:book_review, book: book)
      review2 = create(:book_review, book: book)

      get "/api/v1/books/#{book.id}/reviews"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(2)
    end

    it "returns 404 when book not found" do
      get '/api/v1/books/99999/reviews'

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/book_reviews" do
    it "creates a new book review" do
      book = create(:book)

      post '/api/v1/book_reviews', params: { book_review: { book_id: book.id, rating: 8, review: 'Great book!' } }, headers: auth_headers(user)

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['rating']).to eq(8)
    end

    it "returns error with invalid data" do
      post '/api/v1/book_reviews', params: { book_review: { rating: 8 } }, headers: auth_headers(user)

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "DELETE /api/v1/book_reviews/:id" do
    it "deletes a review" do
      review = create(:book_review, user: user)

      delete "/api/v1/book_reviews/#{review.id}", headers: auth_headers(user)

      expect(response).to have_http_status(:no_content)
    end

    it "returns 404 when review not found" do
      delete '/api/v1/book_reviews/99999', headers: auth_headers(user)

      expect(response).to have_http_status(:not_found)
    end
  end
end

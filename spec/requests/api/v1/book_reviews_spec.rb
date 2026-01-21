require 'rails_helper'

RSpec.describe "Api::V1::BookReviews", type: :request do
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
      user = create(:user)
      book = create(:book)

      post '/api/v1/book_reviews', params: { book_review: { user_id: user.id, book_id: book.id, rating: 8, review: 'Great book!' } }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['rating']).to eq(8)
    end

    it "returns error with invalid data" do
      post '/api/v1/book_reviews', params: { book_review: { rating: 8 } }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "DELETE /api/v1/book_reviews/:id" do
    it "deletes a review" do
      review = create(:book_review)

      delete "/api/v1/book_reviews/#{review.id}"

      expect(response).to have_http_status(:no_content)
    end

    it "returns 404 when review not found" do
      delete '/api/v1/book_reviews/99999'

      expect(response).to have_http_status(:not_found)
    end
  end
end

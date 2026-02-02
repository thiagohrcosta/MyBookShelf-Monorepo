require 'rails_helper'

RSpec.describe "Api::V1::Statistics", type: :request do
  let(:user) { create(:user) }
  let(:author) { create(:author) }
  let(:publisher) { create(:publisher) }

  describe "GET /api/v1/statistics" do
    context "when user is authenticated" do
      it "returns statistics for the current year by default" do
        book = create(:book, author: author, publisher: publisher, user: user)
        create(:read_book, user: user, book: book, month: 1, year: Date.current.year)
        create(:read_book, user: user, book: book, month: 2, year: Date.current.year)

        get '/api/v1/statistics', headers: auth_headers(user)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response).to have_key('books_per_year')
        expect(json_response).to have_key('books_per_month')
        expect(json_response).to have_key('books_in_year')
        expect(json_response).to have_key('total_books')
        expect(json_response).to have_key('total_pages')
        expect(json_response).to have_key('books_this_year')
        expect(json_response).to have_key('selected_year')
        expect(json_response).to have_key('available_years')
        expect(json_response['selected_year']).to eq(Date.current.year)
      end

      it "returns statistics for a specific year when year parameter is provided" do
        book = create(:book, author: author, publisher: publisher, user: user)
        create(:read_book, user: user, book: book, month: 3, year: 2024)
        create(:read_book, user: user, book: book, month: 6, year: 2025)

        get '/api/v1/statistics', params: { year: 2024 }, headers: auth_headers(user)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response['selected_year']).to eq(2024)
        expect(json_response['books_this_year']).to eq(1)
      end

      it "returns books per month with all 12 months" do
        book = create(:book, author: author, publisher: publisher, user: user)
        create(:read_book, user: user, book: book, month: 1, year: 2024)
        create(:read_book, user: user, book: book, month: 5, year: 2024)

        get '/api/v1/statistics', params: { year: 2024 }, headers: auth_headers(user)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        books_per_month = json_response['books_per_month']

        expect(books_per_month.size).to eq(12)
        expect(books_per_month.first['month']).to eq(1)
        expect(books_per_month.last['month']).to eq(12)
        expect(books_per_month.find { |m| m['month'] == 1 }['count']).to eq(1)
        expect(books_per_month.find { |m| m['month'] == 2 }['count']).to eq(0)
        expect(books_per_month.find { |m| m['month'] == 5 }['count']).to eq(1)
      end

      it "returns books per year aggregated data" do
        book1 = create(:book, author: author, publisher: publisher, user: user)
        book2 = create(:book, author: author, publisher: publisher, user: user)
        create(:read_book, user: user, book: book1, month: 1, year: 2023)
        create(:read_book, user: user, book: book2, month: 1, year: 2024)
        create(:read_book, user: user, book: book1, month: 6, year: 2024)

        get '/api/v1/statistics', headers: auth_headers(user)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        books_per_year = json_response['books_per_year']

        expect(books_per_year).to be_an(Array)
        year_2023 = books_per_year.find { |y| y['year'] == 2023 }
        year_2024 = books_per_year.find { |y| y['year'] == 2024 }

        expect(year_2023['count']).to eq(1)
        expect(year_2024['count']).to eq(2)
      end

      it "returns detailed book list for selected year" do
        book1 = create(:book, title: 'Book 1', author: author, publisher: publisher, user: user, pages: 300)
        book2 = create(:book, title: 'Book 2', author: author, publisher: publisher, user: user, pages: 200)
        create(:read_book, user: user, book: book1, month: 1, year: 2024)
        create(:read_book, user: user, book: book2, month: 3, year: 2024)

        get '/api/v1/statistics', params: { year: 2024 }, headers: auth_headers(user)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        books_in_year = json_response['books_in_year']

        expect(books_in_year.size).to eq(2)
        expect(books_in_year.first).to have_key('id')
        expect(books_in_year.first).to have_key('title')
        expect(books_in_year.first).to have_key('author')
        expect(books_in_year.first).to have_key('publisher')
        expect(books_in_year.first).to have_key('month')
        expect(books_in_year.first).to have_key('year')
        expect(books_in_year.first).to have_key('pages')
        expect(books_in_year.first).to have_key('box_cover_url')
      end

      it "calculates total books and total pages correctly" do
        book1 = create(:book, author: author, publisher: publisher, user: user, pages: 300)
        book2 = create(:book, author: author, publisher: publisher, user: user, pages: 200)
        create(:read_book, user: user, book: book1, month: 1, year: 2023)
        create(:read_book, user: user, book: book2, month: 1, year: 2024)

        get '/api/v1/statistics', headers: auth_headers(user)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response['total_books']).to eq(2)
        expect(json_response['total_pages']).to eq(500)
      end

      it "returns available years in descending order" do
        book = create(:book, author: author, publisher: publisher, user: user)
        create(:read_book, user: user, book: book, month: 1, year: 2022)
        create(:read_book, user: user, book: book, month: 1, year: 2024)
        create(:read_book, user: user, book: book, month: 1, year: 2023)

        get '/api/v1/statistics', headers: auth_headers(user)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        available_years = json_response['available_years']

        expect(available_years).to eq([ 2024, 2023, 2022 ])
      end

      it "returns empty data when user has no read books" do
        get '/api/v1/statistics', headers: auth_headers(user)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response['books_per_year']).to eq([])
        expect(json_response['books_in_year']).to eq([])
        expect(json_response['total_books']).to eq(0)
        expect(json_response['total_pages']).to eq(0)
        expect(json_response['books_this_year']).to eq(0)
        expect(json_response['available_years']).to eq([])
      end
    end

    context "when user is not authenticated" do
      it "returns unauthorized status" do
        get '/api/v1/statistics'

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end

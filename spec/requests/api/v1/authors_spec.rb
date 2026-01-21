require 'rails_helper'

RSpec.describe "Api::V1::Authors", type: :request do
  describe "GET /api/v1/authors" do
    it "returns all authors" do
      author1 = create(:author)
      author2 = create(:author)

      get '/api/v1/authors'

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(2)
    end
  end

  describe "GET /api/v1/authors/:id" do
    it "returns a specific author" do
      author = create(:author)

      get "/api/v1/authors/#{author.id}"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(author.id)
    end

    it "returns 404 when author not found" do
      get '/api/v1/authors/99999'

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)['error']).to eq('Author not found')
    end
  end

  describe "POST /api/v1/authors" do
    it "creates a new author" do
      post '/api/v1/authors', params: { author: { name: 'Test Author', nationality: 'Brazilian' } }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['name']).to eq('Test Author')
    end

    it "returns error when name is missing" do
      post '/api/v1/authors', params: { author: { nationality: 'Brazilian' } }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)).to have_key('errors')
    end
  end

  describe "PATCH /api/v1/authors/:id" do
    it "updates an author" do
      author = create(:author)

      patch "/api/v1/authors/#{author.id}", params: { author: { name: 'Updated Name' } }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['name']).to eq('Updated Name')
    end

    it "returns 404 when author not found" do
      patch '/api/v1/authors/99999', params: { author: { name: 'Updated' } }

      expect(response).to have_http_status(:not_found)
    end

    it "returns error with invalid data" do
      author = create(:author)

      patch "/api/v1/authors/#{author.id}", params: { author: { name: '' } }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "DELETE /api/v1/authors/:id" do
    it "deletes an author" do
      author = create(:author)

      delete "/api/v1/authors/#{author.id}"

      expect(response).to have_http_status(:no_content)
    end

    it "returns 404 when author not found" do
      delete '/api/v1/authors/99999'

      expect(response).to have_http_status(:not_found)
    end
  end
end

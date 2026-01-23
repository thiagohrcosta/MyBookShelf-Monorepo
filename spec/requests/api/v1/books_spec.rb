require 'swagger_helper'

describe 'Books API', type: :request do
  path '/api/v1/books' do
    get 'List all books' do
      tags 'Books'
      produces 'application/json'
      parameter name: :page, in: :query, type: :integer, description: 'Page number'

      response '200', 'Books retrieved successfully' do
        let(:page) { 1 }
        run_test!
      end
    end

    post 'Create a book' do
      tags 'Books'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :Authorization, in: :header, type: :string, description: 'Bearer token'
      parameter name: :book, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          original_title: { type: :string },
          summary: { type: :string },
          pages: { type: :integer },
          edition: { type: :string },
          release_year: { type: :integer },
          author_id: { type: :integer },
          publisher_id: { type: :integer }
        },
        required: [ 'title', 'edition', 'author_id', 'publisher_id' ]
      }

      response '201', 'Book created successfully' do
        let(:user) { create(:user) }
        let(:author) { create(:author) }
        let(:publisher) { create(:publisher) }
        let(:book) { { title: 'New Book', edition: 'PT-BR', author_id: author.id, publisher_id: publisher.id } }
        let(:Authorization) { "Bearer #{JsonWebToken.encode(user_id: user.id, role: user.role)}" }
        run_test!
      end

      response '422', 'Invalid parameters' do
        let(:user) { create(:user) }
        let(:book) { { title: nil } }
        let(:Authorization) { "Bearer #{JsonWebToken.encode(user_id: user.id, role: user.role)}" }
        run_test!
      end
    end
  end

  path '/api/v1/books/{id}' do
    get 'Get a book by ID' do
      tags 'Books'
      produces 'application/json'
      parameter name: :id, in: :path, type: :integer, description: 'Book ID'

      response '200', 'Book retrieved successfully' do
        let(:book) { create(:book) }
        let(:id) { book.id }
        run_test!
      end

      response '404', 'Book not found' do
        let(:id) { 9999 }
        run_test!
      end
    end

    patch 'Update a book' do
      tags 'Books'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :id, in: :path, type: :integer, description: 'Book ID'
      parameter name: :Authorization, in: :header, type: :string, description: 'Bearer token'
      parameter name: :book, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          summary: { type: :string },
          pages: { type: :integer }
        }
      }

      response '200', 'Book updated successfully' do
        let(:user) { create(:user) }
        let(:book_obj) { create(:book) }
        let(:id) { book_obj.id }
        let(:book) { { title: 'Updated Title' } }
        let(:Authorization) { "Bearer #{JsonWebToken.encode(user_id: user.id, role: user.role)}" }
        run_test!
      end
    end

    delete 'Delete a book' do
      tags 'Books'
      parameter name: :id, in: :path, type: :integer, description: 'Book ID'
      parameter name: :Authorization, in: :header, type: :string, description: 'Bearer token'

      response '204', 'Book deleted successfully' do
        let(:admin) { create(:user, role: 'admin') }
        let(:book_obj) { create(:book) }
        let(:id) { book_obj.id }
        let(:Authorization) { "Bearer #{JsonWebToken.encode(user_id: admin.id, role: admin.role)}" }
        run_test!
      end
    end
  end
end

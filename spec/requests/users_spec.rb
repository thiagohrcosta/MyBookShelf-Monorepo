require 'rails_helper'

RSpec.describe 'Users API', type: :request do
  describe 'POST /api/v1/users/register' do
    it 'creates a new user' do
      post '/api/v1/users/register', params: { user: { full_name: 'Test User', email: 'test@example.com', password: 'password', password_confirmation: 'password' } }
      expect(response).to have_http_status(:created)
    end
  end
end

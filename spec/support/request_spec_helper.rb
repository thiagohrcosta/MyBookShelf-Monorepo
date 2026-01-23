module RequestSpecHelper
  def auth_headers(user = create(:user))
    token = JsonWebToken.encode(user_id: user.id, role: user.role)
    { 'Authorization' => "Bearer #{token}" }
  end
end

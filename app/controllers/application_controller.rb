class ApplicationController < ActionController::API
  attr_reader :current_user

  private

  def authenticate_user!
    token = bearer_token
    return render json: { error: "Unauthorized" }, status: :unauthorized if token.blank?

    decoded_token = JsonWebToken.decode(token)
    @current_user = User.find(decoded_token[:user_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "User not found" }, status: :unauthorized
  rescue JWT::ExpiredSignature
    render json: { error: "Token has expired" }, status: :unauthorized
  rescue JWT::DecodeError
    render json: { error: "Invalid token" }, status: :unauthorized
  end

  def authorize_admin!
    authenticate_user!
    return if performed?
    return if current_user&.admin?

    render json: { error: "Forbidden" }, status: :forbidden
  end

  def bearer_token
    auth_header = request.headers["Authorization"]
    auth_header&.split(" ")&.last
  end
end

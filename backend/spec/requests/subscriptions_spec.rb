require "rails_helper"

describe "Subscriptions API", type: :request do
  include RequestSpecHelper

  describe "GET /api/v1/subscriptions/current" do
    context "when user is not authenticated" do
      it "returns 401 unauthorized" do
        get "/api/v1/subscriptions/current"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when user is authenticated" do
      let(:user) { create(:user) }
      let(:headers) { auth_headers(user).merge("Content-Type" => "application/json") }

      context "when user has an active subscription" do
        before do
          create(:subscription, user: user)
        end

        it "returns the current user's subscription" do
          get "/api/v1/subscriptions/current", headers: headers

          expect(response).to have_http_status(:ok)
          expect(response_body["user_id"]).to eq(user.id)
        end
      end

      context "when user doesn't have a subscription" do
        it "returns 404" do
          get "/api/v1/subscriptions/current", headers: headers
          expect(response).to have_http_status(:not_found)
          expect(response_body["error"]).to eq("Subscription not found")
        end
      end
    end
  end

  describe "GET /api/v1/subscriptions/:id" do
    let(:user) { create(:user) }
    let(:subscription) { create(:subscription, user: user) }
    let(:headers) { auth_headers(user) }

    context "when user is not authenticated" do
      it "returns 401 unauthorized" do
        get "/api/v1/subscriptions/#{subscription.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when authenticated" do
      context "when subscription exists" do
        it "returns the subscription" do
          get "/api/v1/subscriptions/#{subscription.id}", headers: headers
          expect(response).to have_http_status(:ok)
          expect(response_body["id"]).to eq(subscription.id)
        end
      end

      context "when subscription does not exist" do
        it "returns 404" do
          get "/api/v1/subscriptions/99999", headers: headers
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe "POST /api/v1/subscriptions" do
    let(:user) { create(:user) }
    let(:headers) { auth_headers(user).merge("Content-Type" => "application/json") }
    let(:subscription_params) do
      {
        subscription: {
          stripe_id: "sub_#{SecureRandom.hex(8)}",
          status: "active",
          current_period_start: Time.current,
          current_period_end: 1.month.from_now
        }
      }
    end

    context "when user is not authenticated" do
      it "returns 401 unauthorized" do
        post "/api/v1/subscriptions", params: subscription_params
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when user is authenticated" do
      it "creates a new subscription" do
        # Using a new user that doesn't have a subscription yet
        new_user = create(:user)
        new_headers = auth_headers(new_user)

        post "/api/v1/subscriptions", params: subscription_params, headers: new_headers, as: :json

        expect(response).to have_http_status(:created)
        expect(response_body["status"]).to eq("active")
      end
    end
  end

  private

  def response_body
    JSON.parse(response.body)
  end
end

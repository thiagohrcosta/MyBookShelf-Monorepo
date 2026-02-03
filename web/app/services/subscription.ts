import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export interface Subscription {
  id: number;
  user_id: number;
  stripe_id: string;
  status: "active" | "canceled" | "expired";
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface CheckoutSessionResponse {
  url: string;
}

export interface SubscriptionStatus {
  has_active_subscription: boolean;
  is_admin: boolean;
}

export const subscriptionService = {
  async getSubscription(token: string): Promise<Subscription | null> {
    try {
      const response = await axios.get<Subscription>(
        `${API_BASE_URL}/api/v1/subscriptions/current`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createCheckoutSession(token: string): Promise<string> {
    const response = await axios.post<CheckoutSessionResponse>(
      `${API_BASE_URL}/api/v1/checkout_sessions`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.url;
  },

  async getSubscriptionStatus(token: string): Promise<SubscriptionStatus> {
    const response = await axios.get<SubscriptionStatus>(
      `${API_BASE_URL}/api/v1/subscription_status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async cancelSubscription(token: string): Promise<Subscription> {
    const response = await axios.post<Subscription>(
      `${API_BASE_URL}/api/v1/subscriptions/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

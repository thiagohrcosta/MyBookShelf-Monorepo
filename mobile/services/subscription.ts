import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface SubscriptionStatus {
  has_active_subscription: boolean;
  is_admin: boolean;
}

export interface CheckoutSessionResponse {
  url: string;
}

export const subscriptionService = {
  async getSubscriptionStatus(token: string): Promise<SubscriptionStatus> {
    const response = await axios.get<SubscriptionStatus>(`${API_BASE_URL}/api/v1/subscription_status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async createCheckoutSession(token: string): Promise<string> {
    const response = await axios.post<CheckoutSessionResponse>(
      `${API_BASE_URL}/api/v1/checkout_sessions`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.url;
  },
};

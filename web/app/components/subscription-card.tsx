"use client";

import { useState, useEffect } from "react";
import { subscriptionService, Subscription } from "../services/subscription";
import { useAuth } from "../context/auth-context";

export function SubscriptionCard() {
  const { token } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      console.log("[SubscriptionCard] Token available, loading subscription");
      loadSubscription();
    } else {
      console.log("[SubscriptionCard] No token available yet");
    }
  }, [token]);

  async function loadSubscription() {
    try {
      setIsLoading(true);
      setError(null);
      if (!token) {
        console.log("[SubscriptionCard] No token in loadSubscription");
        return;
      }

      console.log("[SubscriptionCard] Fetching subscription...");
      const data = await subscriptionService.getSubscription(token);
      console.log("[SubscriptionCard] Subscription loaded:", data);
      setSubscription(data);
    } catch (err) {
      console.error("[SubscriptionCard] Error loading subscription:", err);
      setError("Failed to load subscription");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubscribe() {
    try {
      setIsCreatingCheckout(true);
      setError(null);
      if (!token) {
        setError("Authentication required");
        return;
      }

      const checkoutUrl = await subscriptionService.createCheckoutSession(token);
      window.location.href = checkoutUrl;
    } catch (err) {
      setError("Failed to create checkout session");
      console.error(err);
      setIsCreatingCheckout(false);
    }
  }

  async function handleCancelSubscription() {
    if (!window.confirm("Are you sure you want to cancel your subscription? You will lose access to premium features.")) {
      return;
    }

    try {
      setIsCanceling(true);
      setError(null);
      if (!token) {
        setError("Authentication required");
        return;
      }

      await subscriptionService.cancelSubscription(token);

      // Reload subscription data
      await loadSubscription();
      setError(null);
    } catch (err) {
      setError("Failed to cancel subscription");
      console.error(err);
    } finally {
      setIsCanceling(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  const isActive = subscription?.status === "active";
  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif text-gray-800">Subscription</h2>
          <p className="text-gray-600 mt-1">
            Manage your premium membership
          </p>
        </div>
        {isActive && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Active
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {!subscription ? (
        <div className="space-y-4">
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Premium Features
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">✓</span>
                <span>Create unlimited book reviews</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">✓</span>
                <span>Access to premium content</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">✓</span>
                <span>Ad-free experience</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={isCreatingCheckout}
            className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingCheckout ? "Loading..." : "Subscribe Now"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {isActive && (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Premium Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Create unlimited book reviews</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Access to premium content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Ad-free experience</span>
                </li>
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Status</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                {isActive ? "✓ Active" : "Inactive"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                {isActive ? "Monthly Price" : "Price"}
              </p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">$3.99</p>
              {isActive && <p className="text-xs text-gray-500 mt-1">per month</p>}
            </div>
          </div>

          {periodEnd && isActive && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Next Renewal</p>
              <p className="text-lg font-semibold text-green-800 mt-1">
                {periodEnd.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Your subscription will automatically renew on this date
              </p>
            </div>
          )}

          {isActive && (
            <button
              onClick={handleCancelSubscription}
              disabled={isCanceling}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCanceling ? "Canceling..." : "Cancel Subscription"}
            </button>
          )}

          {periodEnd && !isActive && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Expired on</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {periodEnd.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {subscription.status === "canceled" && (
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Your subscription has been canceled
                </p>
              </div>
              <button
                onClick={handleSubscribe}
                disabled={isCreatingCheckout}
                className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingCheckout ? "Loading..." : "Reactivate Subscription"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

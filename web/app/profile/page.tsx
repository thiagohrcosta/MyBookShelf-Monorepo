"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { SubscriptionCard } from "../components/subscription-card";
import { useAuth } from "../context/auth-context";
import { subscriptionService, Subscription } from "../services/subscription";

interface ProfileData {
  id: number;
  full_name?: string | null;
  email: string;
  role?: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { authRequest, isAuthenticated, isLoading, token } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchProfile() {
      if (!isAuthenticated) {
        setIsFetching(false);
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const response = await authRequest<ProfileData>({
          url: `${baseUrl}/api/v1/users/profile`,
          method: "GET"
        });

        setProfile(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.replace("/login");
          return;
        }
        setError("Não foi possível carregar seu perfil.");
      } finally {
        setIsFetching(false);
      }
    }

    if (!isLoading) {
      fetchProfile();
    }
  }, [authRequest, isAuthenticated, isLoading, router]);

  useEffect(() => {
    async function fetchSubscription() {
      if (!token) {
        console.log("No token available");
        setIsLoadingSubscription(false);
        return;
      }

      try {
        console.log("Loading subscription with token:", token.substring(0, 20) + "...");
        const data = await subscriptionService.getSubscription(token);
        console.log("Subscription loaded:", data);
        setSubscription(data);
      } catch (err) {
        console.error("Failed to load subscription", err);
        setSubscription(null);
      } finally {
        setIsLoadingSubscription(false);
      }
    }

    // Only fetch when we have a token and finished loading
    if (token && !isLoading) {
      fetchSubscription();
    } else if (!token) {
      setIsLoadingSubscription(false);
    }
  }, [token, isLoading]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-2">
              See your personal information and keep your data up to date.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8">
            {isFetching ? (
              <div className="text-gray-600">Carregando perfil...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : profile ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Nome completo</p>
                  <p className="text-lg font-medium text-gray-800">
                    {profile.full_name || "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p className="text-lg font-medium text-gray-800">{profile.email}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Perfil</p>
                    <p className="text-lg font-medium text-gray-800">
                      {profile.role || "user"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cadastro</p>
                    <p className="text-lg font-medium text-gray-800">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString("pt-BR")
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">Nenhum dado encontrado.</div>
            )}
          </div>

          {!isLoadingSubscription && subscription && subscription.status === "active" && (
            <div className="bg-green-50 border border-green-200 rounded-2xl shadow-sm p-8 mt-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif text-gray-800">Your Subscription</h2>
                  <p className="text-gray-600 mt-1">Active subscription details</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Monthly Price</p>
                  <p className="text-2xl font-semibold text-green-600 mt-2">$3.99</p>
                  <p className="text-xs text-gray-500 mt-1">per month</p>
                </div>

                {subscription.current_period_end && (
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide">Next Renewal</p>
                    <p className="text-lg font-semibold text-gray-800 mt-2">
                      {new Date(subscription.current_period_end).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Billing Type</p>
                  <p className="text-lg font-semibold text-gray-800 mt-2">Monthly</p>
                  <p className="text-xs text-gray-500 mt-1">Auto-renewing</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200 mt-4">
                <p className="text-sm text-green-800">
                  ✓ You have full access to all premium features including unlimited book reviews, premium content, and priority support.
                </p>
              </div>
            </div>
          )}

          <SubscriptionCard />
        </div>
      </main>      <Footer />    </div>
  );
}

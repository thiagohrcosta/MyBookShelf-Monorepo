"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export default function SuccessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give Stripe a moment to process the webhook
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-72 w-full">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
            {isLoading ? (
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                </div>
                <p className="text-gray-600 text-sm">Processing your subscription...</p>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 rounded-full p-3">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-serif text-gray-800 leading-tight">
                    Subscription Successful!
                  </h1>
                  <p className="text-xs text-gray-600 mt-2">
                    Thank you for your purchase
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                  <p className="font-medium mb-1">✓ Subscription Active</p>
                  <div className="space-y-0.5 text-left text-xs">
                    <p>✓ Unlimited reviews</p>
                    <p>✓ Premium content</p>
                    <p>✓ Priority support</p>
                  </div>
                </div>

                <p className="text-gray-600 text-xs">
                  Check your email for confirmation details.
                </p>

                <div className="space-y-2 pt-1">
                  <Link
                    href="/profile"
                    className="block w-full px-3 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-xs"
                  >
                    View Subscription
                  </Link>
                  <Link
                    href="/books"
                    className="block w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors text-xs"
                  >
                    Browse Books
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

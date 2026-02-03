"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <div className="bg-yellow-100 rounded-full p-3">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-serif text-gray-800 mb-1">
                  Subscription Cancelled
                </h1>
                <p className="text-xs text-gray-600">
                  Your checkout was cancelled and you were not charged
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  If you have any questions or need assistance, please{" "}
                  <a href="mailto:support@mybookshelf.com" className="underline font-medium">
                    contact us
                  </a>
                  .
                </p>
              </div>

              <p className="text-gray-600 text-xs leading-relaxed">
                You can return to your profile and try again whenever you're ready.
              </p>

              <div className="space-y-2 pt-2">
                <Link
                  href="/profile"
                  className="block w-full px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm"
                >
                  Back to Profile
                </Link>
                <Link
                  href="/"
                  className="block w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

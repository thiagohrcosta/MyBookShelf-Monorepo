"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Header } from "../components/header";
import { useAuth } from "../context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message ?? "Invalid email or password.");
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-serif text-gray-800 mb-4">Welcome back</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Sign in to keep your bookshelf up to date, track your reading stats, and
              share reviews with your friends.
            </p>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-900" />
                <p>Organize your personal library in one place.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-900" />
                <p>Track reading goals with beautiful insights.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-900" />
                <p>Review books and discover new favorites.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign in</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900/30"
                  required
                />
              </div>
              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  Remember me
                </label>
                <Link href="#" className="text-amber-900 hover:text-amber-950">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-900 text-white rounded-lg py-3 font-medium hover:bg-amber-950 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-600">
              New here?{" "}
              <Link href="#" className="text-amber-900 hover:text-amber-950 font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

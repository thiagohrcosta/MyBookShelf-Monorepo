"use client";

import { useEffect, useState } from "react";
import { User, BookOpen, MessageSquare } from "lucide-react";
import axios from "axios";

interface RecentUser {
  id: number;
  full_name: string;
  email: string;
  books_count: number;
  reviews_count: number;
  created_at: string;
}

export function RecentlyRated() {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    async function fetchRecentUsers() {
      try {
        const response = await axios.get<{ recent_users: RecentUser[] }>(
          `${baseUrl}/api/v1/platform_statistics`
        );
        setUsers(response.data.recent_users || []);
      } catch (error) {
        console.error("Error fetching recent users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentUsers();
  }, [baseUrl]);

  return (
    <section className="px-8 py-8">
      <h2 className="text-2xl font-serif text-gray-800 mb-6">New Members</h2>

      {loading ? (
        <div className="text-gray-600 text-sm">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-600 text-sm">No new members yet</div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user.full_name.substring(0, 1).toUpperCase()}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-1">{user.full_name}</h3>
                <p className="text-xs text-gray-500 mb-2">{user.email}</p>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{user.books_count} {user.books_count === 1 ? "book" : "books"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{user.reviews_count} {user.reviews_count === 1 ? "review" : "reviews"}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span>{user.created_at}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

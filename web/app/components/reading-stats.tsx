"use client";

import { User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface PlatformStats {
  total_books: number;
  total_pages: number;
  most_read_author: {
    id: number;
    name: string;
    read_count: number;
  } | null;
}

export function ReadingStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const response = await axios.get<PlatformStats>(
          `${baseUrl}/api/v1/platform_statistics`
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching platform stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <section className="px-8 py-6">
        <h2 className="text-2xl font-serif text-gray-800 mb-6">Reading Stats</h2>
        <div className="text-gray-600">Loading...</div>
      </section>
    );
  }

  return (
    <section className="px-8 py-6">
      <h2 className="text-2xl font-serif text-gray-800 mb-6">Reading Stats</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {stats?.total_books || 0}
          </div>
          <div className="text-sm text-gray-600">Books registered</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {stats?.total_pages?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-600">Pages in total</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-sm font-medium text-gray-800 mb-1">
            {stats?.most_read_author?.name || "N/A"}
          </div>
          <div className="text-xs text-gray-600">Most read author</div>
        </div>
      </div>
    </section>
  );
}

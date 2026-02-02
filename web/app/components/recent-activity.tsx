"use client";

import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Activity {
  id: number;
  user_name: string;
  book_title: string;
  author_name: string;
  action: string;
  date: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const response = await axios.get<{ recent_activities?: Activity[] }>(
          `${baseUrl}/api/v1/platform_statistics`
        );
        setActivities(response.data.recent_activities || []);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivities();
  }, []);

  return (
    <section className="px-8 py-8">
      <h2 className="text-2xl font-serif text-gray-800 mb-6">Recent Activity</h2>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {isLoading ? (
          <div className="px-6 py-4 text-gray-600">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="px-6 py-4 text-gray-600">No recent activity</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-800 rounded flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">
                  {activity.user_name} {activity.action.toLowerCase()} &quot;{activity.book_title}&quot;
                </span>
              </div>
              <span className="text-sm text-gray-500">{activity.date}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

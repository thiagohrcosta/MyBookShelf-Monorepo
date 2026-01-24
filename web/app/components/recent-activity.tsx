import { BookOpen } from "lucide-react";

const activities = [
  { text: 'You added "The Brothers Karamazov"', date: "Feb 8" },
  { text: 'Started reading "Sapiens"', date: "Feb 6" },
  { text: 'Added "The Plague" to your library', date: "Feb 1" },
  { text: 'Finished reading "Dune"', date: "Jan 28" },
  { text: 'Added "To Kill a Mockingbird"', date: "Jan 25" },
];

export function RecentActivity() {
  return (
    <section className="px-8 py-8">
      <h2 className="text-2xl font-serif text-gray-800 mb-6">Recent Activity</h2>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-800 rounded flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-700">{activity.text}</span>
            </div>
            <span className="text-sm text-gray-500">{activity.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

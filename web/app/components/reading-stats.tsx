import { Heart, User } from "lucide-react";

export function ReadingStats() {
  return (
    <section className="px-8 py-6">
      <h2 className="text-2xl font-serif text-gray-800 mb-6">Reading Stats</h2>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">24</div>
          <div className="text-sm text-gray-600">Books read</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">8,120</div>
          <div className="text-sm text-gray-600">Pages read</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center flex flex-col items-center">
          <Heart className="w-10 h-10 text-red-500 fill-red-500 mb-2" />
          <div className="text-sm font-medium text-gray-800 mb-1">Fiction</div>
          <div className="text-xs text-gray-600">Most read genre</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-sm font-medium text-gray-800 mb-1">George Orwell</div>
          <div className="text-xs text-gray-600">Most read author</div>
        </div>
      </div>
    </section>
  );
}

import { BookOpen, User } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-gray-800" />
        <span className="text-xl font-semibold text-gray-800">My Bookshelf</span>
      </div>

      <nav className="flex items-center gap-8">
        <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
          My Library
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
          Statistics
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
          Profile
        </a>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <User className="w-5 h-5 text-gray-700" />
        </button>
      </nav>
    </header>
  );
}

import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-stone-200 mt-12">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-gray-800" />
              <span className="text-xl font-semibold text-gray-800">My Bookshelf</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Organize, track, and remember all the books you&apos;ve read throughout the years.
              Your personal library, your story.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  My Library
                </Link>
              </li>
              <li>
                <Link href="/statistics" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Statistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/books/new" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Add Book
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Browse Reviews
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} My Bookshelf. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

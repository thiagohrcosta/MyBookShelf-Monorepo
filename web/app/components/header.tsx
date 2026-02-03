"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookOpen, User, Menu, X } from "lucide-react";
import { useAuth } from "../context/auth-context";

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current || !(event.target instanceof Node)) return;
      if (!menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  async function handleLogout() {
    await logout();
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-gray-800" />
            <span className="text-xl font-semibold text-gray-800">My Bookshelf</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/reviews" className="text-gray-700 hover:text-gray-900 transition-colors">
            Reviews
          </Link>
          {isAuthenticated ? (
            <Link href="/library" className="text-gray-700 hover:text-gray-900 transition-colors">
              My Library
            </Link>
          ) : (
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              My Library
            </a>
          )}
          {isAuthenticated ? (
            <Link href="/statistics" className="text-gray-700 hover:text-gray-900 transition-colors">
              Statistics
            </Link>
          ) : (
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Statistics
            </a>
          )}
          {isAuthenticated ? (
            <Link href="/books/new" className="text-gray-700 hover:text-gray-900 transition-colors">
              Add Book
            </Link>
          ) : null}
          {isAuthenticated ? (
            <Link href="/profile" className="text-gray-700 hover:text-gray-900 transition-colors">
              Profile
            </Link>
          ) : null}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open user menu"
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <User className="w-5 h-5 text-gray-700" />
              </button>
              {isMenuOpen ? (
                <div
                  className="absolute right-0 mt-2 w-40 rounded-lg border border-stone-200 bg-white shadow-lg z-50"
                  role="menu"
                >
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-stone-50"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go to login"
            >
              <User className="w-5 h-5 text-gray-700" />
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/reviews"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Reviews
            </Link>
            {isAuthenticated ? (
              <Link
                href="/library"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Library
              </Link>
            ) : null}
            {isAuthenticated ? (
              <Link
                href="/statistics"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Statistics
              </Link>
            ) : null}
            {isAuthenticated ? (
              <Link
                href="/books/new"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Add Book
              </Link>
            ) : null}
            {isAuthenticated ? (
              <Link
                href="/profile"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            ) : null}
            {isAuthenticated ? (
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

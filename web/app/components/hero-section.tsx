import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative px-8 py-20 bg-gradient-to-br from-stone-50 to-amber-50">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div>
          <h1 className="text-6xl font-serif text-gray-800 mb-6 leading-tight">
            Your bookshelf. Your story.
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Organize, track, and remember all the books<br />
            you've read throughout the years.
          </p>
          <div className="flex gap-4">
            <Link
              href="/books/new"
              className="px-6 py-3 bg-amber-900 text-white rounded hover:bg-amber-950 transition-colors font-medium"
            >
              Add a book I've read
            </Link>
            <Link
              href="/library"
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
            >
              View my library
            </Link>
          </div>
        </div>

        {/* Right banner image */}
        <div className="flex items-center justify-end -mr-8">
          <Image
            src="/bannerhome.png"
            alt="Bookshelf banner"
            width={700}
            height={500}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}

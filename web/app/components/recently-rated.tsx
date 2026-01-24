import { Star } from "lucide-react";

const ratedBooks = [
  {
    title: "The Picture of Dorian Gray",
    author: "Your Blensky",
    rating: 5,
    date: "Feb 10",
    cover: "/covers/dorian.jpg",
  },
  {
    title: "Brave New World",
    author: "Brave the plays",
    rating: 5,
    date: "Feb 5",
    cover: "/covers/brave.jpg",
  },
  {
    title: "Norwegian Wood",
    author: "Quite da slave wane",
    rating: 4.5,
    date: "Jan 26",
    cover: "/covers/norwegian.jpg",
  },
  {
    title: "I, Robot",
    author: "Famgl that plays",
    rating: 4.5,
    date: "Jan 20",
    cover: "/covers/robot.jpg",
  },
];

export function RecentlyRated() {
  return (
    <section className="px-8 py-8">
      <h2 className="text-2xl font-serif text-gray-800 mb-6">Recently Rated</h2>

      <div className="space-y-4">
        {ratedBooks.map((book, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-12 h-16 bg-gradient-to-br from-stone-400 to-stone-600 rounded shadow-sm flex-shrink-0"></div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-1">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{book.author}</p>

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(book.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : i < book.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{book.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

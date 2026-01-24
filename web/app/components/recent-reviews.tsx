import { Star } from "lucide-react";

const reviews = [
  {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    rating: 5,
    date: "Feb 9",
    excerpt: "The existential dread runs deep through this book. Ivan really did crimes Dimitri Audt, like I ge... A grandson immortalizado...",
  },
  {
    title: "A Farewell to Arms",
    author: "Ernest Hemingway",
    rating: 4,
    date: "Feb 7",
    excerpt: "Thas age enaola in how hua gill hem reajimy eyeainggs off sonar Rusaism wish mas non-... Brave issune drama as sca...",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    rating: 5,
    date: "Feb 5",
    excerpt: "Continuity an aarmaktus scenaa omarausharhuet arma oezaroitsho liust beo thon en silique. Pridden quis essential la genus...",
  },
  {
    title: "Vidas Secas",
    author: "Graciliano Ramos",
    rating: 5,
    date: "Feb 3",
    excerpt: "This ai leada too portis emis sinca betting gravean geniustust while equius har vavi... Paemetion esermontotales...",
  },
];

export function RecentReviews() {
  return (
    <section className="px-8 py-6">
      <h2 className="text-2xl font-serif text-gray-800 mb-6">Recent Reviews</h2>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-800">{review.title}</h3>
                  <p className="text-sm text-gray-600">{review.author}</p>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>

              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-700 line-clamp-2">
                {review.excerpt}
              </p>
              <button className="text-sm text-gray-500 hover:text-gray-700 mt-1">
                Read more →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

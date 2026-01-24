interface BookHeaderProps {
  title: string;
  author: string;
  originalTitle: string;
  releaseYear: number;
  genre: string;
  category: string;
}

export function BookHeader({
  title,
  author,
  originalTitle,
  releaseYear,
  genre,
  category,
}: BookHeaderProps) {
  return (
    <div>
      <h1 className="text-4xl font-serif text-gray-900 mb-2">{title}</h1>
      <p className="text-lg text-gray-700 mb-4">{author}</p>

      {originalTitle && (
        <p className="text-sm text-gray-600 mb-4 italic">
          Original: <span className="font-medium">{originalTitle}</span>
        </p>
      )}

      <div className="flex gap-4 text-sm text-gray-600">
        <span>Published {releaseYear}</span>
        <span className="text-gray-400">•</span>
        <span>Genre: {genre}</span>
        <span className="text-gray-400">•</span>
        <span>{category}</span>
      </div>
    </div>
  );
}

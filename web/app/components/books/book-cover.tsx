interface BookCoverProps {
  coverUrl?: string;
  title: string;
  author: string;
}

export function BookCover({ coverUrl, title, author }: BookCoverProps) {
  return (
    <div className="sticky top-8">
      <div className="w-full aspect-[2/3] bg-gradient-to-br from-stone-400 to-stone-600 rounded-lg shadow-lg overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`${title} by ${author}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white p-4 text-center">
            <span className="font-serif text-lg">{title}</span>
          </div>
        )}
      </div>
    </div>
  );
}

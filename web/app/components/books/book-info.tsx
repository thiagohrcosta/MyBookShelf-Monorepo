interface BookInfoProps {
  pages: number;
  edition: string;
  isbn: string;
  language: string;
  publisher: string;
}

const languageNames: Record<string, string> = {
  pt_br: "Portuguese (Brazil)",
  pt: "Portuguese",
  en: "English",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  de: "German",
  ja: "Japanese",
  zh_cn: "Chinese (Simplified)",
  zh_tw: "Chinese (Traditional)",
  ru: "Russian",
};

export function BookInfo({
  pages,
  edition,
  isbn,
  language,
  publisher,
}: BookInfoProps) {
  const languageName = languageNames[language] || language;

  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="text-gray-600">
          <span className="font-medium">Pages:</span> {pages}
        </p>
      </div>
      <div>
        <p className="text-gray-600">
          <span className="font-medium">Edition:</span> {edition}
        </p>
      </div>
      <div>
        <p className="text-gray-600">
          <span className="font-medium">Language:</span> {languageName}
        </p>
      </div>
      <div>
        <p className="text-gray-600">
          <span className="font-medium">Publisher:</span> {publisher}
        </p>
      </div>
      <div>
        <p className="text-gray-600">
          <span className="font-medium">ISBN:</span> {isbn}
        </p>
      </div>
    </div>
  );
}

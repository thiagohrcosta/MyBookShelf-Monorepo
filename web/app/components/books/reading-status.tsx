import { BookOpen, CheckCircle } from "lucide-react";

export function ReadingStatus() {
  // Mock data - será substituído por dados reais da API
  const status = "Read";
  const dateRead = "January 12, 2026";

  return (
    <div className="flex items-center gap-4 bg-green-50 p-4 rounded-lg">
      <CheckCircle className="text-green-600" size={24} />
      <div>
        <p className="font-medium text-green-900">
          Status: <span className="text-green-700">{status}</span>
        </p>
        <p className="text-sm text-green-700">Date read: {dateRead}</p>
      </div>
    </div>
  );
}

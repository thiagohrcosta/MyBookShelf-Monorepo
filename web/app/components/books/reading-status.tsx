import { CheckCircle } from "lucide-react";

interface ReadingStatusProps {
  status: string;
  readMonth?: number | null;
  readYear?: number | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  acquired: { label: "Owned", color: "green" },
  reading: { label: "Reading", color: "blue" },
  finished: { label: "Finished", color: "purple" },
  abandoned: { label: "Abandoned", color: "rose" },
  wishlist: { label: "Wishlist", color: "amber" }
};

export function ReadingStatus({ status, readMonth, readYear }: ReadingStatusProps) {
  const statusConfig = STATUS_LABELS[status] || { label: status, color: "gray" };

  const formatDate = () => {
    if (!readMonth || !readYear) return null;

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return `${months[readMonth - 1]} ${readYear}`;
  };

  const dateRead = formatDate();

  return (
    <div className={`flex items-center gap-4 bg-${statusConfig.color}-50 p-4 rounded-lg border border-${statusConfig.color}-200`}>
      <CheckCircle className={`text-${statusConfig.color}-600`} size={24} />
      <div>
        <p className={`font-medium text-${statusConfig.color}-900`}>
          Status: <span className={`text-${statusConfig.color}-700`}>{statusConfig.label}</span>
        </p>
        {dateRead && (
          <p className={`text-sm text-${statusConfig.color}-700`}>Date read: {dateRead}</p>
        )}
      </div>
    </div>
  );
}

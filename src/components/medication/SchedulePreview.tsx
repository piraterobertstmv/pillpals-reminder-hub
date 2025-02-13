
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface SchedulePreviewProps {
  name: string;
  times: string[];
  duration: string;
  durationType: "days" | "weeks" | "months";
}

export const SchedulePreview = ({ name, times, duration, durationType }: SchedulePreviewProps) => {
  return (
    <Card className="p-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Schedule Preview</h3>
      <div className="space-y-2">
        <p className="text-gray-600">Medication: {name}</p>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <p className="text-gray-600">Times: {times.join(", ")}</p>
        </div>
        <p className="text-gray-600">Duration: {duration} {durationType}</p>
      </div>
    </Card>
  );
};

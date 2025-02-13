
import { Bell, BellOff, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Medication } from "@/types/medication";
import { formatNextReminder } from "@/lib/date-utils";

type MedicationCardProps = {
  medication: Medication;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const MedicationCard = ({ medication, onEdit, onDelete }: MedicationCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg text-gray-900">
            {medication.name}
          </h3>
          {medication.image_url && (
            <img
              src={medication.image_url}
              alt={`${medication.name} medication`}
              className="w-16 h-16 object-cover rounded-md mt-2"
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(medication.id)}
            aria-label={`Edit ${medication.name}`}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(medication.id)}
            aria-label={`Delete ${medication.name}`}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-gray-500">Dosage:</dt>
        <dd>{medication.dosage}</dd>
        <dt className="text-gray-500">Frequency:</dt>
        <dd>{medication.frequency}</dd>
        <dt className="text-gray-500">Time of Day:</dt>
        <dd>{medication.time_of_day.join(", ")}</dd>
        <dt className="text-gray-500">Next Reminder:</dt>
        <dd className="flex items-center gap-1">
          {medication.reminder_enabled ? (
            <>
              <Bell className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span>{formatNextReminder(medication.next_reminder)}</span>
            </>
          ) : (
            <>
              <BellOff className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <span className="text-gray-500">Reminders disabled</span>
            </>
          )}
        </dd>
      </dl>
    </div>
  );
};


import { Trash2, Edit, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  notes: string | null;
  next_reminder: string | null;
  reminder_enabled: boolean;
  image_url?: string;
};

type MedicationListProps = {
  medications: Medication[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const MedicationList = ({ medications, onEdit, onDelete }: MedicationListProps) => {
  const isMobile = useIsMobile();
  
  const formatNextReminder = (date: string | null) => {
    if (!date) return 'No reminder set';
    return new Date(date).toLocaleString();
  };

  if (isMobile) {
    return (
      <div className="space-y-4 p-4" role="region" aria-label="Medications list">
        {medications.map((medication) => (
          <div
            key={medication.id}
            className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
          >
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
        ))}
        {medications.length === 0 && (
          <div 
            className="text-center py-8 text-gray-500"
            role="status"
            aria-live="polite"
          >
            No medications found. Add your first medication to get started.
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="w-full overflow-auto rounded-md" 
      role="region" 
      aria-label="Medications list"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Name</TableHead>
            <TableHead className="min-w-[100px]">Dosage</TableHead>
            <TableHead className="min-w-[120px]">Frequency</TableHead>
            <TableHead className="min-w-[150px]">Time of Day</TableHead>
            <TableHead className="min-w-[200px]">Next Reminder</TableHead>
            <TableHead className="min-w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((medication) => (
            <TableRow key={medication.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {medication.name}
                  {medication.image_url && (
                    <img
                      src={medication.image_url}
                      alt={`${medication.name} medication`}
                      className="w-8 h-8 object-cover rounded-md"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>{medication.dosage}</TableCell>
              <TableCell>{medication.frequency}</TableCell>
              <TableCell className="whitespace-nowrap">
                {medication.time_of_day.join(", ")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {medication.reminder_enabled ? (
                    <>
                      <Bell 
                        className="h-4 w-4 text-green-500" 
                        aria-hidden="true"
                      />
                      <span>{formatNextReminder(medication.next_reminder)}</span>
                    </>
                  ) : (
                    <>
                      <BellOff 
                        className="h-4 w-4 text-gray-400" 
                        aria-hidden="true"
                      />
                      <span className="text-gray-500">Reminders disabled</span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
          {medications.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={6} 
                className="h-24 text-center text-gray-500"
                role="status"
                aria-live="polite"
              >
                No medications found. Add your first medication to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

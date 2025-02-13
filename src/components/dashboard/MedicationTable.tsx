
import { Bell, BellOff, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Medication } from "@/types/medication";
import { formatNextReminder } from "@/lib/date-utils";

type MedicationTableProps = {
  medications: Medication[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const MedicationTable = ({ medications, onEdit, onDelete }: MedicationTableProps) => {
  return (
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
                    <Bell className="h-4 w-4 text-green-500" aria-hidden="true" />
                    <span>{formatNextReminder(medication.next_reminder)}</span>
                  </>
                ) : (
                  <>
                    <BellOff className="h-4 w-4 text-gray-400" aria-hidden="true" />
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
  );
};

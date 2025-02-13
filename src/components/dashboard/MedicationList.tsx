
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

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  notes: string | null;
  next_reminder: string | null;
  reminder_enabled: boolean;
};

type MedicationListProps = {
  medications: Medication[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const MedicationList = ({ medications, onEdit, onDelete }: MedicationListProps) => {
  const formatNextReminder = (date: string | null) => {
    if (!date) return 'No reminder set';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="w-full overflow-auto rounded-md border">
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
              <TableCell className="font-medium">{medication.name}</TableCell>
              <TableCell>{medication.dosage}</TableCell>
              <TableCell>{medication.frequency}</TableCell>
              <TableCell className="whitespace-nowrap">
                {medication.time_of_day.join(", ")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {medication.reminder_enabled ? (
                    <>
                      <Bell className="h-4 w-4 text-green-500" />
                      <span>{formatNextReminder(medication.next_reminder)}</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="h-4 w-4 text-gray-400" />
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
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit medication</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(medication.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete medication</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {medications.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No medications found. Add your first medication to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

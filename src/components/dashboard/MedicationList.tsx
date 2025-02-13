
import { Trash2, Edit } from "lucide-react";
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
};

type MedicationListProps = {
  medications: Medication[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const MedicationList = ({ medications, onEdit, onDelete }: MedicationListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Time of Day</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((medication) => (
            <TableRow key={medication.id}>
              <TableCell className="font-medium">{medication.name}</TableCell>
              <TableCell>{medication.dosage}</TableCell>
              <TableCell>{medication.frequency}</TableCell>
              <TableCell>{medication.time_of_day.join(", ")}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(medication.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(medication.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          )TableBody>
        </TableBody>
      </Table>
    </div>
  );
};


export type Medication = {
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

export type MedicationListProps = {
  medications: Medication[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

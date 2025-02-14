
export interface TimeSlot {
  time: string;
  selected: boolean;
  days: string[];
}

export interface MedicationFormData {
  name: string;
  dosesPerDay: string;
  hoursBetween: string;
  duration: string;
  durationType: "days" | "weeks" | "months";
}

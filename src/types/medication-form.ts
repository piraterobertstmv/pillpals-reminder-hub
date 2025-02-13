
export interface TimeSlot {
  time: string;
  selected: boolean;
}

export interface MedicationFormData {
  name: string;
  hoursBetween: string;
  duration: string;
  durationType: "days" | "weeks" | "months";
}

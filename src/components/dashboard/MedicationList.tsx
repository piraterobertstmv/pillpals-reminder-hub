
import { useIsMobile } from "@/hooks/use-mobile";
import { MedicationCard } from "./MedicationCard";
import { MedicationTable } from "./MedicationTable";
import type { MedicationListProps } from "@/types/medication";

export const MedicationList = ({ medications, onEdit, onDelete }: MedicationListProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4 p-4" role="region" aria-label="Medications list">
        {medications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            onEdit={onEdit}
            onDelete={onDelete}
          />
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
      <MedicationTable
        medications={medications}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MedicationFormData } from "@/types/medication-form";

interface MedicationNameStepProps {
  formData: MedicationFormData;
  setFormData: (data: MedicationFormData) => void;
  onNext: () => void;
}

export const MedicationNameStep = ({ formData, setFormData, onNext }: MedicationNameStepProps) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="name">Medication Name</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder="Enter medication name"
        className="w-full"
      />
      <Button 
        onClick={onNext}
        disabled={!formData.name}
        className="w-full mt-4"
      >
        Next
      </Button>
    </div>
  );
};

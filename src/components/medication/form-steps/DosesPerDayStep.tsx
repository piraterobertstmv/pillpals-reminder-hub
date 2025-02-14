
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MedicationFormData } from "@/types/medication-form";

interface DosesPerDayStepProps {
  formData: MedicationFormData;
  setFormData: (data: MedicationFormData) => void;
  onBack: () => void;
  onNext: () => void;
}

export const DosesPerDayStep = ({ 
  formData, 
  setFormData, 
  onBack,
  onNext 
}: DosesPerDayStepProps) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="dosesPerDay">How many doses per day?</Label>
      <Input
        id="dosesPerDay"
        type="number"
        min="1"
        max="24"
        value={formData.dosesPerDay}
        onChange={(e) => setFormData({ ...formData, dosesPerDay: e.target.value })}
        required
        placeholder="Number of doses per day"
      />
      <div className="flex space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!formData.dosesPerDay}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

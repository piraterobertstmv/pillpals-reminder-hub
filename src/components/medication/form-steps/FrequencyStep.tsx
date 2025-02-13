
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MedicationFormData } from "@/types/medication-form";

interface FrequencyStepProps {
  formData: MedicationFormData;
  setFormData: (data: MedicationFormData) => void;
  onCalculateTimes: () => void;
  onBack: () => void;
  onNext: () => void;
}

export const FrequencyStep = ({ 
  formData, 
  setFormData, 
  onCalculateTimes,
  onBack,
  onNext 
}: FrequencyStepProps) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="hoursBetween">Hours Between Doses</Label>
      <Input
        id="hoursBetween"
        type="number"
        min="1"
        max="24"
        value={formData.hoursBetween}
        onChange={(e) => {
          setFormData({ ...formData, hoursBetween: e.target.value });
          onCalculateTimes();
        }}
        required
        placeholder="How many hours between doses?"
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
          disabled={!formData.hoursBetween}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

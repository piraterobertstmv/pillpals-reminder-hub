
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { MedicationFormData } from "@/types/medication-form";

interface DurationStepProps {
  formData: MedicationFormData;
  setFormData: (data: MedicationFormData) => void;
  onBack: () => void;
  onNext: () => void;
}

export const DurationStep = ({ formData, setFormData, onBack, onNext }: DurationStepProps) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
            placeholder="Duration"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="durationType">Type</Label>
          <RadioGroup
            value={formData.durationType}
            onValueChange={(value: "days" | "weeks" | "months") => 
              setFormData({ ...formData, durationType: value })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="days" id="days" />
              <Label htmlFor="days">Days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weeks" id="weeks" />
              <Label htmlFor="weeks">Weeks</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="months" id="months" />
              <Label htmlFor="months">Months</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
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
          disabled={!formData.duration}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

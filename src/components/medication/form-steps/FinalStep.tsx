
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface FinalStepProps {
  imagePreview: string | null;
  remindersEnabled: boolean;
  setRemindersEnabled: (enabled: boolean) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const FinalStep = ({ 
  imagePreview, 
  remindersEnabled, 
  setRemindersEnabled,
  onImageChange,
  onBack,
  onSubmit,
  loading
}: FinalStepProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image">Medication Image (Optional)</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="mt-1"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="reminders"
          checked={remindersEnabled}
          onCheckedChange={setRemindersEnabled}
        />
        <Label htmlFor="reminders">Enable Reminders</Label>
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
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 bg-coral hover:bg-coral/90"
        >
          {loading ? "Adding..." : "Add Medication"}
        </Button>
      </div>
    </div>
  );
};

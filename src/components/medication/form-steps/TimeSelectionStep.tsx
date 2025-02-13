
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { TimeSlot } from "@/types/medication-form";

interface TimeSelectionStepProps {
  recommendedTimes: TimeSlot[];
  setRecommendedTimes: (times: TimeSlot[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export const TimeSelectionStep = ({ 
  recommendedTimes, 
  setRecommendedTimes, 
  onBack, 
  onNext 
}: TimeSelectionStepProps) => {
  return (
    <div className="space-y-4">
      <Label>Recommended Time Schedules</Label>
      <div className="space-y-2">
        {recommendedTimes.map((slot, index) => (
          <Button
            key={index}
            variant={slot.selected ? "default" : "outline"}
            className="w-full"
            onClick={() => {
              const newTimes = recommendedTimes.map((t, i) => ({
                ...t,
                selected: i === index
              }));
              setRecommendedTimes(newTimes);
            }}
          >
            {slot.time}
          </Button>
        ))}
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
          disabled={!recommendedTimes.some(t => t.selected)}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

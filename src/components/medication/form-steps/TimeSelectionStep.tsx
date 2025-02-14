
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { TimeSlot } from "@/types/medication-form";
import { useState } from "react";
import { toast } from "sonner";

interface TimeSelectionStepProps {
  recommendedTimes: TimeSlot[];
  setRecommendedTimes: (times: TimeSlot[]) => void;
  onBack: () => void;
  onNext: () => void;
  formData: {
    dosesPerDay: string;
    hoursBetween: string;
  };
}

const DAYS_OF_WEEK = [
  { label: "Sunday", value: "0" },
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
];

export const TimeSelectionStep = ({ 
  recommendedTimes, 
  setRecommendedTimes, 
  onBack, 
  onNext,
  formData 
}: TimeSelectionStepProps) => {
  const [newTime, setNewTime] = useState("10:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    DAYS_OF_WEEK.filter(day => day.value !== "0").map(day => day.value)
  );

  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const validateTimeInterval = (times: string[], newTime: string): boolean => {
    if (times.length === 0) return true;

    const hoursBetween = parseInt(formData.hoursBetween);
    const minimumMinutes = hoursBetween * 60;
    const newTimeMinutes = parseTime(newTime);

    return times.every(existingTime => {
      const existingMinutes = parseTime(existingTime);
      const difference = Math.abs(existingMinutes - newTimeMinutes);
      return difference >= minimumMinutes;
    });
  };

  const handleAddTime = () => {
    const currentTimes = recommendedTimes.map(t => t.time);
    
    if (parseInt(formData.dosesPerDay) > 1) {
      // Check if we've reached the maximum number of doses
      if (recommendedTimes.length >= parseInt(formData.dosesPerDay)) {
        toast.error("Maximum doses reached", {
          description: `You can only set ${formData.dosesPerDay} doses per day.`
        });
        return;
      }

      // Validate time interval
      if (!validateTimeInterval(currentTimes, newTime)) {
        toast.error("Invalid time interval", {
          description: `There must be at least ${formData.hoursBetween} hours between doses.`
        });
        return;
      }
    }

    const newTimeSlot: TimeSlot = {
      time: newTime,
      selected: true,
      days: selectedDays
    };

    if (formData.dosesPerDay === "1") {
      // Replace existing times for single dose
      setRecommendedTimes([newTimeSlot]);
    } else {
      // Add new time for multiple doses
      setRecommendedTimes([...recommendedTimes, newTimeSlot]);
    }
  };

  const handleRemoveTime = (index: number) => {
    setRecommendedTimes(recommendedTimes.filter((_, i) => i !== index));
  };

  const handleDayToggle = (dayValue: string) => {
    setSelectedDays(prev => {
      if (prev.includes(dayValue)) {
        return prev.filter(d => d !== dayValue);
      } else {
        return [...prev, dayValue];
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Set Medication Time</Label>
        <Input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <Label>Select Days</Label>
        <div className="grid grid-cols-2 gap-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={selectedDays.includes(day.value)}
                onCheckedChange={() => handleDayToggle(day.value)}
              />
              <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        onClick={handleAddTime}
        className="w-full"
        variant="secondary"
      >
        Add Time Slot
      </Button>

      <div className="space-y-4">
        {recommendedTimes.map((slot, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50 relative">
            <p className="font-medium">Time: {slot.time}</p>
            <p className="text-sm text-gray-600">
              Days: {slot.days.map(d => 
                DAYS_OF_WEEK.find(day => day.value === d)?.label
              ).join(", ")}
            </p>
            {parseInt(formData.dosesPerDay) > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveTime(index)}
              >
                Remove
              </Button>
            )}
          </div>
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
          disabled={recommendedTimes.length === 0 || 
                   (parseInt(formData.dosesPerDay) > 1 && 
                    recommendedTimes.length < parseInt(formData.dosesPerDay))}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

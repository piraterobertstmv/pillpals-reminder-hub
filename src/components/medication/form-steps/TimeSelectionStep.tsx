
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { TimeSlot } from "@/types/medication-form";
import { useState } from "react";

interface TimeSelectionStepProps {
  recommendedTimes: TimeSlot[];
  setRecommendedTimes: (times: TimeSlot[]) => void;
  onBack: () => void;
  onNext: () => void;
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
  onNext 
}: TimeSelectionStepProps) => {
  const [newTime, setNewTime] = useState("10:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    DAYS_OF_WEEK.filter(day => day.value !== "0").map(day => day.value)
  );

  const handleAddTime = () => {
    const newTimeSlot: TimeSlot = {
      time: newTime,
      selected: true,
      days: selectedDays
    };

    // Replace existing times with the new one since we're only allowing one time slot
    setRecommendedTimes([newTimeSlot]);
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
        Set Schedule
      </Button>

      {recommendedTimes.map((slot, index) => (
        <div key={index} className="p-4 border rounded-lg bg-gray-50">
          <p className="font-medium">Time: {slot.time}</p>
          <p className="text-sm text-gray-600">
            Days: {slot.days.map(d => 
              DAYS_OF_WEEK.find(day => day.value === d)?.label
            ).join(", ")}
          </p>
        </div>
      ))}

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
          disabled={recommendedTimes.length === 0}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

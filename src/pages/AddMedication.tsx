import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SchedulePreview } from "@/components/medication/SchedulePreview";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';

interface TimeSlot {
  time: string;
  selected: boolean;
}

const AddMedication = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    hoursBetween: "",
    duration: "",
    durationType: "days" as "days" | "weeks" | "months"
  });

  const [recommendedTimes, setRecommendedTimes] = useState<TimeSlot[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const calculateRecommendedTimes = () => {
    const hoursBetween = parseInt(formData.hoursBetween);
    if (!hoursBetween) return;

    // Calculate 3 different time slot recommendations
    const now = new Date();
    const morning = new Date(now).setHours(8, 0, 0, 0);
    const afternoon = new Date(now).setHours(14, 0, 0, 0);
    const evening = new Date(now).setHours(20, 0, 0, 0);

    const recommendations = [
      // Morning start
      [8, (8 + hoursBetween) % 24, (8 + 2 * hoursBetween) % 24],
      // Afternoon start
      [14, (14 + hoursBetween) % 24, (14 + 2 * hoursBetween) % 24],
      // Evening start
      [20, (20 + hoursBetween) % 24, (20 + 2 * hoursBetween) % 24]
    ];

    const timeSlots: TimeSlot[] = recommendations.map(times => ({
      time: times.map(t => `${t.toString().padStart(2, '0')}:00`).join(', '),
      selected: false
    }));

    setRecommendedTimes(timeSlots);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Please select an image smaller than 5MB."
        });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerConfetti = () => {
    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#4CAF50', '#2196F3']
    });

    // Second burst with slight delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recommendedTimes.some(t => t.selected)) {
      toast.error("Please select a time schedule");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Adding medication...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let imageUrl = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('medication_images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('medication_images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const selectedSchedule = recommendedTimes.find(t => t.selected);
      const timeOfDay = selectedSchedule?.time.split(', ') || [];

      // Calculate duration in days
      let durationDays = parseInt(formData.duration);
      if (formData.durationType === 'weeks') durationDays *= 7;
      if (formData.durationType === 'months') durationDays *= 30;

      const { error: insertError } = await supabase
        .from('medications')
        .insert({
          name: formData.name,
          frequency: `Every ${formData.hoursBetween} hours`,
          time_of_day: timeOfDay,
          user_id: user.id,
          image_url: imageUrl,
          reminder_enabled: remindersEnabled,
          dosage: '1 pill', // Default dosage
          notes: null,
          next_reminder: null
        });

      if (insertError) throw insertError;

      triggerConfetti();

      toast.success("Medication added", {
        description: `${formData.name} has been added to your medications.`,
        id: toastId
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error("Failed to add medication", {
        description: "An error occurred while adding your medication. Please try again.",
        id: toastId
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const handleBack = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };

    const showPreview = currentStep > 2 && formData.name && formData.hoursBetween;
    const selectedSchedule = recommendedTimes.find(t => t.selected);

    const slideVariants = {
      enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1
      },
      exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      })
    };

    return (
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {showPreview && (
            <SchedulePreview
              name={formData.name}
              times={selectedSchedule ? selectedSchedule.time.split(', ') : []}
              duration={formData.duration}
              durationType={formData.durationType}
            />
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              custom={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {(() => {
                switch (currentStep) {
                  case 1:
                    return (
                      <div className="space-y-4">
                        <Label htmlFor="name">Medication Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          placeholder="Enter medication name"
                          className="w-full"
                        />
                        <Button 
                          onClick={() => formData.name && setCurrentStep(2)}
                          disabled={!formData.name}
                          className="w-full mt-4"
                        >
                          Next
                        </Button>
                      </div>
                    );

                  case 2:
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
                            setFormData(prev => ({ ...prev, hoursBetween: e.target.value }));
                            calculateRecommendedTimes();
                          }}
                          required
                          placeholder="How many hours between doses?"
                        />
                        <div className="flex space-x-4">
                          <Button
                            onClick={handleBack}
                            variant="outline"
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button 
                            onClick={() => formData.hoursBetween && setCurrentStep(3)}
                            disabled={!formData.hoursBetween}
                            className="flex-1"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    );

                  case 3:
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
                              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                              required
                              placeholder="Duration"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="durationType">Type</Label>
                            <RadioGroup
                              value={formData.durationType}
                              onValueChange={(value: "days" | "weeks" | "months") => 
                                setFormData(prev => ({ ...prev, durationType: value }))
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
                            onClick={handleBack}
                            variant="outline"
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button 
                            onClick={() => formData.duration && setCurrentStep(4)}
                            disabled={!formData.duration}
                            className="flex-1"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    );

                  case 4:
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
                                setRecommendedTimes(prev => prev.map((t, i) => ({
                                  ...t,
                                  selected: i === index
                                })));
                              }}
                            >
                              {slot.time}
                            </Button>
                          ))}
                        </div>
                        <div className="flex space-x-4">
                          <Button
                            onClick={handleBack}
                            variant="outline"
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button 
                            onClick={() => setCurrentStep(5)}
                            disabled={!recommendedTimes.some(t => t.selected)}
                            className="flex-1"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    );

                  case 5:
                    return (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="image">Medication Image (Optional)</Label>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
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
                            onClick={handleBack}
                            variant="outline"
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-coral hover:bg-coral/90"
                          >
                            {loading ? "Adding..." : "Add Medication"}
                          </Button>
                        </div>
                      </div>
                    );
                }
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Add Medication</h1>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
              >
                Back to Dashboard
              </Button>
            </div>

            <motion.div className="flex justify-between mb-8">
              {[1, 2, 3, 4, 5].map((step) => (
                <motion.div
                  key={step}
                  className={`w-1/5 h-2 rounded ${
                    step <= currentStep ? 'bg-coral' : 'bg-gray-200'
                  }`}
                  initial={false}
                  animate={{
                    backgroundColor: step <= currentStep ? '#FF6B6B' : '#E5E7EB',
                    transition: { duration: 0.3 }
                  }}
                />
              ))}
            </motion.div>

            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddMedication;

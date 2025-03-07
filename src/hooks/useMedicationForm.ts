
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from 'canvas-confetti';
import type { TimeSlot, MedicationFormData } from "@/types/medication-form";

export const useMedicationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [recommendedTimes, setRecommendedTimes] = useState<TimeSlot[]>([]);
  
  const [formData, setFormData] = useState<MedicationFormData>({
    name: "",
    dosesPerDay: "",
    hoursBetween: "",
    duration: "",
    durationType: "days"
  });

  const calculateRecommendedTimes = () => {
    if (!formData.hoursBetween) return;

    const baseTime = "10:00"; // Default start time
    const hours = parseInt(formData.hoursBetween);
    const doses = parseInt(formData.dosesPerDay);
    
    const times: TimeSlot[] = [];
    for (let i = 0; i < doses; i++) {
      const time = new Date();
      const [baseHour, baseMinute] = baseTime.split(':').map(Number);
      time.setHours(baseHour + (i * hours));
      time.setMinutes(baseMinute);
      
      times.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        selected: false,
        days: ['1', '2', '3', '4', '5'] // Default to weekdays
      });
    }
    
    setRecommendedTimes(times);
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
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#4CAF50', '#2196F3']
    });

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
    if (recommendedTimes.length === 0) {
      toast.error("Please set a time schedule");
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

      // Get all time slots with their respective days
      const timeSchedules = recommendedTimes
        .filter(t => t.selected || formData.dosesPerDay === "1")
        .map(t => t.time);

      const { error: insertError } = await supabase
        .from('medications')
        .insert({
          name: formData.name,
          frequency: formData.dosesPerDay === "1" ? "Once daily" : `Every ${formData.hoursBetween} hours`,
          time_of_day: timeSchedules,
          reminder_days: recommendedTimes[0].days,
          user_id: user.id,
          image_url: imageUrl,
          reminder_enabled: remindersEnabled,
          dosage: '1 pill',
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

  return {
    currentStep,
    setCurrentStep,
    loading,
    formData,
    setFormData,
    image,
    imagePreview,
    remindersEnabled,
    setRemindersEnabled,
    recommendedTimes,
    setRecommendedTimes,
    calculateRecommendedTimes,
    handleImageChange,
    handleSubmit
  };
};

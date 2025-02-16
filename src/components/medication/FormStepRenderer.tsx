
import { motion, AnimatePresence } from "framer-motion";
import { MedicationNameStep } from "./form-steps/MedicationNameStep";
import { DosesPerDayStep } from "./form-steps/DosesPerDayStep";
import { FrequencyStep } from "./form-steps/FrequencyStep";
import { DurationStep } from "./form-steps/DurationStep";
import { TimeSelectionStep } from "./form-steps/TimeSelectionStep";
import { FinalStep } from "./form-steps/FinalStep";
import { SchedulePreview } from "./SchedulePreview";
import type { TimeSlot, MedicationFormData } from "@/types/medication-form";

interface FormStepRendererProps {
  currentStep: number;
  formData: MedicationFormData;
  setFormData: (data: MedicationFormData) => void;
  recommendedTimes: TimeSlot[];
  setRecommendedTimes: (times: TimeSlot[]) => void;
  calculateRecommendedTimes: () => void;
  setCurrentStep: (step: number) => void;
  imagePreview: string | null;
  remindersEnabled: boolean;
  setRemindersEnabled: (enabled: boolean) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const FormStepRenderer = ({
  currentStep,
  formData,
  setFormData,
  recommendedTimes,
  setRecommendedTimes,
  calculateRecommendedTimes,
  setCurrentStep,
  imagePreview,
  remindersEnabled,
  setRemindersEnabled,
  handleImageChange,
  handleSubmit,
  loading
}: FormStepRendererProps) => {
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const showPreview = currentStep > 3 && formData.name && (formData.dosesPerDay === "1" || formData.hoursBetween);
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
        {showPreview && selectedSchedule && (
          <SchedulePreview
            name={formData.name}
            times={selectedSchedule.time.split(', ')}
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
                    <MedicationNameStep
                      formData={formData}
                      setFormData={setFormData}
                      onNext={() => setCurrentStep(2)}
                    />
                  );
                case 2:
                  return (
                    <DosesPerDayStep
                      formData={formData}
                      setFormData={setFormData}
                      onBack={handleBack}
                      onNext={() => {
                        if (formData.dosesPerDay === "1") {
                          setCurrentStep(4);
                        } else {
                          setCurrentStep(3);
                        }
                      }}
                    />
                  );
                case 3:
                  return (
                    <FrequencyStep
                      formData={formData}
                      setFormData={setFormData}
                      onCalculateTimes={calculateRecommendedTimes}
                      onBack={handleBack}
                      onNext={() => setCurrentStep(4)}
                    />
                  );
                case 4:
                  return (
                    <DurationStep
                      formData={formData}
                      setFormData={setFormData}
                      onBack={handleBack}
                      onNext={() => setCurrentStep(5)}
                    />
                  );
                case 5:
                  return (
                    <TimeSelectionStep
                      recommendedTimes={recommendedTimes}
                      setRecommendedTimes={setRecommendedTimes}
                      formData={formData}
                      onBack={handleBack}
                      onNext={() => setCurrentStep(6)}
                    />
                  );
                case 6:
                  return (
                    <FinalStep
                      imagePreview={imagePreview}
                      remindersEnabled={remindersEnabled}
                      setRemindersEnabled={setRemindersEnabled}
                      onImageChange={handleImageChange}
                      onBack={handleBack}
                      onSubmit={handleSubmit}
                      loading={loading}
                    />
                  );
              }
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

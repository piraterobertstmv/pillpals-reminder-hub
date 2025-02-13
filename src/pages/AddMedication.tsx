
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SchedulePreview } from "@/components/medication/SchedulePreview";
import { motion, AnimatePresence } from "framer-motion";
import { useMedicationForm } from "@/hooks/useMedicationForm";
import { MedicationNameStep } from "@/components/medication/form-steps/MedicationNameStep";
import { FrequencyStep } from "@/components/medication/form-steps/FrequencyStep";
import { DurationStep } from "@/components/medication/form-steps/DurationStep";
import { TimeSelectionStep } from "@/components/medication/form-steps/TimeSelectionStep";
import { FinalStep } from "@/components/medication/form-steps/FinalStep";
import { useNavigate } from "react-router-dom";

const AddMedication = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    loading,
    formData,
    setFormData,
    imagePreview,
    remindersEnabled,
    setRemindersEnabled,
    recommendedTimes,
    setRecommendedTimes,
    calculateRecommendedTimes,
    handleImageChange,
    handleSubmit
  } = useMedicationForm();

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
                      <FrequencyStep
                        formData={formData}
                        setFormData={setFormData}
                        onCalculateTimes={calculateRecommendedTimes}
                        onBack={handleBack}
                        onNext={() => setCurrentStep(3)}
                      />
                    );
                  case 3:
                    return (
                      <DurationStep
                        formData={formData}
                        setFormData={setFormData}
                        onBack={handleBack}
                        onNext={() => setCurrentStep(4)}
                      />
                    );
                  case 4:
                    return (
                      <TimeSelectionStep
                        recommendedTimes={recommendedTimes}
                        setRecommendedTimes={setRecommendedTimes}
                        onBack={handleBack}
                        onNext={() => setCurrentStep(5)}
                      />
                    );
                  case 5:
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

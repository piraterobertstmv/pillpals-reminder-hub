
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useMedicationForm } from "@/hooks/useMedicationForm";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "@/components/medication/ProgressBar";
import { FormStepRenderer } from "@/components/medication/FormStepRenderer";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50"
      >
        Back
      </Button>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-center md:mt-0 mt-8">
              <h1 className="text-3xl font-bold md:ml-0 ml-12">Add Medication</h1>
            </div>

            <ProgressBar currentStep={currentStep} totalSteps={6} />

            <FormStepRenderer
              currentStep={currentStep}
              formData={formData}
              setFormData={setFormData}
              recommendedTimes={recommendedTimes}
              setRecommendedTimes={setRecommendedTimes}
              calculateRecommendedTimes={calculateRecommendedTimes}
              setCurrentStep={setCurrentStep}
              imagePreview={imagePreview}
              remindersEnabled={remindersEnabled}
              setRemindersEnabled={setRemindersEnabled}
              handleImageChange={handleImageChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddMedication;

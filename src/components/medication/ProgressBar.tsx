
import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <motion.div className="flex justify-between mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <motion.div
          key={index + 1}
          className={`w-1/6 h-2 rounded ${
            index + 1 <= currentStep ? 'bg-coral' : 'bg-gray-200'
          }`}
          initial={false}
          animate={{
            backgroundColor: index + 1 <= currentStep ? '#FF6B6B' : '#E5E7EB',
            transition: { duration: 0.3 }
          }}
        />
      ))}
    </motion.div>
  );
};


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Hero = () => (
  <section className="container mx-auto px-4 py-20 text-center">
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      <h1 className="text-5xl font-bold leading-tight">
        The One Thing You Can't Forget – Your Medication
      </h1>
      <p className="text-xl text-gray-600">
        PillTime makes sure you never miss a dose. With personalized reminders,
        you'll always have your medications on time.
      </p>
      <div className="pt-4">
        <Button asChild className="btn-coral">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  </section>
);

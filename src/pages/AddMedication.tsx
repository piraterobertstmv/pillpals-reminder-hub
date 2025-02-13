
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AddMedication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // This is a placeholder - we'll implement the form in the next step
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Add Medication</h1>
            <p>Form will be implemented in the next step.</p>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
            >
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddMedication;

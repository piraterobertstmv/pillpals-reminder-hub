
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MedicationList } from "@/components/dashboard/MedicationList";
import { EmailTest } from "@/components/dashboard/EmailTest";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Medication } from "@/types/medication";

const Dashboard = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast: shadowToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: meds, error } = await supabase
            .from('medications')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;
          setMedications(meds || []);
        }
      } catch (error) {
        console.error('Error fetching medications:', error);
        shadowToast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your medications. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [shadowToast]);

  const handleEdit = (id: string) => {
    navigate(`/dashboard/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMedications(medications.filter(med => med.id !== id));
      toast.success("Medication deleted", {
        description: "The medication has been successfully removed from your list."
      });
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error("Failed to delete medication", {
        description: "An error occurred while trying to delete the medication. Please try again."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>
            
            <EmailTest />
            
            {loading ? (
              <div 
                className="text-center py-8" 
                role="status" 
                aria-live="polite"
              >
                <span className="sr-only">Loading medications...</span>
                Loading...
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <MedicationList
                  medications={medications}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

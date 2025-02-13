
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MedicationList } from "@/components/dashboard/MedicationList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ViewMedications = () => {
  const [medications, setMedications] = useState([]);
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

      setMedications(medications.filter((med: any) => med.id !== id));
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
      <div className="flex flex-col md:flex-row h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Your Medications
            </h1>

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

export default ViewMedications;


import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MedicationList } from "@/components/dashboard/MedicationList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const Dashboard = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast: shadowToast } = useToast();
  const navigate = useNavigate();

  // Subscribe to reminder history updates
  useEffect(() => {
    const reminderChannel = supabase
      .channel('reminder_history')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reminder_history'
        },
        async (payload) => {
          const { data: reminder } = await supabase
            .from('medications')
            .select('name')
            .eq('id', payload.new.medication_id)
            .single();

          if (reminder) {
            if (payload.new.status === 'success') {
              toast.success(`Reminder sent for ${reminder.name}`, {
                description: `${payload.new.type.toUpperCase()} reminder was delivered successfully.`
              });
            } else {
              toast.error(`Failed to send reminder for ${reminder.name}`, {
                description: payload.new.error_message || `${payload.new.type.toUpperCase()} reminder failed to deliver.`
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reminderChannel);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.first_name) {
            setFirstName(profile.first_name);
          }

          const { data: meds, error } = await supabase
            .from('medications')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;
          setMedications(meds || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        shadowToast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">
                Welcome back, {firstName || "User"}!
              </h1>
              <Button asChild className="bg-coral hover:bg-coral/90">
                <Link to="/dashboard/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medication
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <MedicationList
                medications={medications}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;


import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MedicationList } from "@/components/dashboard/MedicationList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { registerServiceWorker, subscribeToPushNotifications } from "@/lib/push-notifications";

const Dashboard = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast: shadowToast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    const setupPushNotifications = async () => {
      try {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await registerServiceWorker();
            await subscribeToPushNotifications();
            toast.success('Push notifications enabled');
          }
        }
      } catch (error) {
        console.error('Error setting up push notifications:', error);
        toast.error('Failed to enable push notifications');
      }
    };

    setupPushNotifications();
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
    <div className="min-h-screen bg-gray-50" role="main">
      <div className="flex flex-col md:flex-row h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8" tabIndex={-1}>
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isMobile ? "mt-12" : ""}`}>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, {firstName || "User"}!
              </h1>
              <Button 
                asChild 
                className="bg-coral hover:bg-coral/90 w-full sm:w-auto"
                aria-label="Add new medication"
              >
                <Link to="/dashboard/add">
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Add Medication
                </Link>
              </Button>
            </div>

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

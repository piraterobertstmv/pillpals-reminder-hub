
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MedicationList } from "@/components/dashboard/MedicationList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

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
      toast({
        title: "Success",
        description: "Medication deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete medication. Please try again.",
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

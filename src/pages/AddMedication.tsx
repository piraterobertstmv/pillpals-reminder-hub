
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AddMedication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    timesPerDay: "",
    frequency: "",
  });
  const [reminders, setReminders] = useState({
    enabled: true,
    frequency: "daily",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Please select an image smaller than 5MB."
        });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Adding medication...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let imageUrl = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('medication_images')
          .upload(fileName, image);

        if (uploadError) {
          toast.error("Failed to upload image", {
            description: uploadError.message
          });
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('medication_images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const timeOfDay = Array.from(
        { length: parseInt(formData.timesPerDay) || 1 },
        (_, i) => `${Math.floor(24 / (parseInt(formData.timesPerDay) || 1) * i)}:00`
      );

      // Calculate next reminder time
      const nextReminder = new Date();
      nextReminder.setHours(nextReminder.getHours() + parseInt(formData.frequency));

      const { error: insertError } = await supabase
        .from('medications')
        .insert({
          name: formData.name,
          frequency: `Every ${formData.frequency} hours`,
          dosage: "1 pill", // Default dosage
          time_of_day: timeOfDay,
          user_id: user.id,
          image_url: imageUrl,
          reminder_enabled: reminders.enabled,
          reminder_frequency: reminders.frequency,
          next_reminder: nextReminder.toISOString()
        });

      if (insertError) throw insertError;

      toast.success("Medication added", {
        description: `${formData.name} has been added to your medications.`,
        id: toastId
      });
      navigate("/dashboard");
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error("Failed to add medication", {
        description: "An error occurred while adding your medication. Please try again.",
        id: toastId
      });
    } finally {
      setLoading(false);
    }
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Medication Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Enter medication name"
                  />
                </div>

                <div>
                  <Label htmlFor="timesPerDay">Times per Day</Label>
                  <Input
                    id="timesPerDay"
                    type="number"
                    min="1"
                    value={formData.timesPerDay}
                    onChange={(e) => setFormData(prev => ({ ...prev, timesPerDay: e.target.value }))}
                    required
                    placeholder="How many times per day?"
                  />
                </div>

                <div>
                  <Label htmlFor="frequency">Every X Hours</Label>
                  <Input
                    id="frequency"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    required
                    placeholder="How many hours between doses?"
                  />
                </div>

                <div>
                  <Label htmlFor="image">Medication Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="reminders"
                    checked={reminders.enabled}
                    onCheckedChange={(checked) => 
                      setReminders(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                  <Label htmlFor="reminders">Enable Reminders</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-coral hover:bg-coral/90"
                >
                  {loading ? "Adding..." : "Add Medication"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddMedication;

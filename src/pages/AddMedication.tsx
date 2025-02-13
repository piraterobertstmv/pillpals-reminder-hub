
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AddMedication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    timesPerDay: "",
    frequency: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('medication_images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const timeOfDay = Array.from(
        { length: parseInt(formData.timesPerDay) || 1 },
        (_, i) => `${Math.floor(24 / (parseInt(formData.timesPerDay) || 1) * i)}:00`
      );

      const { error: insertError } = await supabase
        .from('medications')
        .insert({
          name: formData.name,
          frequency: `Every ${formData.frequency} hours`,
          dosage: "1 pill", // Default dosage
          time_of_day: timeOfDay,
          user_id: user.id,
          image_url: imageUrl,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Medication added successfully!",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add medication. Please try again.",
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

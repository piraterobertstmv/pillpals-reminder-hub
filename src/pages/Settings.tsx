
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    phone_number: "",
    email_reminder_enabled: true,
    sms_reminder_enabled: true
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setSettings({
            name: profile.name || "",
            email: profile.email || "",
            phone_number: profile.phone_number || "",
            email_reminder_enabled: profile.email_reminder_enabled,
            sms_reminder_enabled: profile.sms_reminder_enabled
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load settings. Please try again."
        });
      }
    };

    loadSettings();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          name: settings.name,
          email: settings.email,
          phone_number: settings.phone_number,
          email_reminder_enabled: settings.email_reminder_enabled,
          sms_reminder_enabled: settings.sms_reminder_enabled
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your settings have been updated."
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings. Please try again."
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
            <h1 className="text-3xl font-bold">Settings</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={settings.phone_number}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone_number: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-notifications"
                    checked={settings.email_reminder_enabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, email_reminder_enabled: checked }))
                    }
                  />
                  <Label htmlFor="email-notifications">Enable Email Reminders</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sms-notifications"
                    checked={settings.sms_reminder_enabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, sms_reminder_enabled: checked }))
                    }
                  />
                  <Label htmlFor="sms-notifications">Enable SMS Reminders</Label>
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;


import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EmailTest = () => {
  const testEmail = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('test-resend');
      
      if (error) throw error;
      
      toast.success("Email sent successfully!", {
        description: "Check your inbox for the test email."
      });
      
      console.log('Email function response:', data);
    } catch (error) {
      console.error('Error testing email:', error);
      toast.error("Failed to send test email", {
        description: error.message
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Email Configuration Test</h3>
      <Button onClick={testEmail}>
        Send Test Email
      </Button>
    </div>
  );
};


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SnoozeRequest {
  medicationId: string;
  duration: number; // Duration in hours
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { medicationId, duration }: SnoozeRequest = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    // Get medication and user details
    const { data: medication, error: medError } = await supabase
      .from('medications')
      .select(`
        *,
        profiles:user_id (
          email,
          email_reminder_enabled
        )
      `)
      .eq('id', medicationId)
      .single()

    if (medError) throw medError
    if (!medication) throw new Error('Medication not found')

    // Calculate new reminder time
    const nextReminder = new Date()
    nextReminder.setHours(nextReminder.getHours() + duration)

    // Update medication with new reminder time
    const { error: updateError } = await supabase
      .from('medications')
      .update({ next_reminder: nextReminder.toISOString() })
      .eq('id', medicationId)

    if (updateError) throw updateError

    // Send confirmation email if email reminders are enabled
    if (medication.profiles.email_reminder_enabled && medication.profiles.email) {
      await resend.emails.send({
        from: 'PillTime <reminders@pilltime.app>',
        to: medication.profiles.email,
        subject: 'Reminder Snoozed',
        html: `
          <h1>Reminder Snoozed</h1>
          <p>Your reminder for ${medication.name} has been snoozed.</p>
          <p>Next reminder: ${nextReminder.toLocaleString()}</p>
        `,
      })
    }

    // Log the snooze action
    await supabase.from('reminder_history').insert({
      medication_id: medicationId,
      user_id: medication.user_id,
      type: 'snooze',
      status: 'success'
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        next_reminder: nextReminder.toISOString() 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in snooze-reminder function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

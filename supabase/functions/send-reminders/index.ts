
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Resend } from "npm:resend@2.0.0"
import twilio from 'npm:twilio'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const twilioClient = twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID'),
      Deno.env.get('TWILIO_AUTH_TOKEN')
    )

    // Get all medications that need reminders
    const { data: medications, error: medicationsError } = await supabase
      .from('medications')
      .select(`
        *,
        profiles:user_id (
          email,
          phone_number,
          email_reminder_enabled,
          sms_reminder_enabled
        )
      `)
      .eq('reminder_enabled', true)
      .lte('next_reminder', new Date().toISOString())

    if (medicationsError) throw medicationsError

    for (const medication of medications || []) {
      const profile = medication.profiles
      
      try {
        // Send email reminder if enabled
        if (profile.email_reminder_enabled && profile.email) {
          await resend.emails.send({
            from: 'PillTime <reminders@pilltime.app>',
            to: profile.email,
            subject: `Time to take ${medication.name}!`,
            html: `
              <h1>Medication Reminder</h1>
              <p>It's time to take your ${medication.name}</p>
              <p>Dosage: ${medication.dosage}</p>
              ${medication.image_url ? `<img src="${medication.image_url}" alt="${medication.name}" style="max-width: 200px;" />` : ''}
              <p>Next reminder will be in ${medication.frequency}</p>
            `,
          })

          // Log successful email
          await supabase.from('reminder_history').insert({
            medication_id: medication.id,
            user_id: medication.user_id,
            type: 'email',
            status: 'success'
          })
        }

        // Send SMS reminder if enabled
        if (profile.sms_reminder_enabled && profile.phone_number) {
          await twilioClient.messages.create({
            body: `Time to take ${medication.name} (${medication.dosage}). Next reminder in ${medication.frequency}.`,
            to: profile.phone_number,
            from: Deno.env.get('TWILIO_PHONE_NUMBER'),
          })

          // Log successful SMS
          await supabase.from('reminder_history').insert({
            medication_id: medication.id,
            user_id: medication.user_id,
            type: 'sms',
            status: 'success'
          })
        }

        // Update next reminder time based on frequency
        const frequencyHours = parseInt(medication.frequency.split(' ')[1])
        const nextReminder = new Date()
        nextReminder.setHours(nextReminder.getHours() + frequencyHours)

        await supabase
          .from('medications')
          .update({ next_reminder: nextReminder.toISOString() })
          .eq('id', medication.id)

      } catch (error) {
        console.error(`Error sending reminder for medication ${medication.id}:`, error)
        
        // Log failed reminder
        await supabase.from('reminder_history').insert({
          medication_id: medication.id,
          user_id: medication.user_id,
          type: error.name.includes('Resend') ? 'email' : 'sms',
          status: 'failed',
          error_message: error.message
        })
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in send-reminders function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

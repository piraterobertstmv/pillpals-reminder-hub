
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Resend } from "npm:resend@2.0.0"
import twilio from 'npm:twilio'
import webpush from 'npm:web-push'
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const client = new SmtpClient();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const twilioClient = twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID'),
      Deno.env.get('TWILIO_AUTH_TOKEN')
    )

    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      Deno.env.get('VAPID_PUBLIC_KEY'),
      Deno.env.get('VAPID_PRIVATE_KEY')
    );

    const baseUrl = 'https://glfvydxxshkpdrrpvzxh.supabase.co/functions/v1/snooze-reminder'

    // Get all reminders that need to be sent now
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;
    const currentDay = now.getDay();

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('time', currentTime)
      .contains('days', [currentDay.toString()]);

    if (error) throw error;

    for (const reminder of reminders) {
      // Handle push notifications
      if (reminder.push_notification) {
        // Fetch push subscriptions for this user
        const { data: pushSubscriptions, error: pushError } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', reminder.user_id)

        if (pushError) console.error('Error fetching push subscriptions:', pushError)

        // Send push notification if user has subscriptions
        if (pushSubscriptions && pushSubscriptions.length > 0) {
          for (const sub of pushSubscriptions) {
            const pushPayload = JSON.stringify({
              title: "🔔 Time for Your Medication!",
              body: `It's time to take ${reminder.medication_name}! Click to mark as taken.`,
              url: "/dashboard",
              sound: "/alarm.mp3",
              tag: "medication-reminder",
              renotify: true,
              requireInteraction: true,
              actions: [
                {
                  action: 'take',
                  title: 'Take Now'
                },
                {
                  action: 'snooze',
                  title: 'Snooze 15min'
                }
              ]
            });

            await webpush.sendNotification(sub, pushPayload)
          }

          // Log successful push notifications
          await supabase.from('reminder_history').insert({
            medication_id: reminder.id,
            user_id: reminder.user_id,
            type: 'push',
            status: 'success'
          })
        }
      }

      // Handle email notifications
      if (reminder.email_notification && reminder.email_address) {
        await client.connectTLS({
          hostname: Deno.env.get('SMTP_HOSTNAME'),
          port: 587,
          username: Deno.env.get('SMTP_USERNAME'),
          password: Deno.env.get('SMTP_PASSWORD'),
        });

        await client.send({
          from: "PillPals <notifications@pillpals.com>",
          to: reminder.email_address,
          subject: "🔔 URGENT: Time for Your Medication",
          content: `Time to take your ${reminder.medication_name}!\n\nThis is an important reminder. Please take your medication now.`,
          html: `
            <h1>🔔 Time for Your Medication!</h1>
            <h2>It's time to take ${reminder.medication_name}</h2>
            <p>This is an important reminder. Please take your medication now.</p>
          `
        });

        await client.close();

        await supabase.from('reminder_history').insert({
          medication_id: reminder.id,
          user_id: reminder.user_id,
          type: 'email',
          status: 'success'
        })
      }

      // Send SMS reminder if enabled
      const profile = reminder.profiles
      if (profile.sms_reminder_enabled && profile.phone_number) {
        const snoozeLinkText = [1, 3, 24].map(hours => 
          `${baseUrl}?medicationId=${reminder.id}&duration=${hours} (${hours}h)`
        ).join('\n')

        await twilioClient.messages.create({
          body: `🔔 URGENT: Time to take ${reminder.medication_name}! Please take your medication now.\n\nTo snooze, click:\n${snoozeLinkText}`,
          to: profile.phone_number,
          from: Deno.env.get('TWILIO_PHONE_NUMBER'),
        })

        await supabase.from('reminder_history').insert({
          medication_id: reminder.id,
          user_id: reminder.user_id,
          type: 'sms',
          status: 'success'
        })
      }

      // Update next reminder time based on frequency
      const frequencyHours = parseInt(reminder.frequency.split(' ')[1])
      const nextReminder = new Date()
      nextReminder.setHours(nextReminder.getHours() + frequencyHours)

      await supabase
        .from('reminders')
        .update({ time: nextReminder.toISOString() })
        .eq('id', reminder.id)
    }

    return new Response(JSON.stringify({ message: 'Reminders sent successfully' }), {
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

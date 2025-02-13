import { createClient } from '@supabase/supabase-js';

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  emailAddress?: string;
}

export interface Reminder {
  medicationName: string;
  time: string;
  days: string[];
  userId: string;
}

class NotificationService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      'https://glfvydxxshkpdrrpvzxh.supabase.co',
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async scheduleReminder(reminder: Reminder, preferences: NotificationPreferences) {
    try {
      // Store reminder in Supabase
      const { data, error } = await this.supabase
        .from('reminders')
        .insert([
          {
            medication_name: reminder.medicationName,
            time: reminder.time,
            days: reminder.days,
            user_id: reminder.userId,
            email_notification: preferences.email,
            push_notification: preferences.push,
            email_address: preferences.emailAddress
          }
        ]);

      if (error) throw error;

      // If push notifications are enabled and supported
      if (preferences.push && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.active?.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          ...reminder
        });
      }

      return data;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService(); 
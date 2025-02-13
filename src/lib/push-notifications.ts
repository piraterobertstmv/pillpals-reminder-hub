
import { supabase } from "@/integrations/supabase/client";

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw error;
    }
  }
  throw new Error('Service workers are not supported');
}

export async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Get the push subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Get VAPID public key from Edge Function
      const { data: { publicKey }, error: keyError } = await supabase.functions.invoke('get-vapid-key');
      if (keyError) throw keyError;

      // Subscribe to push notifications
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      });
    }

    // Store subscription in Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    await supabase.from('push_subscriptions').upsert({
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: btoa(String.fromCharCode.apply(null, 
        new Uint8Array(subscription.getKey('p256dh') as ArrayBuffer))),
      auth: btoa(String.fromCharCode.apply(null, 
        new Uint8Array(subscription.getKey('auth') as ArrayBuffer)))
    }, {
      onConflict: 'endpoint'
    });

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
}

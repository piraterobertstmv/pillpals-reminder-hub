import { useEffect, useState } from "react";
import { notificationService } from "../../services/NotificationService";
import { useAuth } from "../../hooks/useAuth"; // You'll need to implement this

interface NotificationSchedule {
  time: string;
  days: string[];
  medicationName: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PushNotification = () => {
  const { user } = useAuth(); // Get current user
  const [isSupported, setIsSupported] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [emailFallback, setEmailFallback] = useState(false);
  const [email, setEmail] = useState('');
  const [schedule, setSchedule] = useState<NotificationSchedule>({
    time: '',
    days: [],
    medicationName: ''
  });

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    });

    // Check if notifications are supported
    const checkSupport = async () => {
      const supported = 'Notification' in window && 
                       'serviceWorker' in navigator && 
                       'PushManager' in window;
      
      setIsSupported(supported);
      
      if (supported) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          registerServiceWorker();
        }
      }
    };
    
    checkSupport();
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('ServiceWorker registered:', registration);
    } catch (err) {
      console.error('ServiceWorker registration failed:', err);
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Installation is not available. You might have already installed the app or your browser might not support PWA installation.');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt for the next time
    setDeferredPrompt(null);
  };

  const handleScheduleNotification = async () => {
    if (!isSupported && !emailFallback) {
      alert('Please enable notifications or provide an email for reminders.');
      return;
    }

    try {
      const preferences = {
        push: isSupported,
        email: emailFallback,
        emailAddress: emailFallback ? email : undefined
      };

      await notificationService.scheduleReminder(
        {
          ...schedule,
          userId: user?.id || ''
        },
        preferences
      );

      alert('Reminder scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      alert('There was an error scheduling your reminder. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Schedule Medication Reminder</h2>
      
      {!isSupported && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          <p>⚠️ Push notifications are not supported on this device/browser.</p>
          <div className="mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={emailFallback}
                onChange={(e) => setEmailFallback(e.target.checked)}
                className="form-checkbox"
              />
              <span>Use email notifications instead</span>
            </label>
          </div>
          {emailFallback && (
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full p-2 border rounded"
            />
          )}
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Install App for Push Notifications
            </button>
          )}
        </div>
      )}

      {isSupported && deferredPrompt && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded flex items-center justify-between">
          <span>📱 Install our app for the best experience!</span>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Install Now
          </button>
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Medication Name"
          value={schedule.medicationName}
          onChange={(e) => setSchedule({...schedule, medicationName: e.target.value})}
          className="w-full p-2 border rounded"
        />
        <input
          type="time"
          value={schedule.time}
          onChange={(e) => setSchedule({...schedule, time: e.target.value})}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleScheduleNotification}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={!isSupported && !emailFallback}
        >
          Schedule Reminder
        </button>
      </div>
    </div>
  );
};

export default PushNotification;

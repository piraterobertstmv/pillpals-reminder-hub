
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    // Play alarm sound when notification is received
    if (data.sound) {
      const audio = new Audio(data.sound);
      audio.loop = true;
      audio.play().catch(console.error);
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon.ico',
        data: data.url,
        requireInteraction: true,
        tag: data.tag,
        renotify: data.renotify,
        actions: data.actions,
        sound: data.sound,
        vibrate: [200, 100, 200, 100, 200, 100, 400]
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'snooze') {
    // Handle snooze action
    const snoozeTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    self.registration.showNotification('Reminder Snoozed', {
      body: 'We\'ll remind you again in 15 minutes',
      icon: '/favicon.ico',
      tag: 'snoozed-reminder'
    });
  } else if (event.action === 'take') {
    // Handle take action
    if (event.notification.data) {
      event.waitUntil(
        clients.openWindow(event.notification.data + '?action=taken')
      );
    }
  } else if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

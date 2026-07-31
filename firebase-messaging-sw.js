importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDkQzYzWk1COIxNmd_VGqfHRsRtf9sOz8A",
  authDomain: "push-notifaction-c3460.firebaseapp.com",
  projectId: "push-notifaction-c3460",
  storageBucket: "push-notifaction-c3460.firebasestorage.app",
  messagingSenderId: "649136234508",
  appId: "1:649136234508:web:39b8e06150890d360ace29",
  measurementId: "G-5W02WYP1ZT"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received: ', payload);

  const title = payload.notification?.title || payload.data?.title || "📢 नया नोटिफिकेशन";
  const body = payload.notification?.body || payload.data?.body || "आपके पास एक नया संदेश आया है।";

  const notificationOptions = {
    body: body,
    icon: "/icon.png",
    badge: "/icon.png",
    data: {
      url: "/"
    }
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes('push-notifaction-c3460.web.app') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

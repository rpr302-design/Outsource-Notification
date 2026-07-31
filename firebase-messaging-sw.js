importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Firebase Configuration
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

// जब ऐप बंद हो या बैकग्राउंड में हो, तब पुश नोटिफिकेशन हैंडल करें
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received: ', payload);
  
  const notificationTitle = payload.notification?.title || "📢 नया नोटिफिकेशन";
  const notificationOptions = {
    body: payload.notification?.body || "आपके पास एक नया संदेश आया है।",
    icon: "/icon.png", // Firebase Hosting पर रूट पाथ से लोड होगा
    badge: "/icon.png", // एंडरॉयड स्टेटस बार के लिए छोटा आइकॉन
    data: {
      url: "/" // नोटिफिकेशन पर क्लिक करने पर ऐप खुल जाएगी
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// नोटिफिकेशन पर क्लिक करने पर वेब ऐप खोलने का लॉजिक
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // यदि ऐप पहले से खुली है तो उस पर फोकस करें
      for (let client of windowClients) {
        if (client.url.includes('push-notifaction-c3460.web.app') && 'focus' in client) {
          return client.focus();
        }
      }
      // यदि ऐप बंद है तो नया टैब खोलें
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// आपकी Firebase Config
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
  
  const notificationTitle = payload.notification.title || "नया नोटिफिकेशन";
  const notificationOptions = {
    body: payload.notification.body || "",
    icon: "/Outsource-Notification/icon.png" // यदि आपके पास आइकॉन हो
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

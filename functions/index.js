const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

// Firebase Admin SDK को इनिशियलाइज़ करें
admin.initializeApp();

/**
 * जब 'notifications' कलेक्शन में नया डॉक्यूमेंट बनेगा, 
 * तो यह फंक्शन अपने आप सभी यूज़र्स को FCM पुश नोटिफिकेशन भेजेगा।
 */
exports.sendNotificationToAll = onDocumentCreated("notifications/{docId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No snapshot data found");
        return;
    }

    const data = snapshot.data();
    const title = data.title || "📢 नया नोटिफिकेशन";
    const message = data.message || "आपके पास एक नया संदेश आया है।";

    try {
        // 1. 'users' कलेक्शन से सभी एक्टिव FCM टोकन्स निकालें
        const usersSnapshot = await admin.firestore().collection("users").get();
        const tokens = [];

        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            if (
                userData.fcmToken && 
                userData.fcmToken !== "no_token" && 
                userData.fcmToken !== "no_permission"
            ) {
                tokens.push(userData.fcmToken);
            }
        });

        if (tokens.length === 0) {
            console.log("कोई वैलिड FCM टोकन नहीं मिला।");
            return;
        }

        console.log(`कुल ${tokens.length} टोकन्स पर पुश नोटिफिकेशन भेजा जा रहा है...`);

        // 2. FCM Multicast पेलोड बनाएं
        const payload = {
            tokens: tokens,
            notification: {
                title: title,
                body: message
            },
            data: {
                title: title,
                body: message,
                url: "/"
            },
            webpush: {
                notification: {
                    title: title,
                    body: message,
                    icon: "/icon.png",
                    badge: "/icon.png"
                },
                fcmOptions: {
                    link: "/"
                }
            }
        };

        // 3. FCM sendEachForMulticast API से मैसेज पुश करें
        const response = await admin.messaging().sendEachForMulticast(payload);
        console.log(`सफलतापूर्वक ${response.successCount} यूज़र्स को नोटिफिकेशन भेजा गया। (असफल: ${response.failureCount})`);

    } catch (error) {
        console.error("पुश नोटिफिकेशन भेजने में त्रुटि आई:", error);
    }
});

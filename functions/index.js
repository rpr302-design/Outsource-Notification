const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotificationToAll = onDocumentCreated("notifications/{docId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data found in event");
        return;
    }

    const data = snapshot.data();
    const title = data.title || "📢 नया नोटिफिकेशन";
    const message = data.message || "आपके पास एक नया संदेश आया है।";

    try {
        // 1. 'users' कलेक्शन से सभी यूज़र्स के FCM टोकन्स निकालें
        const usersSnapshot = await admin.firestore().collection("users").get();
        const tokens = [];

        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.fcmToken && userData.fcmToken !== "no_token" && userData.fcmToken !== "no_permission") {
                tokens.push(userData.fcmToken);
            }
        });

        if (tokens.length === 0) {
            console.log("कोई वैलिड FCM टोकन नहीं मिला।");
            return;
        }

        // 2. पेलोड तैयार करें
        const payload = {
            tokens: tokens,
            notification: {
                title: title,
                body: message
            },
            webpush: {
                notification: {
                    title: title,
                    body: message,
                    icon: "/icon.png"
                }
            }
        };

        // 3. सभी टोकन्स पर नोटिफिकेशन भेजें
        const response = await admin.messaging().sendEachForMulticast(payload);
        console.log(`सफलतापूर्वक ${response.successCount} यूज़र्स को नोटिफिकेशन भेजा गया। फ़ेल हुए: ${response.failureCount}`);

    } catch (error) {
        console.error("नोटिफिकेशन भेजने में त्रुटि:", error);
    }
});

//index.js

//Note: dont mind this code for now, it doesnt do anything. 

/* firebase deploy --only functions */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.aggregateUsageSummary = functions.https.onCall((data, context) => {
    const firestore = admin.firestore();
    const { startDate, endDate } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const usageCollection = firestore.collection('electricity_usage');
    return usageCollection
        .where('timestamp', '>=', start)
        .where('timestamp', '<=', end)
        .get()
        .then(querySnapshot => {
            let totalUsage = 0;
            querySnapshot.forEach(doc => {
                const data = doc.data();
                totalUsage += data.total_channels_usage_kWh || 0;
            });

            if (querySnapshot.empty) {
                console.log('No usage data found for the range:', start, 'to', end);
                return { success: false, message: 'لا توجد بيانات للفترة المحددة' };
            } else {
                return firestore.collection('usage_summary').add({
                    startDate: admin.firestore.Timestamp.fromDate(start),
                    endDate: admin.firestore.Timestamp.fromDate(end),
                    totalUsage_kWh: totalUsage
                })
                .then(() => {
                    console.log('Aggregated usage data successfully added.');
                    return { success: true, totalUsage_kWh: totalUsage };
                });
            }
        })
        .catch(error => {
            console.error('Error aggregating usage data:', error);
            return { success: false, message: 'خطأ في تجميع البيانات' };
        });
});






/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/*exports.dailyUsageSummary = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const firestore = admin.firestore();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const usageCollection = firestore.collection('electricity_usage');
    try {
        const querySnapshot = await usageCollection
            .where('timestamp', '>=', today)
            .where('timestamp', '<', tomorrow)
            .get();

        let totalUsage = 0;
        querySnapshot.forEach(doc => {
            const data = doc.data();
            totalUsage += data.channels["1,2,3"].usage;  // Assuming 'usage' is within 'channels' map
        });

        if (querySnapshot.empty) {
            console.log('No usage data found for:', today);
        } else {
            await firestore.collection('daily_usage_summary').doc(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`).set({
                date: admin.firestore.Timestamp.fromDate(today),
                totalUsage_kWh: totalUsage
            });
            console.log('Aggregated daily usage:', totalUsage);
        }
    } catch (error) {
        console.error('Error in daily usage summary function:', error);
    }
    return null;
});*/


/*const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.dailyUsageSummary = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const firestore = admin.firestore();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const usageCollection = firestore.collection('electricity_usage');
  const querySnapshot = await usageCollection
    .where('timestamp', '>=', today)
    .where('timestamp', '<', tomorrow)
    .get();

  let totalUsage = 0;
  querySnapshot.forEach(doc => {
    const data = doc.data();
    totalUsage += data.total_usage_kWh || 0;
  });

  // Store the daily summary
  await firestore.collection('daily_usage_summary').doc(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`).set({
    date: admin.firestore.Timestamp.fromDate(today),
    totalUsage_kWh: totalUsage
  });

  console.log('Aggregated daily usage:', totalUsage);
  return null;
});*/


/*const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.dailyUsageSummary = functions.https.onRequest(async (req, res) => {
  const firestore = admin.firestore();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const usageCollection = firestore.collection('electricity_usage');
  const querySnapshot = await usageCollection
    .where('timestamp', '>=', today)
    .where('timestamp', '<', tomorrow)
    .get();

  let totalUsage = 0;
  querySnapshot.forEach(doc => {
    const data = doc.data();
    totalUsage += data.total_usage_kWh || 0;
  });

  if (totalUsage > 0) {
    await firestore.collection('daily_usage_summary').doc(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`).set({
      date: admin.firestore.Timestamp.fromDate(today),
      totalUsage_kWh: totalUsage
    });
    res.send(`Aggregated daily usage: ${totalUsage}`);
  } else {
    res.send('No data available to aggregate.');
  }
});*/
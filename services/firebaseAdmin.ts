// services/firebaseAdmin.ts
import * as admin from 'firebase-admin';
const serviceAccount = require('../data-analytics-finance-firebase-adminsdk-s3yh2-1bd6dbcea6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

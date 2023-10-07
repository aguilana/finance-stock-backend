// services/firebaseAdmin.ts
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../data-analytics-finance-firebase-adminsdk-s3yh2-1bd6dbcea6.json';
// import { initializeApp } from 'firebase-admin/app';

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}
export default admin;

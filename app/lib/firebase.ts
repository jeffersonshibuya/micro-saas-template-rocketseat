import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// import { getStorage } from "firebase-admin/storage";
import "server-only";

const decodedKey = Buffer.from(
  process.env.FIREBASE_PRIVATE_KEY_BASE64!,
  "base64"
).toString("utf-8");

export const firebaseCert = cert({
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: decodedKey,
  projectId: process.env.FIREBASE_PROJECT_ID,
});

if (!getApps().length) initializeApp({ credential: firebaseCert });

export const db = getFirestore();
//  export const storage = getStorage()

import * as admin from "firebase-admin";
require("dotenv").config();
const serviceAccount = JSON.parse(process.env.serviceAccount)


function initailizeDb() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL,
  });
  const db = admin.firestore();
  // const settings = { timestampsInSnapshots: true };
  // db.settings(settings);
  return db;
}
export const db = initailizeDb();

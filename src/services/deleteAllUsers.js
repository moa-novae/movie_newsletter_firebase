import * as admin from "firebase-admin";
require("dotenv").config();
const serviceAccount = JSON.parse(process.env.serviceAccount);
function deleteAllUsers(nextPageToken) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL,
  });
  admin
    .auth()
    .listUsers(100, nextPageToken)
    .then(function (listUsersResult) {
      listUsersResult.users.forEach(function (userRecord) {
        admin.auth().deleteUser(userRecord.toJSON().uid);
      });
      if (listUsersResult.pageToken) {
        deleteAllUsers(listUsersResult.pageToken);
      } else {
        console.log("All users deleted!");
      }
    })
    .catch(function (error) {
      console.log("Error deleting all users", error);
    });
}
deleteAllUsers();

import * as admin from "firebase-admin";
const serviceAccount = require("../../serviceAccountKey.json");
function deleteAllUsers(nextPageToken) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL,
  });
  admin
    .auth()
    .listUsers()
    .then(function (listUsersResult) {
      listUsersResult.users.forEach(function (userRecord) {
        admin.auth().deleteUser(userRecord.uid);
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

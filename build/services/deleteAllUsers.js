"use strict";

var admin = _interopRequireWildcard(require("firebase-admin"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

require("dotenv").config();

var serviceAccount = JSON.parse(process.env.serviceAccount);

function deleteAllUsers(nextPageToken) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL
  });
  admin.auth().listUsers(100, nextPageToken).then(function (listUsersResult) {
    listUsersResult.users.forEach(function (userRecord) {
      admin.auth().deleteUser(userRecord.toJSON().uid);
    });

    if (listUsersResult.pageToken) {
      deleteAllUsers(listUsersResult.pageToken);
    } else {
      console.log("All users deleted!");
    }
  }).catch(function (error) {
    console.log("Error deleting all users", error);
  });
}

deleteAllUsers();
//# sourceMappingURL=deleteAllUsers.js.map
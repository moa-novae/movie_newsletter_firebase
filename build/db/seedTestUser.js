"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setTestUsers;

var _initialize = require("./initialize");

function setTestUsers() {
  var usersRef = _initialize.db.collection("users");

  var testUsers = [{
    email: process.env.testEmail,
    userName: process.env.testUserName
  }];
  var sets = testUsers.map(user => {
    usersRef.add(user);
  });
  return Promise.all(sets);
}
//# sourceMappingURL=seedTestUser.js.map
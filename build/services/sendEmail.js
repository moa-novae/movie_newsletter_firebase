"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sendEmail;

require("dotenv").config();

var sgMail = require("@sendgrid/mail");

function sendEmail(msg) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg).then(() => {
    console.log("Message sent");
  }).catch(error => {
    console.log(error);
  });
}
//# sourceMappingURL=sendEmail.js.map
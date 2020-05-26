require("dotenv").config();

const sgMail = require("@sendgrid/mail");
export default function sendEmail(msg) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail
    .send(msg)
    .then(() => {
      console.log("Message sent");
    })
    .catch((error) => {
      console.log(error);
    });
}

require('dotenv').config()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'test@example.com',
  from: 'alan_mo@live.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg).then(() => {
  console.log('Message sent')
}).catch((error) => {
  console.log(error.response.body)
  // console.log(error.response.body.errors[0].message)
})
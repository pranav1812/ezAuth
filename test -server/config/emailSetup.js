// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//   process.env.OAUTH_CLIENT_ID,
//   process.env.OAUTH_CLIENT_SECRET,
//   "http://localhost:3000" // redirect URL
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.OAUTH_REFRESH_TOKEN,
// });
// const accessToken = oauth2Client.getAccessToken();

// const smtpTransport = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: process.env.EMAIL_ID,
//     clientId: process.env.OAUTH_CLIENT_ID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.OAUTH_REFRESH_TOKEN,
//     accessToken: accessToken,
//   },
// });

// module.exports = smtpTransport;

const nodemailer = require("nodemailer");
const smtpTransport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fd8e9bada47be8",
    pass: "7f5a07d645cf87",
  },
});
// smtp: {
//   user: "fd8e9bada47be8",
//   pass: "7f5a07d645cf87",
// },
module.exports = smtpTransport;

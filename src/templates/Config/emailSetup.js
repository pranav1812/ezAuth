module.exports = function (name) {
  return `
    const nodemailer = require("nodemailer");
    const smtpTransport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    module.exports = smtpTransport;
    
          `;
};

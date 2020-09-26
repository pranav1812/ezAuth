module.exports = function (name) {
  return `
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
    
          `;
};

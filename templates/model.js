module.exports = function (name) {
  return `
    const mongoose = require("mongoose");
    
    const ${name}Schema = new mongoose.Schema({
      name: {
        type: String,
        maxlength: 250,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        required: true,
      },
      phoneNo: {
        type: Number,
        unique: true,
        // required: true,
      },
      password: {
        type: String,
        minlength: 8,
        maxlength: 100,
        // required: true,
      },
      verificationToken: {
        type: String,
        default: null,
      },
      verificationTokenValid: {
        type: Date,
        default: null,
      },
      resetToken: {
        type: String,
        default: null,
      },
      resetTokenValid: {
        type: Date,
        default: null,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    });
    const ${name}Model = mongoose.model(${name}, schema);
    module.exports = ${name}Model;
    
      `;
};

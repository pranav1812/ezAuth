
    const mongoose = require("mongoose");
    
    const clientsSchema = new mongoose.Schema({
      
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
      
      
      },
      password: {
        type: String,
        minlength: 8,
        maxlength: 100,
      
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
    const clientsModel = mongoose.model('clients', clientsSchema);
    module.exports = clientsModel;
    
      
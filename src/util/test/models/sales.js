
      const mongoose = require("mongoose");
      
      const salesSchema = new mongoose.Schema({
        name: {
          type: String,
          maxlength: 250,
          required: true,
        },
        description: {
          type: String,
          unique: true,
          required: true,
        },
        dateCreated:{
            type: Date,
            default :  true
        }
    });
      const salesModel = mongoose.model('sales', salesSchema);
      module.exports = salesModel;
      
        
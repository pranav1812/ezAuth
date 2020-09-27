
      const mongoose = require("mongoose");
      
      const productsSchema = new mongoose.Schema({
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
      const productsModel = mongoose.model('products', productsSchema);
      module.exports = productsModel;
      
        
module.exports = function (name) {
  return `
      const mongoose = require("mongoose");
      
      const ${name}Schema = new mongoose.Schema({
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
      const ${name}Model = mongoose.model('${name}', ${name}Schema);
      module.exports = ${name}Model;
      
        `;
};

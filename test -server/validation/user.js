const Joi = require("joi");

exports.validatePost = (body) => {
  const schema = Joi.object({
    name: Joi.string().max(250).trim().required(),
    email: Joi.string().email().required(),
    phoneNo: Joi.string()
      .length(10)
      .trim()
      .pattern(/[6-9]{1}[0-9]{9}/)
      .required(),
    password: Joi.string().min(5).max(100).trim().required(),
    confirmPassword: Joi.string().min(5).max(100).trim().required(),
  });
  //! change acc to schema
  return schema.validate(body);
};

module.exports = function (name, modePath) {
  return `
          
  const router = require("express").Router();
  const crypto = require("crypto");
  const { omit } = require("lodash");
  const bcrypt = require("bcryptjs");
  const smtpTransport = require("../config/emailSetup");
  
  const isAuthenticated = require("../middleware/${name}Auth");//!create
  // const validation = require("../validation/user");//!create
  
  const ${name}Model = require('${modePath}');
  
  router.get("/protected", isAuthenticated, (req, res) => {
    res.send("reached ${name} protected route");
  });
  
  router.get("/all", async (req, res) => {
    const ${name} = await ${name}Model.find();
    res.send(${name});
  });
  
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).send("ID is required");
    const ${name} = await ${name}Model.findById(id);
    res.send(${name});
  });
  
  // * Basic Post
  router.post("/new", async (req, res) => {
    try {
      // const { value, error } = validation.validatePost(req.body);
      // if (error) return res.status(400).send(error.details[0].message);
  
      const reqBody = omit(req.body, ["phoneNo", "password", "confirmPassword"]);
    
      if (req.body.password !== req.body.confirmPassword)
        return res.status(400).send("Passwords do not match.");
  
      let ${name} = await ${name}Model.findOne({ email: req.body.email });
      if (${name})
        return res.status(400).send("given email id is already registered");
  
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
  
    
  
      const new${name} = new ${name}Model({
        ...reqBody,
        phoneNo: Number(req.body.phoneNo),
        password: password,
      });
      await new${name}.save();
      res.send(new${name}); 
    } catch (error) {
      console.log("ERROR...\\n", error);
      res.status(400).send("Server denied request.");
    }
  });
  
  router.post("/profile/changePassword", isAuthenticated, async (req, res) => {
    try {
      // const { value, error } = validationSchema.changePassword(req.body);
      // if (error) return res.status(400).send(error.details[0].message);
  
      if (req.body.password !== req.body.confirmPassword)
        return res.status(400).send("Passwords do not match.");
  
      const ${name} = await ${name}Model.findById(req.user._id).exec();
  
      const passwordMatch = await bcrypt.compare(
        req.body.oldPassword,
        ${name}.password
      );
  
      if (!passwordMatch) return res.status(400).send("Incorrect Password.");
  
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(req.body.password, salt);
  
      ${name}.password = newPassword;
      await ${name}.save();
  
      res.send(${name});
    } catch (error) {
      console.log(error);
      res.status(400).send("Server denied request.");
    }
  });
  
  // * Verify Email ( Send link to email )
  router.get("/profile/verifyEmail/", isAuthenticated, async (req, res) => {
    try {
      let ${name} = await ${name}Model.findById(req.user._id).exec();
      if (!${name}) return res.status(400).send("${name} does not exist.");
  
      const generateToken = async () => {
        return await new Promise((resolve, reject) => {
          crypto.randomBytes(50, (err, buf) => {
            if (err) reject("unable to generate token.");
            resolve(buf.toString("hex"));
          });
        });
      };
  
      const token = await generateToken();
  
     
    
      const dt = new Date();
      ${name}.verificationTokenValid = dt.setMinutes(dt.getMinutes() + 30); // 30 mins
      ${name}.verificationToken = token;
  
      await ${name}.save();
    
      const emailRes = await smtpTransport.sendMail({
        to: ${name}.email,
        from: \`"Medic" <"ezAUTH@gmail.com">\`,
        subject: "Email Verification.",
        text:
          'Click the link to verify your email.\\n' +
          \`http://localhost:5000/api/user/profile/verifyEmail/\${token}\`, // ! <- Add link for client website
      });
     
      return res
        .status(200)
        .send(\`Email has been sent to \${${name}.email} with further instructions.\`);
      
    } catch (error) {
      console.log(error);
      res.status(400).send("Server denied request.");
    }
  });
  
  // * Verify Email ( Click the link sent to email )
  router.get("/profile/verifyEmail/:token", async (req, res) => {
    try {
      if (!req.params.token) return res.status(400).send("No token provided");
      let ${name} = await ${name}Model.findOne({
        verificationToken: req.params.token,
        verificationTokenValid: { $gte: new Date() },
      }).exec();
      if (!${name}) return res.status(400).send("Invalid Email Verification Link");
  
      ${name}.verified = true;
      ${name}.verificationToken = null;
      ${name}.verificationTokenValid = null;
  
      ${name} = await ${name}.save();
  
      res.status(200).send(\`\${${name}.email} was verified successfully.\`);
    } catch (error) {
      console.log(error);
      res.status(400).send("Server denied request.");
    }
  });
  
  // * Forgot Password ( Send link to email )
  router.post("/forgotPassword", async (req, res) => {
    try {
      let ${name} = await ${name}Model.findOne({
        email: req.body.email,
      }).exec();
      if (!${name}) return res.status(400).send("User not found.");
       const buf = await crypto.randomBytes(25);
      const resetToken = buf.toString("hex");
      const dt = new Date();
  
     
      ${name}.resetToken = resetToken;
      ${name}.resetTokenValid = dt.setMinutes(dt.getMinutes() + 15); // 15 mins
  
      await ${name}.save();
      
      smtpTransport
        .sendMail({
          to: \`\${${name}.email}\`,
          from: \`"Medic" <\${"ezAuth@gmail.com"}>\`,
          subject: "Link for Reset Password.",
          text:
            'Click the link to reset your accounts password.\\n' +
            \`http://localhost:5000/api/user/forgotPassword/\${resetToken}\`, // ! <- Add link for client website
        })
        .then((info) => {
          console.log("Email sent\\n", info);
          // callback("Email Sent.");
        })
        .catch((err) => console.log(err));
     
      return res.send(
        \`Email has been sent to \${${name}.email} with further instructions.\`
      );
    
    } catch (error) {
      console.log(error);
      res.status(400).send("Server denied request.");
    }
  });
  
  // * Forgot Password ( Set new password )
  // * Done
  router.post("/forgotPassword/:token", async (req, res) => {
    try {
      // const { value, error } = validationSchema.forgotPassword(req.body);
      // if (error) return res.status(400).send(error.details[0].message);
  
      let ${name} = await ${name}Model.findOne({
        resetToken: req.params.token,
        resetTokenValid: { $gte: new Date() },
      }).exec();
  
      if (!${name}) return res.status(400).send("Invalid Password Reset Link.");
  
      if (req.body.password !== req.body.confirmPassword)
        return res.status(400).send("Passwords do not match.");
  
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(req.body.password, salt);
  
      ${name}.password = newPassword;
      ${name}.resetToken = null;
      ${name}.resetTokenValid = null;
      await ${name}.save();
  
      res.send(${name});
    } catch (error) {
      console.log(error);
      res.status(400).send("Server denied request.");
    }
  });
  
  module.exports = router;
  
  
          `;
};

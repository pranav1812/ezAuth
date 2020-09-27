
          
  const router = require("express").Router();
  const crypto = require("crypto");
  const { omit } = require("lodash");
  const bcrypt = require("bcryptjs");
  const smtpTransport = require("../config/emailSetup");
  
  const isAuthenticated = require("../middleware/clientsAuth");//!create
  // const validation = require("../validation/user");//!create
  
  const clientsModel = require('../models/clients');
  
  router.get("/protected", isAuthenticated, (req, res) => {
    res.send("reached clients protected route");
  });
  
  router.get("/all", async (req, res) => {
    const clients = await clientsModel.find();
    res.send(clients);
  });
  
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).send("ID is required");
    const clients = await clientsModel.findById(id);
    res.send(clients);
  });
  
  // * Basic Post
  router.post("/new", async (req, res) => {
    try {
      // const { value, error } = validation.validatePost(req.body);
      // if (error) return res.status(400).send(error.details[0].message);
  
      const reqBody = omit(req.body, ["phoneNo", "password", "confirmPassword"]);
    
      if (req.body.password !== req.body.confirmPassword)
        return res.status(400).send("Passwords do not match.");
  
      let clients = await clientsModel.findOne({ email: req.body.email });
      if (clients)
        return res.status(400).send("given email id is already registered");
  
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
  
    
  
      const newclients = new clientsModel({
        ...reqBody,
        phoneNo: Number(req.body.phoneNo),
        password: password,
      });
      await newclients.save();
      res.send(newclients); 
    } catch (error) {
      console.log("ERROR...\n", error);
      res.status(400).send("Server denied request.");
    }
  });
  
  router.post("/profile/changePassword", isAuthenticated, async (req, res) => {
    try {
      // const { value, error } = validationSchema.changePassword(req.body);
      // if (error) return res.status(400).send(error.details[0].message);
  
      if (req.body.password !== req.body.confirmPassword)
        return res.status(400).send("Passwords do not match.");
  
      const clients = await clientsModel.findById(req.user._id).exec();
  
      const passwordMatch = await bcrypt.compare(
        req.body.oldPassword,
        clients.password
      );
  
      if (!passwordMatch) return res.status(400).send("Incorrect Password.");
  
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(req.body.password, salt);
  
      clients.password = newPassword;
      await clients.save();
  
      res.send(clients);
    } catch (error) {
      console.log(error);
      res.status(400).send("Server denied request.");
    }
  });
  
  // * Verify Email ( Send link to email )
  router.get("/profile/verifyEmail/", isAuthenticated, async (req, res) => {
    try {
      let clients = await clientsModel.findById(req.user._id).exec();
      if (!clients) return res.status(400).send("clients does not exist.");
  
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
      clients.verificationTokenValid = dt.setMinutes(dt.getMinutes() + 30); // 30 mins
      clients.verificationToken = token;
  
      await clients.save();
    
      const emailRes = await smtpTransport.sendMail({
        to: clients.email,
        from: `"Medic" <"ezAUTH@gmail.com">`,
        subject: "Email Verification.",
        text:
          'Click the link to verify your email.\n' +
          `http://localhost:5000/api/user/profile/verifyEmail/${token}`, // ! <- Add link for client website
      });
     
      return res
        .status(200)
        .send(`Email has been sent to ${clients.email} with further instructions.`);
      
    } catch (error) {
      console.log(error);
      res.status(400).send("Server denied request.");
    }
  });
  
  // * Verify Email ( Click the link sent to email )
  router.get("/profile/verifyEmail/:token", async (req, res) => {
    try {
      if (!req.params.token) return res.status(400).send("No token provided");
      let clients = await clientsModel.findOne({
        verificationToken: req.params.token,
        verificationTokenValid: { $gte: new Date() },
      }).exec();
      if (!clients) return res.status(400).send("Invalid Email Verification Link");
  
      clients.verified = true;
      clients.verificationToken = null;
      clients.verificationTokenValid = null;
  
      clients = await clients.save();
  
      res.status(200).send(`${clients.email} was verified successfully.`);
    } catch (error) {
      console.log(error);
      res.status(400).send("Server denied request.");
    }
  });
  
  // * Forgot Password ( Send link to email )
  router.post("/forgotPassword", async (req, res) => {
    try {
      let clients = await clientsModel.findOne({
        email: req.body.email,
      }).exec();
      if (!clients) return res.status(400).send("User not found.");
       const buf = await crypto.randomBytes(25);
      const resetToken = buf.toString("hex");
      const dt = new Date();
  
     
      clients.resetToken = resetToken;
      clients.resetTokenValid = dt.setMinutes(dt.getMinutes() + 15); // 15 mins
  
      await clients.save();
      
      smtpTransport
        .sendMail({
          to: `${clients.email}`,
          from: `"Medic" <${"ezAuth@gmail.com"}>`,
          subject: "Link for Reset Password.",
          text:
            'Click the link to reset your accounts password.\n' +
            `http://localhost:5000/api/user/forgotPassword/${resetToken}`, // ! <- Add link for client website
        })
        .then((info) => {
          console.log("Email sent\n", info);
          // callback("Email Sent.");
        })
        .catch((err) => console.log(err));
     
      return res.send(
        `Email has been sent to ${clients.email} with further instructions.`
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
  
      let clients = await clientsModel.findOne({
        resetToken: req.params.token,
        resetTokenValid: { $gte: new Date() },
      }).exec();
  
      if (!clients) return res.status(400).send("Invalid Password Reset Link.");
  
      if (req.body.password !== req.body.confirmPassword)
        return res.status(400).send("Passwords do not match.");
  
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(req.body.password, salt);
  
      clients.password = newPassword;
      clients.resetToken = null;
      clients.resetTokenValid = null;
      await clients.save();
  
      res.send(clients);
    } catch (error) {
      console.log(error);
      res.status(400).send("Server denied request.");
    }
  });
  
  module.exports = router;
  
  
          
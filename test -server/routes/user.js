const name = "User";
const modelPath = "../models/user";

const router = require("express").Router();
const crypto = require("crypto");
const { omit } = require("lodash");
const bcrypt = require("bcryptjs");
const smtpTransport = require("../config/emailSetup");

const isAuthenticated = require("../middleware/authUser");
const validation = require("../validation/user");

// * Models
const Model = require("../models/user");

router.get("/protected", isAuthenticated, (req, res) => {
  res.send("reached user protected route");
});

router.get("/all", async (req, res) => {
  const docs = await Model.find();
  res.send(docs);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("ID is required");
  const doc = await Model.findById(id);
  res.send(doc);
});

// * Basic Post
router.post("/new", async (req, res) => {
  try {
    const { value, error } = validation.validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const reqBody = omit(value, ["phoneNo", "password", "confirmPassword"]);
    console.log(value.password);
    console.log(value.confirmPassword);
    if (value.password !== value.confirmPassword)
      return res.status(400).send("Passwords do not match.");

    let doc = await Model.findOne({ email: value.email });
    if (doc)
      return res.status(400).send("given email id is already registered");

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(value.password, salt);

    //! check for duplicate phone number

    const newDoc = new Model({
      ...reqBody,
      phoneNo: Number(value.phoneNo),
      password: password,
    });
    await newDoc.save();
    res.send(newDoc); //! omit password
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

    const doc = await Model.findById(req.user._id).exec();

    const passwordMatch = await bcrypt.compare(
      req.body.oldPassword,
      doc.password
    );

    if (!passwordMatch) return res.status(400).send("Incorrect Password.");

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    doc.password = newPassword;
    await doc.save();

    res.send(doc);
  } catch (error) {
    console.log(error);
    res.status(400).send("Server denied request.");
  }
});

// * Verify Email ( Send link to email )
router.get("/profile/verifyEmail/", isAuthenticated, async (req, res) => {
  try {
    let doc = await Model.findById(req.user._id).exec();
    if (!doc) return res.status(400).send("DOC does not exist.");

    const generateToken = async () => {
      return await new Promise((resolve, reject) => {
        crypto.randomBytes(50, (err, buf) => {
          if (err) reject("unable to generate token.");
          resolve(buf.toString("hex"));
        });
      });
    };

    const token = await generateToken();

    // ! Not sure if this is the best approach or not.( Not a doc usage. )

    // async.parallel(
    //   [
    // function (callback) {
    const dt = new Date();
    doc.verificationTokenValid = dt.setMinutes(dt.getMinutes() + 30); // 30 mins
    doc.verificationToken = token;

    await doc.save();
    // .then(() => {
    //   console.log("User Updated.");
    //   callback("User Updated");
    // })
    // .catch((err) => callback(err));
    // }
    // function (callback) {
    const emailRes = await smtpTransport.sendMail({
      to: doc.email,
      from: `"Medic" <${"ezAUTH@gmail.com"}>`,
      subject: "Email Verification.",
      text:
        `Click the link to verify your email.\n` +
        `http://localhost:5000/api/user/profile/verifyEmail/${token}`, // ! <- Add link for client website
    });
    // .then((info) => {
    //   // console.log("Email sent\n", info);
    // })
    // .catch((err) => console.log("error occured while sending mail\n\n", err));
    // }
    // ],
    // function (err) {
    return res
      .status(200)
      .send(`Email has been sent to ${doc.email} with further instructions.`);
    // }
    // );
  } catch (error) {
    console.log(error);
    res.status(400).send("Server denied request.");
  }
});

// * Verify Email ( Click the link sent to email )
router.get("/profile/verifyEmail/:token", async (req, res) => {
  try {
    if (!req.params.token) return res.status(400).send("No token provided");
    let doc = await Model.findOne({
      verificationToken: req.params.token,
      verificationTokenValid: { $gte: new Date() },
    }).exec();
    if (!doc) return res.status(400).send("Invalid Email Verification Link");

    doc.verified = true;
    doc.verificationToken = null;
    doc.verificationTokenValid = null;

    doc = await doc.save();

    res.status(200).send(`${doc.email} was verified successfully.`);
  } catch (error) {
    console.log(error);
    res.status(400).send("Server denied request.");
  }
});

// * Forgot Password ( Send link to email )
router.post("/forgotPassword", async (req, res) => {
  try {
    let doc = await Model.findOne({
      email: req.body.email,
    }).exec();
    if (!doc) return res.status(400).send("User not found.");
    //! ? change this maybe
    const buf = await crypto.randomBytes(25);
    const resetToken = buf.toString("hex");
    const dt = new Date();

    // ! Not sure if this is the best approach or not.( Not a doc usage. )
    // async.parallel(
    //   [
    //     function (callback) {
    doc.resetToken = resetToken;
    doc.resetTokenValid = dt.setMinutes(dt.getMinutes() + 15); // 15 mins

    await doc.save();
    // .then(() => {
    //   console.log("User Updated.");
    // })
    // .catch((err) => console.log(err));
    // }
    // function (callback) {
    smtpTransport
      .sendMail({
        to: `${doc.email}`,
        from: `"Medic" <${"ezAuth@gmail.com"}>`,
        subject: "Link for Reset Password.",
        text:
          `Click the link to reset your accounts password.\n` +
          `http://localhost:5000/api/user/forgotPassword/${resetToken}`, // ! <- Add link for client website
      })
      .then((info) => {
        console.log("Email sent\n", info);
        // callback("Email Sent.");
      })
      .catch((err) => console.log(err));
    // },
    // ],
    // function (err) {
    return res.send(
      `Email has been sent to ${doc.email} with further instructions.`
    );
    // }
    // );
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

    let doc = await Model.findOne({
      resetToken: req.params.token,
      resetTokenValid: { $gte: new Date() },
    }).exec();

    if (!doc) return res.status(400).send("Invalid Password Reset Link.");

    if (req.body.password !== req.body.confirmPassword)
      return res.status(400).send("Passwords do not match.");

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    doc.password = newPassword;
    doc.resetToken = null;
    doc.resetTokenValid = null;
    await doc.save();

    res.send(doc);
  } catch (error) {
    console.log(error);
    res.status(400).send("Server denied request.");
  }
});

module.exports = router;

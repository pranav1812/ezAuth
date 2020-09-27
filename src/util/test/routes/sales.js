
        
const router = require("express").Router();
const crypto = require("crypto");
const { omit } = require("lodash");
const bcrypt = require("bcryptjs");


// const validation = require("../validation/user");//!create

const salesModel = require('../models/sales');


router.get("/all", async (req, res) => {
  const sales = await salesModel.find();
  res.send(sales);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("ID is required");
  const sales = await salesModel.findById(id);
  res.send(sales);
});

// * Basic Post
router.post("/new", async (req, res) => {
  try {
    // const { value, error } = validation.validatePost(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    const reqBody = omit(req.body, ["phoneNo", "password", "confirmPassword"]);
  
    if (req.body.password !== req.body.confirmPassword)
      return res.status(400).send("Passwords do not match.");

    let sales = await salesModel.findOne({ email: req.body.email });
    if (sales)
      return res.status(400).send("given email id is already registered");

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    //! check for duplicate phone number

    const newsales = new salesModel({
      ...reqBody,
      phoneNo: Number(req.body.phoneNo),
      password: password,
    });
    await newsales.save();
    res.send(newsales); //! omit password
  } catch (error) {
    console.log("ERROR...\n", error);
    res.status(400).send("Server denied request.");
  }
});
module.exports = router;

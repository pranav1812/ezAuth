
        
const router = require("express").Router();
const crypto = require("crypto");
const { omit } = require("lodash");
const bcrypt = require("bcryptjs");


// const validation = require("../validation/user");//!create

const productsModel = require('../models/products');


router.get("/all", async (req, res) => {
  const products = await productsModel.find();
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("ID is required");
  const products = await productsModel.findById(id);
  res.send(products);
});

// * Basic Post
router.post("/new", async (req, res) => {
  try {
    // const { value, error } = validation.validatePost(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    const reqBody = omit(req.body, ["phoneNo", "password", "confirmPassword"]);
  
    if (req.body.password !== req.body.confirmPassword)
      return res.status(400).send("Passwords do not match.");

    let products = await productsModel.findOne({ email: req.body.email });
    if (products)
      return res.status(400).send("given email id is already registered");

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    //! check for duplicate phone number

    const newproducts = new productsModel({
      ...reqBody,
      phoneNo: Number(req.body.phoneNo),
      password: password,
    });
    await newproducts.save();
    res.send(newproducts); //! omit password
  } catch (error) {
    console.log("ERROR...\n", error);
    res.status(400).send("Server denied request.");
  }
});
module.exports = router;

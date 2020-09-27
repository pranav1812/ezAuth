
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require("cors");

const app = express();
//* Route imports
const sales = require("./routes/sales");
const products = require("./routes/products");
const leads = require("./routes/leads");
const clients = require("./routes/clients");
const leadsAuth_google = require("./routes/leads-google-Auth");
const leadsAuth_local = require("./routes/leads-local-Auth");
const clientsAuth_google = require("./routes/clients-google-Auth");
const clientsAuth_local = require("./routes/clients-local-Auth");


// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24, //24 HOURS
    secret: process.env.COOKIE_SECRET
  })
);

// * Passport Setup
require("./config/leads-google-passportStrategy");
require("./config/leads-local-passportStrategy");
require("./config/clients-google-passportStrategy");
require("./config/clients-local-passportStrategy");

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport_Serialize_Deserialize");

// * Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on ${PORT}`));

// * DB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to db "))
  .catch((err) => console.log("error in connecting to db ", err));

// * Routes setup
app.use("/api/sales", sales);
app.use("/api/products", products);

app.use("/api/leads/", leads);
app.use("/api/auth/google/leads/", leadsAuth_google );
app.use("/api/auth/local/leads/", leadsAuth_local );
app.use("/api/clients/", clients);
app.use("/api/auth/google/clients/", clientsAuth_google );
app.use("/api/auth/local/clients/", clientsAuth_local );


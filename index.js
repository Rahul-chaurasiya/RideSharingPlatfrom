const session = require("express-session");
// const { Client } = require('@googlemaps/google-maps-services-js');
// const client = new Client({});
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
// const { app, port } = require("../index.js");

const app = express();
const port = 8080;

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Ride_sharing");
}

main().then(() => {
  console.log("connecton successful")
}).catch((err) => {
  console.log(err);
})

app.use(express.json())

// Route Middleware for Protected Routes
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    console.log("Authenticated" + req.session.user.name)
    return next();
  }
  return res.status(401).send("Unauthorized: Please log in first.");
}

app.use(
  session({
    secret: "gammaedge",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);

const router = require('./routes/userRoute')  
app.use('/', router);

// Fetch all Users   
app.use('/users', isAuthenticated, router)

// Add A New User In DB
app.use("/signup", jsonParser, router)

// Login and create session
app.use("/login", jsonParser, router);

// Update Profile
app.use("/edit", jsonParser, isAuthenticated, router);

// Logout
app.use("/logout", router);

// Protected route
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`Welcome to your dashboard, ${req.session.user.name}!`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

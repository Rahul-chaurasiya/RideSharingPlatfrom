const session = require("express-session");
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

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
        secret: "rahul@123",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 600000 },
    })
);





























const userRouter = require('./routes/userRoute')
const rideRouter = require('./routes/rideRoute')

app.use('/', userRouter);

// Fetch all Users   
app.use('/users', isAuthenticated, userRouter)

// Add A New User In DB
app.use("/signup", jsonParser, userRouter)

// Login and create session
app.use("/login", jsonParser, userRouter);

// Update Profile
app.use("/edit", jsonParser, isAuthenticated, userRouter);

// Logout
app.use("/logout", userRouter);

// Add a new Ride
app.use("/ride", isAuthenticated, jsonParser, rideRouter);

// Protected route
app.get("/dashboard", isAuthenticated, (req, res) => {
    res.send(`Welcome to your dashboard, ${req.session.user.name}!`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

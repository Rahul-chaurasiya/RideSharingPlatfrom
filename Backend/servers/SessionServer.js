const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./models/User");

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 },
  })
);

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Route Middleware for Protected Routes
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.status(401).send("Unauthorized: Please log in first.");
}

// Routes
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists!");
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.send("User registered successfully!");
  } catch (error) {
    res.status(500).send("Error during signup!");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).send("Invalid email or password!");
    }

    req.session.user = user; // Store user in session
    res.send("Login successful!");
  } catch (error) {
    res.status(500).send("Error during login!");
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error during logout!");
    }
    res.send("Logged out successfully!");
  });
});

// Protected route
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`Welcome to your dashboard, ${req.session.user.name}!`);
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

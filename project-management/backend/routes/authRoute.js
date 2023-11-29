const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/userModel");

// Login route
router.post(
  "/login",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      console.log("Attempting to log in with credentials:", email, password);

      const user = await User.findOne({ email });

      if (!user || user.password !== password) {
        console.log("User not found or password doesn't match");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("Login successful");

      const userRole = user.role;

      res.status(200).json({ message: "Login successful", role: userRole });
    } catch (err) {
      console.error("Login process error:", err.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;

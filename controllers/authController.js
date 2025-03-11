const Admin = require("../models/Admin"); // Ensure this is your Admin model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in the Admin collection
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Ensure user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({ message: "You are not authorized as an admin." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.json({ token, isAdmin: user.isAdmin });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

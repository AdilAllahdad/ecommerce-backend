const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin"); // Ensure this model exists
const { adminLogin } = require("../controllers/authController");

const router = express.Router();

// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin with isAdmin: true ✅
    const admin = new Admin({ name, email, password: hashedPassword, isAdmin: true });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Admin Register Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Admin Login Route
router.post("/admin/login", adminLogin); // ✅ Ensure this route is set

module.exports = router;

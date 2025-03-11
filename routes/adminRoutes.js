const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

// Check if admin exists
router.get("/check-admin", async (req, res) => {
  const adminExists = await Admin.exists({});
  res.json({ adminExists: !!adminExists }); // true if admin exists, false otherwise
});

// Admin registration (Allowed only if no admin exists)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await Admin.exists({});
    if (adminExists) {
      return res.status(403).json({ message: "Admin registration is closed" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword, isAdmin: true });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin" });
  }
});

// Admin login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const admin = await Admin.findOne({ email });

//     if (!admin || !(await bcrypt.compare(password, admin.password))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({ token, isAdmin: true });
//   } catch (error) {
//     res.status(500).json({ message: "Login error" });
//   }
// });


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Ensure isAdmin is set in the database
    if (!admin.isAdmin) {
      return res.status(403).json({ message: "You are not authorized as an admin." });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, isAdmin: admin.isAdmin }, // Pass isAdmin from DB
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, isAdmin: admin.isAdmin }); // ✅ Ensure isAdmin is sent
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

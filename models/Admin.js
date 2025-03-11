const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: true },
});

module.exports = mongoose.model("Admin", AdminSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if the password was modified
  const salt = await bcrypt.genSalt(10); // Generate a salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// Compare entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare passwords
};

const User = mongoose.model('User', userSchema);

module.exports = User;

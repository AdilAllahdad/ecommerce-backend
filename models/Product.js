const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  old_price: Number,  
  new_price: Number,  
  category: String,
  imageUrl: String,
});

module.exports = mongoose.model("Product", ProductSchema);

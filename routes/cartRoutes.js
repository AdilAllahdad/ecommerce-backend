const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware"); 
const Cart = require("../models/Cart");

// Add to Cart (Requires Authentication)
router.post("/add", verifyUser, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; 

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    if (cart.products.includes(productId)) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    cart.products.push(productId);
    await cart.save();

    res.json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

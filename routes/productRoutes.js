const express = require("express");
const Product = require("../models/Product");
const verifyAdmin = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Add Product with Image Upload (Admin only)
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({ name, description, price, category, imageUrl });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// Get all products
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Error fetching products" });
//   }
// });


router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// Update a product (Admin only)
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    console.log("\n🔹 Received update request for product:", req.params.id);
    console.log("🔹 Request body:", req.body);
    console.log("🔹 Uploaded file:", req.file);

    const { name, description, old_price, new_price, category } = req.body;
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "Missing product ID" });
    }

    // Ensure old_price and new_price are converted to numbers
    let updateData = {
      name,
      description,
      old_price: old_price ? parseFloat(old_price) : undefined, 
      new_price: new_price ? parseFloat(new_price) : undefined,
      category,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    console.log("🔹 Update Data to be saved:", updateData);

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("✅ Product updated successfully:", updatedProduct);
    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




// Delete a product (Admin only)
router.delete("/delete/:id", verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;

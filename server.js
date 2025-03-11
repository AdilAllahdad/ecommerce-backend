require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");


const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");  
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); 
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.listen(process.env.PORT, () => console.log("Server running on port 5000"));



// -------------------------










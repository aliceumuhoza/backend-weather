const express = require("express");
const Product = require("../models/productModel");
const Market = require("../models/marketModel");
const router = express.Router();

// Create product
router.post("/", async (req, res) => {
  try {
    const market = await Market.findById(req.body.marketId); // Adjust marketId to match frontend field
    if (!market) return res.status(404).json({ message: "Market not found" });

    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      market_id: req.body.marketId,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "market_id",
      populate: {
        path: "district_id",
        select: "name", // Select only the fields you need
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by price
router.get("/price/:price", async (req, res) => {
  try {
    const product = await Product.find({ price: req.params.price });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("market_id");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const market = await Market.findById(req.body.market_id);
    if (!market) return res.status(404).json({ message: "Market not found" });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(204).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

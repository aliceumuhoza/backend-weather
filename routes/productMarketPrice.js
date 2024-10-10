const express = require("express");
const router = express.Router();
const ProductMarketPrice = require("../models/productMarketPriceModel");


// Add a new product market price
router.post("/", async (req, res) => {
  const { product_id, market_id, price } = req.body;

  try {
    const newPrice = new ProductMarketPrice({ product_id, market_id, price });
    await newPrice.save();
    res.status(201).json(newPrice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get all product market prices
router.get("/", async (req, res) => {
  try {
    const prices = await ProductMarketPrice.find().populate("product_id market_id");
    res.status(200).json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

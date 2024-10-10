const express = require("express");
const router = express.Router();
const MarketProduct = require("../models/marketProductsModel");


// Add a new market product
router.post("/", async (req, res) => {
  const { product_id, market_id } = req.body;

  try {
    const newMarketProduct = new MarketProduct({ product_id, market_id });
    await newMarketProduct.save();
    res.status(201).json(newMarketProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get all market products
router.get("/", async (req, res) => {
  try {
    const marketProducts = await MarketProduct.find().populate("product_id market_id");
    res.status(200).json(marketProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

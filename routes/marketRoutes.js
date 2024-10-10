const express = require("express");
const Market = require("../models/marketModel");
const District = require("../models/districtModel");
const router = express.Router();

// Create market
router.post("/", async (req, res) => {
  try {
    const district = await District.findById(req.body.district_id);
    if (!district)
      return res.status(404).json({ message: "District not found" });

    const newMarket = new Market(req.body);
    const savedMarket = await newMarket.save();
    res.status(201).json(savedMarket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all markets
router.get("/", async (req, res) => {
  try {
    const markets = await Market.find().populate("district_id");
    res.status(200).json(markets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get market by ID
router.get("/:id", async (req, res) => {
  try {
    const market = await Market.findById(req.params.id).populate("district_id");
    if (!market) return res.status(404).json({ message: "Market not found" });

    res.status(200).json(market);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update market
router.put("/:id", async (req, res) => {
  try {
    const updatedMarket = await Market.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedMarket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete market
router.delete("/:id", async (req, res) => {
  try {
    await Market.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Market deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

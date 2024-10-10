const express = require("express");
const District = require("../models/districtModel");
const router = express.Router();

// Create a district
router.post("/", async (req, res) => {
  try {
    const newDistrict = new District(req.body);
    const savedDistrict = await newDistrict.save();
    res.status(201).json(savedDistrict);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all districts
router.get("/", async (req, res) => {
  try {
    const districts = await District.find();
    res.status(200).json(districts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a district by ID
router.delete("/:id", async (req, res) => {
  try {
    const district = await District.findByIdAndDelete(req.params.id);
    if (!district) {
      
      return res.status(404).json({ message: "District not found" });
    }
    res.status(200).json({ message: "District deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

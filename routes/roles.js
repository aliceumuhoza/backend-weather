const express = require("express");
const router = express.Router();
const Role = require("../models/rolesModel");

// Add a new role
router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const newRole = new Role({ name });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const Staff = require("../models/staffModel");
const District = require("../models/districtModel");
const Role = require("../models/rolesModel"); // Import Role model


// Create staff with role and return staff with role name populated
router.post("/", async (req, res) => {
  try {
    const district = await District.findById(req.body.district_id);
    if (!district) return res.status(404).json({ message: "District not found" });

    const role = await Role.findById(req.body.role); // Find the role by ID
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds
    const newStaff = new Staff({ ...req.body, password: hashedPassword }); // Create the staff with hashed password
    const savedStaff = await newStaff.save();

    // Populate the role and return the saved staff with role name
    const populatedStaff = await Staff.findById(savedStaff._id)
      .populate("district_id")
      .populate({
        path: "role",
        select: "name", // Only return the role name
      });

    res.status(201).json(populatedStaff); // Send back the populated staff
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all staff with their roles
router.get("/", async (req, res) => {
  try {
    const staff = await Staff.find().populate("district_id role"); // Populate role field
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login staff
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Get email and password from the request body
  try {
    const staff = await Staff.findOne({ email })
      .populate('role', 'name') // Populate role name
      .populate('district_id', 'name'); // Populate district name

    if (!staff) {
      return res.status(401).json({ message: "Invalid email or password" }); // Send error if user doesn't exist
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" }); // Send error if password doesn't match
    }

    // Remove sensitive information before sending the response
    const { password: _, ...staffData } = staff._doc;

    res.status(200).json(staffData); // Send back staff data without the password
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle any server errors
  }
});


// Get staff by ID
router.get("/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate('role') // Populate the role field
      .populate('district_id'); // Populate the district_id field

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.status(200).json(staff);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update staff
router.put("/:id", async (req, res) => {
  try {
    // If the password is updated, hash it
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10); // Hash the new password
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStaff);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete staff
router.delete("/:id", async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Staff deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

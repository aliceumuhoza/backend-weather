const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { // Reference to Role model
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  district_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
    required: true,
  },
});

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;

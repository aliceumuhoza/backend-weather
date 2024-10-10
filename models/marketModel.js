const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
    required: true,
  },
});

const Market = mongoose.model("Market", marketSchema);
module.exports = Market;

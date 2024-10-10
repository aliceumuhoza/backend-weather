const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  market_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

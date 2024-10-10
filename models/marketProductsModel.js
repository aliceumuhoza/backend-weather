const mongoose = require("mongoose");

const marketProductSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  market_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
    required: true,
  },
});

const MarketProduct = mongoose.model("MarketProduct", marketProductSchema);
module.exports = MarketProduct;

const mongoose = require("mongoose");

const productMarketPriceSchema = new mongoose.Schema({
  market_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: { type: Number, required: true },
});

const ProductMarketPrice = mongoose.model("ProductMarketPrice", productMarketPriceSchema);
module.exports = ProductMarketPrice;

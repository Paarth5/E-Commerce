const mongoose = require("mongoose");
const Reviews = require("./reviews");
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: Reviews }],
  tag: {
    type: String,
    enum: ["None", "Grocery", "Books", "Sports", "Clothes", "Electronics"],
  },
});

module.exports = mongoose.model("Product", productSchema);

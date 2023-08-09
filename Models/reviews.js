const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  username: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  description: String,
});

module.exports = mongoose.model("Review", reviewSchema);

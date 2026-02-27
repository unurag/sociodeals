const mongoose = require("mongoose");

const saleInfoSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const mainSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  details: [saleInfoSchema]
});

module.exports = mongoose.model("Sales", mainSchema);
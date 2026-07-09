const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fullName: String,

    phone: String,

    address: String,

    city: String,

    state: String,

    pincode: String,

    country: {
      type: String,
      default: "India",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Address", addressSchema);
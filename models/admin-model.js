const mongoose = require("mongoose");
const adminSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: Number,
    },
    Organization: {
      type: String,
    },
    adminProfile: {
      type: String,
    },
    agreement: {
      type: Boolean,
    },
    description: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    tiktok: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", adminSchema);

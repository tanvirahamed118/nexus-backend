const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
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
    country: {
      type: String,
    },
    instagram: {
      type: String,
    },
    tiktok: {
      type: String,
    },
    youtube: {
      type: String,
    },
    snapchat: {
      type: String,
    },
    facebook: {
      type: String,
    },
    profile: {
      type: String,
    },
    video: {
      type: String,
    },
    agreement: {
      type: Boolean,
    },
    bio: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);

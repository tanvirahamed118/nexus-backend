const mongoose = require("mongoose");
const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    adminPic: {
      type: String,
    },
    adminName: {
      type: String,
    },
    condition: {
      type: String,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    star: {
      type: String,
    },
    requirement: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);

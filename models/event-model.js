const mongoose = require("mongoose");
const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    eventPic: {
      type: String,
    },
    adminPic: {
      type: String,
    },
    adminName: {
      type: String,
    },
    condition: {
      type: Array,
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
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);

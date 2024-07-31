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
    conditions: {
      type: Object,
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
    requirements: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);

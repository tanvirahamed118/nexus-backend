const mongoose = require("mongoose");
const applySchema = mongoose.Schema(
  {
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    message: {
      type: String,
    },
    eventTitle: {
      type: String,
    },
    eventID: {
      type: String,
    },
    profile: {
      type: String,
    },
    status: {
      type: String,
    },
    eventPic: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("apply", applySchema);

const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    nameOfEST: {
      type: String,
    },
    RPPersonName: {
      type: String,
    },
    position: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("brand", brandSchema);

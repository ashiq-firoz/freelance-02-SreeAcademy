const mongoose = require("mongoose");

const eventsSchema = mongoose.Schema(
  {
    start: { //day
      type: String,
      required: [true, "Please add day"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Please add title"],
      trim: true,
    },
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Events = mongoose.model("Events", eventsSchema);
module.exports = Events;

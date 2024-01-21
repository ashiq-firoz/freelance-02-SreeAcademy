const mongoose = require("mongoose");

const hallOfFrameSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    student: {
      type: String,
      required: [true, "Please add student"],
      trim: true,
    },
    img: {
      type: String,
      default : ""
    },
  },
  {
    timestamps: true,
  }
);

const HallOfFrame = mongoose.model("HallOfFrame", hallOfFrameSchema);
module.exports = HallOfFrame;

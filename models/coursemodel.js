const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please add name"],
      trim: true,
    },
    expiry: {
      type: Date,
    },
    noOfClass: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;

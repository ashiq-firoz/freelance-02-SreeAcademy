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
    img: {
      type: String,
    },
    noOfClass: {
      type: Number,
    },
    fee : {
      type : Number,
      default : 0,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;

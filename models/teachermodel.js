const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
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
    start_date: {
      type: String,
    },
    resigning_date: {
      type: String,
      default : "None",
    },
    dob: {
      type: Date,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    attendance: {
      type: String,
    },
   
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;

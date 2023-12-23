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
    adminNo: {
      type: String,
    },
    dateOfAdmission: {
      type: Date,
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
    watchList: {
      type: Boolean,
    },
    star: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
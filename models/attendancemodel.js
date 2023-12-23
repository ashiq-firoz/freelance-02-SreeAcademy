const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Please add course"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Please add date"],
    },
    studentName: {
      type: String,
      required: [true, "Please add studentName"],
      trim: true,
    },
    admissionNo: {
      type: String,
      required: [true, "Please add admissionNo"],
      trim: true,
    },
    present: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;

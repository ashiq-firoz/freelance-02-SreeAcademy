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
      trim: true,
      default : "All"
    },
    date: {
      type: String,
      required: [true, "Please add date"],
    },
    
    admissionNo: {
      type: String,
      required: [true, "Please add admissionNo"],
      trim: true,
    },
    present: {
      type: Boolean,
    },
    teacher : {
      type : Boolean,
      default : false,
    }
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;

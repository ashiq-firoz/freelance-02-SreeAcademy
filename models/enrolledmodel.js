const mongoose = require("mongoose");

const enrolledSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    admissionNo: {
      type: String,
    },
    course: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Enrolled = mongoose.model("Enrolled", enrolledSchema);
module.exports = Enrolled;

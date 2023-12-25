const mongoose = require("mongoose");

const guardiansSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    student: { //admno
      type: String,
      required: [true, "Please add student"],
      trim: true,
    },
    parent: {
      type: String,
      required: [true, "Please add parent"],
      trim: true,
    },
    guardian: {
      type: String,
      trim: true,
    },
    phone1: {
      type: String,
      trim: true,
    },
    phone2: {
      type: String,
      trim: true,
      default : ""
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default : ""
    },
  },
  {
    timestamps: true,
  }
);

const Guardians = mongoose.model("Guardians", guardiansSchema);
module.exports = Guardians;

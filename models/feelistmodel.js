const mongoose = require("mongoose");

const feelistSchema = mongoose.Schema(
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
    total: {
      type: Number,
    },
    due: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Feelist = mongoose.model("Feelist", feelistSchema);
module.exports = Feelist;

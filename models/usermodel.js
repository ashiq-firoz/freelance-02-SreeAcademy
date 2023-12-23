const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add email"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add password"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

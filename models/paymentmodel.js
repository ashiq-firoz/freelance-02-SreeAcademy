const mongoose = require("mongoose");

const paymentHistorySchema = mongoose.Schema(
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
    date: {
      type: Date,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentHistory = mongoose.model("PaymentHistory", paymentHistorySchema);
module.exports = PaymentHistory;

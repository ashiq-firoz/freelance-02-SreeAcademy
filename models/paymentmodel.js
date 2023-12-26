const mongoose = require("mongoose");

const paymentHistorySchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    student: { //adm no
      type: String,
      required: [true, "Please add student"],
      trim: true,
    },
    reciptno:{
      type : String,
    },
    date: {
      type: Date,
    },
    amount: {
      type: Number,
    },
    balance : {
      type : Number,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentHistory = mongoose.model("PaymentHistory", paymentHistorySchema);
module.exports = PaymentHistory;

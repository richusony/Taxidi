import mongoose from "mongoose";

const userTransactions = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentMessage: {
      type: String,
      required: true,
    },
    credited: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

const UserTransactionModel = mongoose.model(
  "user_transactions",
  userTransactions,
);

export default UserTransactionModel;

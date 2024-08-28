import mongoose from "mongoose";

const hostTransactions = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hosts",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicles",
    },
    commissionToAdmin: {
      type: Number,
      required: true,
    },
    balanceAfterCommission: {
      type: Number,
      required: true,
    },
    credited: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true },
);

const HostTransactionModel = mongoose.model(
  "host_transactions",
  hostTransactions,
);

export default HostTransactionModel;

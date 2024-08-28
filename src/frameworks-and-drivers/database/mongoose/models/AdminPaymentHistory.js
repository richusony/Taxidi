import mongoose from "mongoose";

const adminTransactions = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
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

const AdminTransactionModel = mongoose.model(
  "admin_transactions",
  adminTransactions,
);

export default AdminTransactionModel;

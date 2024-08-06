import mongoose from "mongoose";

const adminWalletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    }
  },
  { timestamps: true },
);

const AdminWalletModel = mongoose.model("admin_wallet", adminWalletSchema);

export default AdminWalletModel
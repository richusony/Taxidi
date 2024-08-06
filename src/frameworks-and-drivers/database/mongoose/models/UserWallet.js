import mongoose from "mongoose";

const userWalletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    }
  },
  { timestamps: true },
);

const UserWalletModel = mongoose.model("user_wallet", userWalletSchema);

export default UserWalletModel
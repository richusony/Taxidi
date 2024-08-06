import mongoose from "mongoose";

const hostWalletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hosts",
      required: true,
    }
  },
  { timestamps: true },
);

const HostWalletModel = mongoose.model("host_wallet", hostWalletSchema);

export default HostWalletModel

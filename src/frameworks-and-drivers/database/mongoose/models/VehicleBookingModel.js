import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "host",
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
    bookingStatus: {
      type: Boolean,
      required: true,
      default: true,
    },
    bookingCancelReason: {
      type: String,
    },
  },
  { timestamps: true },
);

const VehicleBookingModel = mongoose.model("vehicle_booking", bookingSchema);

export default VehicleBookingModel;

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewMessage: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicles",
      required: true,
    },
  },
  { timestamps: true },
);

const VehicleReviewModel = mongoose.model("vehicle_reivew", reviewSchema);

export default VehicleReviewModel;

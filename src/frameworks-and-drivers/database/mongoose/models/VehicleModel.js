import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "brands",
    },
    color: {
      type: String,
    },
    bodyType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "body-types",
    },
    fuel: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      required: true,
    },
    seats: {
      type: String,
      required: true,
    },
    registerationNumber: {
      type: String,
      required: true,
      unique:true
    },
    mileage: {
      type: String,
      required: true,
    },
    pickUpLocation: {
      type: String,
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
  },
  { timestamps: true }
);

export const VehicleModel = mongoose.model("vehicles", vehicleSchema);

import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brands",
    },
    color: {
      type: String,
    },
    bodyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "body-types",
    },
    fuel: {
      type: String,
    },
    transmission: {
      type: String,
    },
    seats: {
      type: String,
    },
    vehicleRegistrationNumber: {
      type: String,
    },
    registrationCertificateFrontImage: {
      type: String,
    },
    registrationCertificateBackImage: {
      type: String,
    },
    mileage: {
      type: String,
    },
    city: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    pickUpLocation: {
      type: String,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "host",
    },
    vehicleImages: {
      type: Array,
    },
    insuranceCertificateImage: {
      type: String,
    },
    pollutionCertificateImage: {
      type: String,
    },
    rent: {
      type: Number
    }
  },
  { timestamps: true }
);

export const VehicleModel = mongoose.model("vehicles", vehicleSchema);

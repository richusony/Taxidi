import mongoose from "mongoose";

const hostRequestSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brands",
    },
    bodyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "body-types",
    },
    transmission: {
      type: String,
      required: true,
    },
    fuel: {
      type: String,
      required: true,
    },
    mileage: {
      type: String,
      required: true,
    },
    seats: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    vehicleRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    registrationCertificateFrontImage: {
      type: String,
      required: true,
    },
    registrationCertificateBackImage: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    licenseFrontImage: {
      type: String,
      required: true,
    },
    licenseBackImage: {
      type: String,
      required: true,
    },
    insuranceCertificateImage: {
      type: String,
      required: true,
    },
    pollutionCertificateImage: {
      type: String,
      required: true,
    },
    vehicleImages: {
      type: Array,
    }
  },
  { timestamps: true }
);

const HostRequestModel = mongoose.model("host-request", hostRequestSchema);

export default HostRequestModel;

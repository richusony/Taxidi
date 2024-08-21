import mongoose from "mongoose";

const licenseVerifySchema = new mongoose.Schema(
  {
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export const LicenseVerifyModel = mongoose.model(
  "license-verifies",
  licenseVerifySchema
);

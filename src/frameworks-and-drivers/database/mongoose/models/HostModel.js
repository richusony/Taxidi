import mongoose from "mongoose";

const hostSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
    blocked: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const HostModel = mongoose.model("host", hostSchema);

export default HostModel;

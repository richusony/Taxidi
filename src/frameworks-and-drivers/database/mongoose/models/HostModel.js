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
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      default: "host",
    },
    blocked: {
      type: Boolean,
      required: true,
    },
    profileImage: {
      type: String,
      default: "https://t4.ftcdn.net/jpg/04/83/90/87/360_F_483908736_1HvJO1XjPHsvjeWJWANspi7i0tN0pYrP.jpg"
    }
  },
  { timestamps: true },
);

const HostModel = mongoose.model("host", hostSchema);

export default HostModel;

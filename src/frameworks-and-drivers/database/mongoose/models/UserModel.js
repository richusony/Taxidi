import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
  },
  city: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  licenseNumber: {
    type: String,
  },
  licenseFrontImage: {
    type: String,
  },
  licenseBackImage: {
    type: String,
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
    default: "user",
  },
  blocked: {
    type: String,
  },
});

export const UserModel = mongoose.model("users", userSchema);

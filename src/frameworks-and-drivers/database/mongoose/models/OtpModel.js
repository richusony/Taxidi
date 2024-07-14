import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "5m" }, // OTP expires in 5 minutes
});

export const OtpModel = mongoose.model("Otp", otpSchema);

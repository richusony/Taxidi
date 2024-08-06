import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { OtpModel } from "../database/mongoose/models/OtpModel.js";

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const getAccessToken = async () => {
  try {
    const { token } = await oauth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error("Error getting access token:", error.message);
    throw new Error("Failed to obtain access token");
  }
};

const createTransporter = async () => {
  const accessToken = await getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
    },
  });
};

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Your OTP Code - Taxidi",
    text: `Your OTP code is: ${otp}`,
    html: `<p>Your OTP code is: <b>${otp}</b></p>`,
  };

  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: " + error.message);
    throw error;
  }
};

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const createAndSendOtp = async (email) => {
  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await OtpModel.create({ email, otp: hashedOtp });

  await sendOtpEmail(email, otp);
};

export const verifyOtp = async (email, otp) => {
  const otpEntry = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

  if (!otpEntry) {
    return false;
  }

  const isValid = await bcrypt.compare(otp, otpEntry.otp);
  return isValid;
};

export const sendHostApprovalMail = async (to, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Host Approval - Taxidi",
    html: `<p>Your request to become a host on Taxidi has been approved. You can log in to your account using your email and the following password.</p>
<p>Your Taxidi Login Password: <b>${password}</b></p>`,
  };

  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: " + error.message);
    throw error;
  }
};

export const sendHostRejectionMail = async (to, rejectMessage) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Host Rejection - Taxidi",
    html: `<p>Unfortunately your request has been rejected. Reason: <h1 style="color:'red'; font-weight:700;">${rejectMessage}</h1>.<br> For further information contact Customer Care.</p>`,
  };

  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: " + error.message);
    throw error;
  }
};

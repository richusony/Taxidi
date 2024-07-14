import {
  createAndSendOtp,
  verifyOtp,
} from "../../frameworks-and-drivers/external-lib/emailService.js";

export class OtpController {
  async sendOtp(req, res) {
    console.log(req.body);
    const { email } = req.body;
    try {
      await createAndSendOtp(email);
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async verifyOtp(req, res) {
    const { email, otp } = req.body;
    try {
      const isValid = await verifyOtp(email, otp);

      if (isValid) {
        res.status(200).json({ message: "OTP verified successfully" });
      } else {
        res.status(400).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

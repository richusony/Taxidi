import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/helper.js";
import jwt from "jsonwebtoken";

export class HostLogin {
  constructor(hostRepository) {
    this.hostRepository = hostRepository;
  }

  async findHostByEmail(email) {
    return this.hostRepository.findByEmail(email);
  }

  async execute(email, password) {
    const host = await this.hostRepository.findByEmail(email);
    if (!host) {
      throw new Error("host not found");
    }

    const isPasswordValid = await bcrypt.compare(password, host.password);

    if (!isPasswordValid) {
      throw new Error("Incorrect Password");
    }

    const refreshToken = generateRefreshToken(host._id, host.email);
    const accessToken = generateAccessToken(host._id, host.email);
    host.refreshToken = refreshToken;
    await host.save({ validateBeforeSave: false });

    return { host, accessToken, refreshToken };
  }

  async auth(hostId) {
    try {
      return await this.hostRepository.findById(hostId);
    } catch (error) {
      console.log("HostLogin Usecase", error.message);
    }
  }

  async logoutWithRefreshToken(token) {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log(decoded);
    const host = await this.hostRepository.findByEmail(decoded?.email);

    if (!host) {
      throw new Error("host doesn't exists - RefreshToken");
    }

    if (token !== host?.refreshToken) {
      throw new Error("Invalid Refresh Token");
    }

    host.refreshToken = null;
    await host.save({ validateBeforeSave: false });

    return true;
  }
}

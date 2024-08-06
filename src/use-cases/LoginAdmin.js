import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/helper.js";

class LoginAdmin {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  async execute(email, password) {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error("Admin not found");
    }

    const isPasswordValid = password == admin.password;
    if (!isPasswordValid) {
      throw new Error("Incorrect Password");
    }

    const refreshToken = generateRefreshToken(admin._id, admin.email);
    const accessToken = generateAccessToken(admin._id, admin.email);
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { admin, accessToken, refreshToken };
  }

  async refreshToken(token) {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const admin = await this.adminRepository.findByEmail(decoded?.email);

    if (!admin) {
      throw new Error("admin doesn't exists - RefreshToken");
    }

    if (token !== admin?.refreshToken) {
      throw new Error("Invalid Refresh Token");
    }

    const accessToken = generateAccessToken(admin?._id, admin?.email);

    return { accessToken, refreshToken: token };
  }

  async auth(adminId) {
    try {
      return await this.adminRepository.findById(adminId);
    } catch (error) {
      console.log("LoginAdmin Usecase", error.message);
    }
  }

  async logoutWithRefreshToken(token) {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log(decoded);
    const admin = await this.adminRepository.findByEmail(decoded?.email);

    if (!admin) {
      throw new Error("admin doesn't exists - RefreshToken");
    }

    if (token !== admin?.refreshToken) {
      throw new Error("Invalid Refresh Token");
    }

    admin.refreshToken = null;
    await admin.save({ validateBeforeSave: false });

    return true;
  }
}

export default LoginAdmin;

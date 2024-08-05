import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/helper.js";

class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, password, googleLogin) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (googleLogin) {
      const refreshToken = generateRefreshToken(user._id, user.email);
      const accessToken = generateAccessToken(user._id, user.email);
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { user, refreshToken, accessToken };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect Password");
    }

    const refreshToken = generateRefreshToken(user._id, user.email);
    const accessToken = generateAccessToken(user._id, user.email);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, refreshToken, accessToken };
  }

  async refreshToken(token) {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await this.userRepository.findByEmail(decoded?.email);

    if (!user) {
      throw new Error("user doesn't exists - RefreshToken");
    }

    if (token !== user?.refreshToken) {
      throw new Error("Invalid Refresh Token");
    }

    const accessToken = generateAccessToken(user?._id, user?.email);
    // const refreshToken = generateRefreshToken(user?._id, user?.email);

    // user.refreshToken = refreshToken;
    // await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken: token };
  }

  async logoutWithRefreshToken(token) {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log(decoded);
    const user = await this.userRepository.findByEmail(decoded?.email);

    if (!user) {
      throw new Error("user doesn't exists - RefreshToken");
    }

    if (token !== user?.refreshToken) {
      throw new Error("Invalid Refresh Token");
    }

    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    return true;
  }
}

export default LoginUser;

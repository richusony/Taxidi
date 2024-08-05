import { UserRepository } from "../repositories/UserRepository.js";
import LoginUser from "../../use-cases/LoginUser.js";

const userRepository = new UserRepository();
const loginUser = new LoginUser(userRepository);

class LoginController {
  async login(req, res) {
    let cookieOptions;
    const { email, password, googleLogin } = req.body;
    try {
      const { user, refreshToken, accessToken } = await loginUser.execute(
        email,
        password,
        googleLogin,
      );

      if (process.env.NODE_ENV == "development") {
        cookieOptions = {
          httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
          sameSite: "Lax", // works for local development
        };
      }

      if (process.env.NODE_ENV == "production") {
        cookieOptions = {
          httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
          sameSite: "None", // works for local development
          secure: true,
        };
      }

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      // console.log("Access Token :: ", refreshToken);
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async userRefreshToken(req, res) {
    const incomingRefreshToken = req.cookies?.refreshToken;
    // console.log("refreshToken from frontend :", incomingRefreshToken);
    let cookieOptions;
    try {
      const { accessToken, refreshToken } =
        await loginUser.refreshToken(incomingRefreshToken);
      if (process.env.NODE_ENV == "development") {
        cookieOptions = {
          httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
          sameSite: "Lax", // works for local development
        };
      }

      if (process.env.NODE_ENV == "production") {
        cookieOptions = {
          httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
          sameSite: "None", // works for local development
          secure: true,
        };
      }
      console.log("acccess token refreshed");
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async logout(req, res) {
    const incomingRefreshToken = req.cookies?.refreshToken;
    try {
      const loggedOut = await loginUser.logoutWithRefreshToken(incomingRefreshToken);

      if (!loggedOut) {
        return res.status(400).json({error: "Something went wrong while logging out"});
      }

      if (process.env.NODE_ENV == "development") {
        console.log("reached developmet");
        res.cookie("accessToken", "", {
          httpOnly: true,
          expires: new Date(0), // Set the expiration date to the past to clear the cookie
          sameSite: "Lax",
        });
        res.cookie("refreshToken", "", {
          httpOnly: true,
          expires: new Date(0), // Set the expiration date to the past to clear the cookie
          sameSite: "Lax",
        });
      }

      if (process.env.NODE_ENV == "production") {
        res.cookie("accessToken", "", {
          httpOnly: true,
          expires: new Date(0), // Set the expiration date to the past to clear the cookie
          sameSite: "None",
          secure: true,
        });
        res.cookie("refreshToken", "", {
          httpOnly: true,
          expires: new Date(0), // Set the expiration date to the past to clear the cookie
          sameSite: "None",
          secure: true,
        });
      }
    res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({error: error.message});
    }
  }
}

export default LoginController;

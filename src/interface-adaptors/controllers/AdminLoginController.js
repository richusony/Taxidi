import LoginAdmin from "../../use-cases/LoginAdmin.js";
import { AdminRepository } from "../repositories/AdminRepository.js";

const adminRepository = new AdminRepository();
const loginAdmin = new LoginAdmin(adminRepository);

class AdminLoginController {
  async login(req, res) {
    const { email, password } = req.body;
    let cookieOptions;
    // console.log(email, password);
    try {
      const { admin, accessToken, refreshToken } = await loginAdmin.execute(
        email,
        password,
      );

      if (process.env.NODE_ENV == "development") {
        cookieOptions = {
          httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
          maxAge: 60 * 60 * 1000, // cookie age in seconds
          sameSite: "Lax", // works for local development
        };
      }

      if (process.env.NODE_ENV == "production") {
        cookieOptions = {
          httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
          maxAge: 60 * 60 * 1000, // cookie age in seconds
          sameSite: "None", // works for local development
          secure: true,
        };
      }

      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      // console.log(accessToken, "::::", refreshToken);
      res.status(200).json({ admin, accessToken, refreshToken });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async logout(req, res) {
    const incomingRefreshToken = req.cookies?.refreshToken;
    try {
      const loggedOut =
        await loginAdmin.logoutWithRefreshToken(incomingRefreshToken);

      if (!loggedOut) {
        return res
          .status(400)
          .json({ error: "Something went wrong while logging out" });
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
      res.status(400).json({ error: error.message });
    }
  }

  async adminRefreshToken(req, res) {
    const incomingRefreshToken = req.cookies?.refreshToken;
    // console.log("refreshToken from frontend :", incomingRefreshToken);
    let cookieOptions;
    try {
      const { accessToken, refreshToken } =
        await loginAdmin.refreshToken(incomingRefreshToken);
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
      console.log("admin acccess token refreshed");
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async authenticateAdmin(req, res) {
    try {
      const adminId = req.admin._id;
      const admin = await loginAdmin.auth(adminId);
      // console.log(admin);
      res.status(200).json({admin});
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}

export default AdminLoginController;

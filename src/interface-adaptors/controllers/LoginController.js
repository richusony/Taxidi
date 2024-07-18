import { UserRepository } from "../repositories/UserRepository.js";
import LoginUser from "../../use-cases/LoginUser.js";

const userRepository = new UserRepository();
const loginUser = new LoginUser(userRepository);

class LoginController {
  async login(req, res) {
    const { email, password, googleLogin } = req.body;
    let cookieOptions;
    try {
      // const passwordCorrect = await loginUser.checkPassword(password)
      // if(passwordCorrect == "User doesn't exists") {
      //   res.status(404).json({err: passwordCorrect})
      //   return;
      // } else if(passwordCorrect == "Invalid Password"){
      //   res.status(400).json({err: passwordCorrect})
      //   return;
      // }
      const { user, token } = await loginUser.execute(
        email,
        password,
        googleLogin
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

      res.cookie("jwt", token, cookieOptions);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

async logout(req, res) {
      console.log("reached api");
    if (process.env.NODE_ENV == "development") {
      console.log("reached developmet")
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), // Set the expiration date to the past to clear the cookie
        sameSite: "Lax",
      });
    }

    if (process.env.NODE_ENV == "production") {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), // Set the expiration date to the past to clear the cookie
        sameSite: "None",
        secure: true,
      });
    }
    res.status(200).json({ message: "Logged out successfully" });
  }
}

export default LoginController;

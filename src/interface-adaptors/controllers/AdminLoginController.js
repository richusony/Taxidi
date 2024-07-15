import LoginAdmin from "../../use-cases/LoginAdmin.js";
import { AdminRepository } from "../repositories/AdminRepository.js";

const adminRepository = new AdminRepository();
const loginAdmin = new LoginAdmin(adminRepository);

class AdminLoginController {
  async login(req, res) {
    const { email, password } = req.body;
    console.log(email, password)
    try {
      const { admin, token } = await loginAdmin.execute(
        email,
        password
      );

      const cookieOptions = {
        httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
        maxAge: 60 * 60 * 1000, // cookie age in seconds
        sameSite: "Lax", // works for local development
      };

      res.cookie("jwt", token, cookieOptions);
      res.status(200).json(admin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

async logout(req, res){
    res.cookie('jwt', '', { 
    httpOnly: true, 
    expires: new Date(0), // Set the expiration date to the past to clear the cookie
    sameSite: "Lax",
  });
  res.status(200).json({ message: 'Logged out successfully' });
}
}

export default AdminLoginController;

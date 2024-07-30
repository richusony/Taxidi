import Profile from "../../use-cases/Profile.js";
import { UserRepository } from "../repositories/UserRepository.js";

const userRepository = new UserRepository();
const profile = new Profile(userRepository);

export class UserProfileController {
  async getUser(req, res) {
    const { email } = req.user;
    // console.log("reached getUser fun ", email);
    try {
      const userData = await profile.execute(email);
      res.status(200).json(userData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default UserProfileController;

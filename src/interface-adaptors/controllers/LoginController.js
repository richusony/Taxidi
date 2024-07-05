import { UserRepository } from "../repositories/UserRepository.js";
import LoginUser from "../../use-cases/LoginUser.js";

const userRepository = new UserRepository();
const loginUser = new LoginUser(userRepository);

class LoginController {
    async login(req, res){
        const { email, password } = req.body;
        try {
            const { user, token } = await loginUser.execute(email,password);
            res.status(200).json({user, token});
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
}

export default LoginController;
import express from "express";
import { SignUpUser } from "../../../use-cases/SignUpUser.js";
import LoginController from "../../../interface-adaptors/controllers/LoginController.js";
import { UserController } from "../../../interface-adaptors/controllers/UserController.js";
import { UserRepository } from "../../../interface-adaptors/repositories/UserRepository.js";
import UserProfileController from "../../../interface-adaptors/controllers/UserProfileController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
const userRepository = new UserRepository();
const signUpUser = new SignUpUser(userRepository);
const userController = new UserController(signUpUser);
const loginController = new LoginController();
const userProfileController = new UserProfileController()


router.post("/signup", (req, res) => userController.signUp(req, res));

router.post("/login", (req, res) => loginController.login(req, res));

router.get("/profile", protectRoute, (req, res) => userProfileController.getUser(req, res))

export default router;

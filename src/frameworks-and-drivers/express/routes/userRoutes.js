import express from "express";
import { SignUpUser } from "../../../use-cases/SignUpUser.js";
import LoginController from "../../../interface-adaptors/controllers/LoginController.js";
import { UserController } from "../../../interface-adaptors/controllers/UserController.js";
import { UserRepository } from "../../../interface-adaptors/repositories/UserRepository.js";

const router = express.Router();
const userRepository = new UserRepository();
const signUpUser = new SignUpUser(userRepository);
const userController = new UserController(signUpUser);
const loginController = new LoginController

router.post("/signup", (req, res) => userController.signUp(req, res));

router.post("/login", (req, res) => loginController.login(req, res));

export default router;

import express from "express";
import { SignUpUser } from "../../../use-cases/SignUpUser.js";
import { UserController } from "../../../interface-adaptors/controllers/UserController.js";
import { UserRepository } from "../../../interface-adaptors/repositories/UserRepository.js";

const router = express.Router();
const userRepository = new UserRepository();
const signUpUser = new SignUpUser(userRepository);
const userController = new UserController(signUpUser);

router.post("/signup", (req, res) => userController.signUp(req, res));

export default router;

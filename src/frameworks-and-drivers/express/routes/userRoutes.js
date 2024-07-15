import express from "express";
import { SignUpUser } from "../../../use-cases/SignUpUser.js";
import LoginController from "../../../interface-adaptors/controllers/LoginController.js";
import { UserController } from "../../../interface-adaptors/controllers/UserController.js";
import { UserRepository } from "../../../interface-adaptors/repositories/UserRepository.js";
import { BrandRepository } from "../../../interface-adaptors/repositories/BrandRepository.js";
import UserProfileController from "../../../interface-adaptors/controllers/UserProfileController.js";
import protectRoute from "../middlewares/protectRoute.js";
import { UpdateUser } from "../../../use-cases/UpdateUser.js";
import { CreateBrand } from "../../../use-cases/CreateBrand.js";
import { OtpController } from "../../../interface-adaptors/controllers/OtpController.js";
import { BrandController } from "../../../interface-adaptors/controllers/BrandController.js";

const router = express.Router();

// Repositories
const userRepository = new UserRepository();
const brandRepository = new BrandRepository();

// Usecases
const signUpUser = new SignUpUser(userRepository);
const updateUser = new UpdateUser(userRepository);
const getAllBrand = new CreateBrand(brandRepository)

// Controllers
const otpController = new OtpController();
const loginController = new LoginController();
const userProfileController = new UserProfileController();
const brandController = new BrandController(getAllBrand)

// Routes
router.post("/send-otp", (req, res) => otpController.sendOtp(req, res));

router.post("/verify-otp", (req, res) => otpController.verifyOtp(req, res));

router.post("/signup", (req, res) => {
  const userController = new UserController(signUpUser);
  userController.signUp(req, res);
});

router.post("/login", (req, res) => loginController.login(req, res));

router.get("/profile", protectRoute, (req, res) =>
  userProfileController.getUser(req, res)
);

router.post("/update-user", protectRoute, (req, res) => {
  const userController = new UserController(updateUser);
  userController.update(req, res);
});

router.get("/brands", (req, res) => {
  brandController.getAllBrands(req, res);
})

router.get("/logout", protectRoute, (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 }); 
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;

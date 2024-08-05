import express from "express";
import Razorpay from "razorpay";
import { userParser } from "../../external-lib/multer.js";
import protectRoute from "../middlewares/protectRoute.js";
import { SignUpUser } from "../../../use-cases/SignUpUser.js";
import { UpdateUser } from "../../../use-cases/UpdateUser.js";
import { CreateBrand } from "../../../use-cases/CreateBrand.js";
import { OtpController } from "../../../interface-adaptors/controllers/OtpController.js";
import LoginController from "../../../interface-adaptors/controllers/LoginController.js";
import { UserController } from "../../../interface-adaptors/controllers/UserController.js";
import { UserRepository } from "../../../interface-adaptors/repositories/UserRepository.js";
import { BrandController } from "../../../interface-adaptors/controllers/BrandController.js";
import { BrandRepository } from "../../../interface-adaptors/repositories/BrandRepository.js";
import UserProfileController from "../../../interface-adaptors/controllers/UserProfileController.js";
import { UserUseCase } from "../../../use-cases/UserUseCase.js";
import { VehicleRepository } from "../../../interface-adaptors/repositories/VehicleRepository.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// Repositories
const userRepository = new UserRepository();
const brandRepository = new BrandRepository();

// Usecases
const signUpUser = new SignUpUser(userRepository);
const updateUser = new UpdateUser(userRepository);
const getAllBrand = new CreateBrand(brandRepository);

// Controllers
const otpController = new OtpController();
const loginController = new LoginController();
const userProfileController = new UserProfileController();
const brandController = new BrandController(getAllBrand);

// Routes
router.post("/send-otp", (req, res) => otpController.sendOtp(req, res));

router.post("/verify-otp", (req, res) => otpController.verifyOtp(req, res));

router.post("/signup", (req, res) => {
  const userController = new UserController(signUpUser);
  userController.signUp(req, res);
});

router.post("/login", (req, res) => loginController.login(req, res));

router.get("/profile", protectRoute, verifyRole("user"), (req, res) =>
  userProfileController.getUser(req, res),
);

router.post("/update-user", protectRoute, verifyRole("user"), (req, res) => {
  const userController = new UserController(updateUser);
  userController.update(req, res);
});

router.post(
  "/upload-driving-license",
  protectRoute,
  verifyRole("user"),
  userParser.fields([
    { name: "licenseFrontImage", maxCount: 1 },
    { name: "licenseBackImage", maxCount: 1 },
  ]),
  (req, res) => {
    const userController = new UserController(updateUser);
    userController.uploadLicense(req, res);
  },
);

router.get("/brands", (req, res) => {
  brandController.getAllBrands(req, res);
});

router.post("/orders", async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_SECRET_KEY,
  });

  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: "receipt#1",
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);

    res.status(200).json(response);
  } catch (error) {
    console.log("error :: ", error.message);
    res.status(500);
  }
});

router.get("/get-available-cars", (req, res) => {
  const vehicleRepository = new VehicleRepository();
  const userUseCase = new UserUseCase(vehicleRepository);
  const userController = new UserController(userUseCase);

  userController.getAllAvailableCars(req, res);
});

router.get("/car/:vehicleRegistrationNumber", (req, res) => {
  const vehicleRepository = new VehicleRepository();
  const userUseCase = new UserUseCase(vehicleRepository);
  const userController = new UserController(userUseCase);

  userController.getCarDetails(req, res);
});

router.post("/refresh-token", (req, res) => loginController.userRefreshToken(req, res));

router.get("/logout", protectRoute, verifyRole("user"), (req, res) => {
  loginController.logout(req, res);
});


export default router;

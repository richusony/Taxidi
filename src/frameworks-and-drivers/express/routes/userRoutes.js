import express from "express";
import { verifyRole } from "../middlewares/verifyRole.js";
import { userParser } from "../../external-lib/multer.js";
import protectRoute from "../middlewares/protectRoute.js";
import { SignUpUser } from "../../../use-cases/SignUpUser.js";
import { UpdateUser } from "../../../use-cases/UpdateUser.js";
import { CreateBrand } from "../../../use-cases/CreateBrand.js";
import { UserUseCase } from "../../../use-cases/UserUseCase.js";
import { BookingUseCase } from "../../../use-cases/BookingUseCase.js";
import { UserWalletUseCase } from "../../../use-cases/UserWalletUseCase.js";
import { VehicleReviewUseCase } from "../../../use-cases/VehicleReviewUseCase.js";
import { OtpController } from "../../../interface-adaptors/controllers/OtpController.js";
import LoginController from "../../../interface-adaptors/controllers/LoginController.js";
import { UserController } from "../../../interface-adaptors/controllers/UserController.js";
import { HostRepository } from "../../../interface-adaptors/repositories/HostRepository.js";
import { UserRepository } from "../../../interface-adaptors/repositories/UserRepository.js";
import { BrandController } from "../../../interface-adaptors/controllers/BrandController.js";
import { BrandRepository } from "../../../interface-adaptors/repositories/BrandRepository.js";
import { AdminRepository } from "../../../interface-adaptors/repositories/AdminRepository.js";
import { VehicleRepository } from "../../../interface-adaptors/repositories/VehicleRepository.js";
import UserProfileController from "../../../interface-adaptors/controllers/UserProfileController.js";

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

router.post("/book-vehicle", protectRoute, verifyRole("user"), (req, res) => {
  const vehicleRepository = new VehicleRepository();
  const userUseCase = new UserUseCase(vehicleRepository);
  const userController = new UserController(userUseCase);

  userController.bookVehicle(req, res);
});

router.post("/verify-booking", protectRoute, verifyRole("user"), (req, res) => {
  const vehicleRepository = new VehicleRepository();
  const adminRepository = new AdminRepository();
  const hostRepository = new HostRepository();
  const userUseCase = new BookingUseCase(
    userRepository,
    adminRepository,
    vehicleRepository,
    hostRepository,
  );
  const userController = new UserController(userUseCase);

  userController.verifyBooking(req, res);
});

router.post("/add-to-wallet", protectRoute, verifyRole("user"), (req, res) => {
  const userController = new UserController();
  userController.addMoneyToWallet(req, res);
});

router.post(
  "/verify-add-money-payment",
  protectRoute,
  verifyRole("user"),
  (req, res) => {
    const userUseCase = new UserWalletUseCase(userRepository);
    const userController = new UserController(userUseCase);

    userController.verifyPaymentForAddToWallet(req, res);
  },
);

router.post("/post-reivew", protectRoute, verifyRole("user"), (req, res) => {
  const vehicleRepository = new VehicleRepository();
  const reviewUseCase = new VehicleReviewUseCase(
    userRepository,
    vehicleRepository,
  );
  const userController = new UserController(reviewUseCase);

  userController.postReviewAndRating(req, res);
});

router.post("/vehicle-reivews", (req, res) => {
  const vehicleRepository = new VehicleRepository();
  const reviewUseCase = new VehicleReviewUseCase(
    userRepository,
    vehicleRepository,
  );
  const userController = new UserController(reviewUseCase);

  userController.getVehicleReviewsAndRating(req, res);
});

// router.post("/get-vehicle-reivews", protectRoute, verifyRole("user"), (req, res) => {

// });

router.get("/wallet", protectRoute, verifyRole("user"), (req, res) => {
  const useCse = new UserWalletUseCase(userRepository);
  const userController = new UserController(useCse);

  userController.getWallet(req, res);
});

router.post("/refresh-token", (req, res) =>
  loginController.userRefreshToken(req, res),
);

router.get("/logout", protectRoute, verifyRole("user"), (req, res) => {
  loginController.logout(req, res);
});

router.get("/bookings", protectRoute, verifyRole("user"), (req, res) => {
  const hostRepository = new HostRepository();
  const useCse = new UserUseCase(hostRepository);
  const userController = new UserController(useCse);

  userController.getAllBookings(req, res);
});

router.get("/booking-details/:paymentId", protectRoute, verifyRole("user"), (req, res) => {
  const hostRepository = new HostRepository();
  const useCse = new UserUseCase(hostRepository);
  const userController = new UserController(useCse);

  userController.getBookingDetails(req, res);
});

export default router;

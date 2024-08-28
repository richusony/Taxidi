import express from "express";
import { verifyRole } from "../middlewares/verifyRole.js";
import LoginAdmin from "../../../use-cases/LoginAdmin.js";
import { CreateBody } from "../../../use-cases/CreateBody.js";
import { AddVehicle } from "../../../use-cases/AddVehicle.js";
import { UpdateUser } from "../../../use-cases/UpdateUser.js";
import { CreateBrand } from "../../../use-cases/CreateBrand.js";
import { brandParser, parser } from "../../external-lib/multer.js";
import { CreateHost } from "../../../use-cases/host/CreateHost.js";
import { DeleteVehicle } from "../../../use-cases/DeleteVehicle.js";
import adminProtectRoute from "../middlewares/adminProtectRoute.js";
import { AdminMessages } from "../../../use-cases/AdminMessages.js";
import { GetAllVehicles } from "../../../use-cases/GetAllVehicles.js";
import { HostRequestUseCase } from "../../../use-cases/host/HostRequest.js";
import HostController from "../../../interface-adaptors/controllers/HostController.js";
import { BodyController } from "../../../interface-adaptors/controllers/BodyController.js";
import { UserController } from "../../../interface-adaptors/controllers/UserController.js";
import { UserRepository } from "../../../interface-adaptors/repositories/UserRepository.js";
import { HostRepository } from "../../../interface-adaptors/repositories/HostRepository.js";
import { BodyRepository } from "../../../interface-adaptors/repositories/BodyRepository.js";
import { BrandController } from "../../../interface-adaptors/controllers/BrandController.js";
import { AdminController } from "../../../interface-adaptors/controllers/AdminController.js";
import { AdminRepository } from "../../../interface-adaptors/repositories/AdminRepository.js";
import { BrandRepository } from "../../../interface-adaptors/repositories/BrandRepository.js";
import { VehicleController } from "../../../interface-adaptors/controllers/VehicleController.js";
import { VehicleRepository } from "../../../interface-adaptors/repositories/VehicleRepository.js";
import AdminLoginController from "../../../interface-adaptors/controllers/AdminLoginController.js";
import { AdminWalletUseCase } from "../../../use-cases/AdminWalletUseCase.js";

const router = express.Router();

const adminRepository = new AdminRepository();
const adminLogin = new LoginAdmin(adminRepository);
const adminController = new AdminLoginController();

const brandRepository = new BrandRepository();
const createBrand = new CreateBrand(brandRepository);
const brandController = new BrandController(createBrand);

const bodyRepository = new BodyRepository();
const createBody = new CreateBody(bodyRepository);
const bodyController = new BodyController(createBody);

const vehicleRepository = new VehicleRepository();

router.post("/login", (req, res) => adminController.login(req, res));

router.get("/auth", adminProtectRoute, verifyRole("admin"), (req, res) =>
  adminController.authenticateAdmin(req, res),
);

router.post(
  "/add-brand",
  adminProtectRoute,
  verifyRole("admin"),
  brandParser.single("brandImage"),
  (req, res) => brandController.createBrand(req, res),
);

router.post(
  "/edit-brand",
  adminProtectRoute,
  verifyRole("admin"),
  brandParser.single("brandImage"),
  (req, res) => brandController.updateBrand(req, res),
);

router.get("/brands", adminProtectRoute, verifyRole("admin"), (req, res) =>
  brandController.getAllBrands(req, res),
);

router.post("/add-body", adminProtectRoute, verifyRole("admin"), (req, res) =>
  bodyController.createBody(req, res),
);

router.get("/body-types", adminProtectRoute, verifyRole("admin"), (req, res) =>
  bodyController.getAllBody(req, res),
);

router.post(
  "/add-vehicle",
  parser.fields([
    { name: "registrationCertificateFrontImage", maxCount: 1 },
    { name: "registrationCertificateBackImage", maxCount: 1 },
    { name: "insuranceCertificateImage", maxCount: 1 },
    { name: "pollutionCertificateImage", maxCount: 1 },
    { name: "vehicleImages", maxCount: 15 },
  ]),
  (req, res) => {
    const creatVehicle = new AddVehicle(vehicleRepository);
    const vehicleController = new VehicleController(creatVehicle);
    vehicleController.addCar(req, res);
  },
);

router.get("/cars", adminProtectRoute, verifyRole("admin"), (req, res) => {
  const getVehicles = new GetAllVehicles(vehicleRepository);
  const vehicleController = new VehicleController(getVehicles);
  vehicleController.getAllCars(req, res);
});

router.get(
  "/cars/:registrationNumber",
  adminProtectRoute,
  verifyRole("admin"),
  (req, res) => {
    const getVehicles = new GetAllVehicles(vehicleRepository);
    const vehicleController = new VehicleController(getVehicles);
    vehicleController.getVehicleDetails(req, res);
  },
);

router.delete(
  "/car/:registrationNumber",
  adminProtectRoute,
  verifyRole("admin"),
  (req, res) => {
    const deleteVehicleUseCase = new DeleteVehicle(vehicleRepository);
    const vehicleController = new VehicleController(deleteVehicleUseCase);
    vehicleController.deleteVehicle(req, res);
  },
);

router.get(
  "/get-host-requests",
  adminProtectRoute,
  verifyRole("admin"),
  (req, res) => {
    const hostRepository = new HostRepository();
    const hostRequestUseCase = new HostRequestUseCase(hostRepository);
    const hostController = new HostController(hostRequestUseCase);

    hostController.getAllHostRequests(req, res);
  },
);

router.get(
  "/get-host-request-details/:vehicleRegistrationNumber",
  adminProtectRoute,
  verifyRole("admin"),
  (req, res) => {
    const hostRepository = new HostRepository();
    const hostRequestUseCase = new HostRequestUseCase(hostRepository);
    const hostController = new HostController(hostRequestUseCase);

    hostController.getHostRequestDetails(req, res);
  },
);

router.post(
  "/approve-host-request",
  adminProtectRoute,
  verifyRole("admin"),
  (req, res) => {
    const hostRepository = new HostRepository();
    const hostRequestUseCase = new HostRequestUseCase(hostRepository);
    const vehicleUseCase = new AddVehicle(vehicleRepository);
    const hostController = new HostController(
      hostRequestUseCase,
      vehicleUseCase,
    );

    hostController.approveHostRequest(req, res);
  },
);

router.post(
  "/reject-host-request",
  adminProtectRoute,
  verifyRole("admin"),
  (req, res) => {
    const hostRepository = new HostRepository();
    const hostRequestUseCase = new HostRequestUseCase(hostRepository);
    const vehicleUseCase = new AddVehicle(vehicleRepository);
    const hostController = new HostController(
      hostRequestUseCase,
      vehicleUseCase,
    );

    hostController.rejectHostRequest(req, res);
  },
);

router.get(
  "/license-verification-requests",
  adminProtectRoute,
  verifyRole("admin"),
  (req, res) => {
    const userRepository = new UserRepository();
    const userUseCase = new UpdateUser(userRepository);
    const userController = new UserController(userUseCase);

    userController.getAllLicenseVerifyRequest(req, res);
  },
);

router.get(
  "/get-license-request-details/:licenseNumber",
  adminProtectRoute,
  verifyRole("admin"),
  (req, res) => {
    const userRepository = new UserRepository();
    const userUseCase = new UpdateUser(userRepository);
    const userController = new UserController(userUseCase);

    userController.getLicenseRequest(req, res);
  },
);

router.post(
  "/approve-license-request",
  adminProtectRoute,
  verifyRole("admin"),
  (req, res) => {
    const userRepository = new UserRepository();
    const userUseCase = new UpdateUser(userRepository);
    const userController = new UserController(userUseCase);

    userController.saveApprovedLicense(req, res);
  },
);

router.get("/hosts", adminProtectRoute, verifyRole("admin"), (req, res) => {
  const hostRepository = new HostRepository();
  const hostUseCase = new CreateHost(hostRepository);
  const hostController = new HostController(hostUseCase);

  hostController.getAllHosts(req, res);
});

router.post("/send-message", adminProtectRoute, verifyRole("admin"), (req, res) => {
  const adminUseCase = new AdminMessages(adminRepository);
  const adminController = new AdminController(adminUseCase);

  adminController.sendMessageToHost(req, res);
});

router.get("/get-messages/:email", adminProtectRoute, verifyRole("admin"), (req, res) => {
  const adminUseCase = new AdminMessages(adminRepository);
  const adminController = new AdminController(adminUseCase);

  adminController.getHostMessages(req, res);
});

router.get("/wallet", adminProtectRoute, verifyRole("admin"), (req, res) => {
  const useCase = new AdminWalletUseCase(adminRepository);
  const adminController = new AdminController(useCase);

  adminController.getWallet(req, res);
});

router.get("/wallet-history", adminProtectRoute, verifyRole("admin"), (req, res) => {
  const useCase = new AdminWalletUseCase(adminRepository);
  const adminController = new AdminController(useCase);

  adminController.getWalletHistory(req, res);
});

router.post("/refresh-token", (req, res) =>
  adminController.adminRefreshToken(req, res)
);

router.get("/logout", adminProtectRoute, verifyRole("admin"), (req, res) =>
  adminController.logout(req, res),
);

export default router;

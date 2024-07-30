import express from "express";
import LoginAdmin from "../../../use-cases/LoginAdmin.js";
import { CreateBody } from "../../../use-cases/CreateBody.js";
import { AddVehicle } from "../../../use-cases/AddVehicle.js";
import { CreateBrand } from "../../../use-cases/CreateBrand.js";
import { brandParser, parser } from "../../external-lib/multer.js";
import adminProtectRoute from "../middlewares/adminProtectRoute.js";
import { GetAllVehicles } from "../../../use-cases/GetAllVehicles.js";
import { HostRequestUseCase } from "../../../use-cases/host/HostRequest.js";
import HostController from "../../../interface-adaptors/controllers/HostController.js";
import { BodyController } from "../../../interface-adaptors/controllers/BodyController.js";
import { HostRepository } from "../../../interface-adaptors/repositories/HostRepository.js";
import { BodyRepository } from "../../../interface-adaptors/repositories/BodyRepository.js";
import { BrandController } from "../../../interface-adaptors/controllers/BrandController.js";
import { AdminRepository } from "../../../interface-adaptors/repositories/AdminRepository.js";
import { BrandRepository } from "../../../interface-adaptors/repositories/BrandRepository.js";
import { VehicleController } from "../../../interface-adaptors/controllers/VehicleController.js";
import { VehicleRepository } from "../../../interface-adaptors/repositories/VehicleRepository.js";
import AdminLoginController from "../../../interface-adaptors/controllers/AdminLoginController.js";
import { UserController } from "../../../interface-adaptors/controllers/UserController.js";
import { UpdateUser } from "../../../use-cases/UpdateUser.js";
import { UserRepository } from "../../../interface-adaptors/repositories/UserRepository.js";
import { CreateHost } from "../../../use-cases/host/CreateHost.js";

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

router.get("/", adminProtectRoute, (req, res) => res.status(200));

router.post(
  "/add-brand",
  adminProtectRoute,
  brandParser.single("brandImage"),
  (req, res) => brandController.createBrand(req, res)
);

router.post(
  "/edit-brand",
  adminProtectRoute,
  brandParser.single("brandImage"),
  (req, res) => brandController.updateBrand(req, res)
);

router.get("/brands", adminProtectRoute, (req, res) =>
  brandController.getAllBrands(req, res)
);

router.post("/add-body", adminProtectRoute, (req, res) =>
  bodyController.createBody(req, res)
);

router.get("/body-types", adminProtectRoute, (req, res) =>
  bodyController.getAllBody(req, res)
);

router.post("/add-vehicle", parser.array("images", 10), (req, res) => {
  const creatVehicle = new AddVehicle(vehicleRepository);
  const vehicleController = new VehicleController(creatVehicle);
  vehicleController.addCar(req, res);
});

router.get("/cars", adminProtectRoute, (req, res) => {
  const getVehicles = new GetAllVehicles(vehicleRepository);
  const vehicleController = new VehicleController(getVehicles);
  vehicleController.getAllCars(req, res);
});

router.get("/cars/:registrationNumber", adminProtectRoute, (req, res) => {
  const getVehicles = new GetAllVehicles(vehicleRepository);
  const vehicleController = new VehicleController(getVehicles);
  vehicleController.getVehicleDetails(req, res);
});

router.get("/get-host-requests", adminProtectRoute, (req, res) => {
  const hostRepository = new HostRepository();
  const hostRequestUseCase = new HostRequestUseCase(hostRepository);
  const hostController = new HostController(hostRequestUseCase);

  hostController.getAllHostRequests(req, res);
});

router.get(
  "/get-host-request-details/:vehicleRegistrationNumber",
  adminProtectRoute,
  (req, res) => {
    const hostRepository = new HostRepository();
    const hostRequestUseCase = new HostRequestUseCase(hostRepository);
    const hostController = new HostController(hostRequestUseCase);

    hostController.getHostRequestDetails(req, res);
  }
);

router.post("/approve-host-request", adminProtectRoute, (req, res) => {
  const hostRepository = new HostRepository();
  const hostRequestUseCase = new HostRequestUseCase(hostRepository);
  const vehicleUseCase = new AddVehicle(vehicleRepository);
  const hostController = new HostController(hostRequestUseCase, vehicleUseCase);

  hostController.approveHostRequest(req, res);
});

router.post("/reject-host-request", adminProtectRoute, (req, res) => {
  const hostRepository = new HostRepository();
  const hostRequestUseCase = new HostRequestUseCase(hostRepository);
  const vehicleUseCase = new AddVehicle(vehicleRepository);
  const hostController = new HostController(hostRequestUseCase, vehicleUseCase);

  hostController.rejectHostRequest(req, res);
});

router.get("/license-verification-requests", adminProtectRoute, (req, res) => {
  const userRepository = new UserRepository();
  const userUseCase = new UpdateUser(userRepository);
  const userController = new UserController(userUseCase);

  userController.getAllLicenseVerifyRequest(req, res);
});

router.get(
  "/get-license-request-details/:licenseNumber",
  adminProtectRoute,
  (req, res) => {
    const userRepository = new UserRepository();
    const userUseCase = new UpdateUser(userRepository);
    const userController = new UserController(userUseCase);

    userController.getLicenseRequest(req, res);
  }
);

router.post("/approve-license-request", adminProtectRoute, (req, res) => {
  const userRepository = new UserRepository();
  const userUseCase = new UpdateUser(userRepository);
  const userController = new UserController(userUseCase);

  userController.saveApprovedLicense(req, res);
});

router.get("/hosts", adminProtectRoute, (req, res) => {
  const hostRepository = new HostRepository();
  const hostUseCase = new CreateHost(hostRepository);
  const hostController = new HostController(hostUseCase);

  hostController.getAllHosts(req, res);
});

router.get("/logout", adminProtectRoute, (req, res) =>
  adminController.logout(req, res)
);

export default router;

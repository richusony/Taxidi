import express from "express";
import { hostParser } from "../../external-lib/multer.js";
import { HostLogin } from "../../../use-cases/host/HostLogin.js";
import hostProtectedRoute from "../middlewares/hostProtectedRoute.js";
import { HostRequestUseCase } from "../../../use-cases/host/HostRequest.js";
import HostController from "../../../interface-adaptors/controllers/HostController.js";
import { HostRepository } from "../../../interface-adaptors/repositories/HostRepository.js";
import { HostUseCase } from "../../../use-cases/host/HostUseCase.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();
const hostRepository = new HostRepository();
// Routes
router.post(
  "/host-request",
  hostParser.fields([
    { name: "licenseFrontImage", maxCount: 1 },
    { name: "licenseBackImage", maxCount: 1 },
    { name: "registrationCertificateFrontImage", maxCount: 1 },
    { name: "registrationCertificateBackImage", maxCount: 1 },
    { name: "insuranceCertificateImage", maxCount: 1 },
    { name: "pollutionCertificateImage", maxCount: 1 },
    { name: "vehicleImages", maxCount: 15 },
  ]),
  (req, res) => {
    const hostRequestUseCase = new HostRequestUseCase(hostRepository);
    const hostController = new HostController(hostRequestUseCase);
    hostController.hostRequest(req, res);
  },
);

router.post("/host-login", (req, res) => {
  const hostUseCase = new HostLogin(hostRepository);
  const hostController = new HostController(hostUseCase);

  hostController.hostLogin(req, res);
});

router.get("/auth", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const hostUseCase = new HostLogin(hostRepository);
  const hostController = new HostController(hostUseCase);
  hostController.authenticateHost(req, res);
});

router.get("/", hostProtectedRoute, verifyRole("host"), (req, res) =>
  res.status(200),
);

router.get(
  "/host-vehicles",
  hostProtectedRoute,
  verifyRole("host"),
  (req, res) => {
    const hostUseCase = new HostUseCase(hostRepository);
    const hostController = new HostController(hostUseCase);

    hostController.getHostVehicles(req, res);
  },
);

router.get(
  "/cars/:vehicleNumber",
  hostProtectedRoute,
  verifyRole("host"),
  (req, res) => {
    const hostUseCase = new HostUseCase(hostRepository);
    const hostController = new HostController(hostUseCase);

    hostController.getHostCarDetails(req, res);
  },
);

router.post("/refresh-token", (req, res) => {
  const hostUseCase = new HostLogin(hostRepository);
  const hostController = new HostController(hostUseCase);
  hostController.hostRefreshToken(req, res);
});

router.get("/logout", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const hostUseCase = new HostLogin(hostRepository);
  const hostController = new HostController(hostUseCase);
  hostController.hostLogout(req, res);
});

export default router;

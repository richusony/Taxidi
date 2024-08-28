import express from "express";
import { verifyRole } from "../middlewares/verifyRole.js";
import { hostParser } from "../../external-lib/multer.js";
import { HostLogin } from "../../../use-cases/host/HostLogin.js";
import { HostUseCase } from "../../../use-cases/host/HostUseCase.js";
import hostProtectedRoute from "../middlewares/hostProtectedRoute.js";
import { HostRequestUseCase } from "../../../use-cases/host/HostRequest.js";
import HostController from "../../../interface-adaptors/controllers/HostController.js";
import { HostRepository } from "../../../interface-adaptors/repositories/HostRepository.js";
import { Messages } from "../../../use-cases/host/Messages.js";

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

router.get("/bookings", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const hostUseCase = new HostUseCase(hostRepository);
  const hostController = new HostController(hostUseCase);

  hostController.getAllBookings(req,res);
});

router.get("/booking-details/:paymentId", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const hostUseCase = new HostUseCase(hostRepository);
  const hostController = new HostController(hostUseCase);

  hostController.getBookingDetails(req,res);
});

router.post("/cancel-booking", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const hostUseCase = new HostUseCase(hostRepository);
  const hostController = new HostController(hostUseCase);

  hostController.cancelBooking(req, res);
});

router.get("/wallet", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const hostUseCase = new HostUseCase(hostRepository);
  const hostController = new HostController(hostUseCase);

  hostController.getWalletInfo(req, res);
});

router.get("/wallet-history", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const hostUseCase = new HostUseCase(hostRepository);
  const hostController = new HostController(hostUseCase);

  hostController.getWalletHistory(req, res);
});

router.post("/send-message", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const hostUseCase = new Messages(hostRepository);
  const hostController = new HostController(hostUseCase);

  hostController.sendMessageToAdmin(req, res);
});

router.get("/get-messages", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const hostUseCase = new Messages(hostRepository);
  const hostController = new HostController(hostUseCase);

  hostController.getAdminMessages(req, res);
});

router.patch("/update-vehicle", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const useCase = new HostUseCase(hostRepository);
  const hostController = new HostController(useCase);

  hostController.updateVehilce(req, res);
});

router.patch("/list/:vehicleId", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const useCase = new HostUseCase(hostRepository);
  const hostController = new HostController(useCase);

  hostController.listVehicle(req, res);
});

router.patch("/unlist/:vehicleId", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const useCase = new HostUseCase(hostRepository);
  const hostController = new HostController(useCase);

  hostController.unListVehicle(req, res);
});

router.get("/counts", hostProtectedRoute, verifyRole("host"), (req, res) => {
  const useCase = new HostUseCase(hostRepository);
  const hostController = new HostController(useCase);

  hostController.getCounts(req, res);
});

router.get("/chart-data/:filter", hostProtectedRoute, verifyRole("host"), (req,res) => {
  const useCase = new HostUseCase(hostRepository);
  const hostController = new HostController(useCase);

  hostController.getChartData(req, res);
});

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

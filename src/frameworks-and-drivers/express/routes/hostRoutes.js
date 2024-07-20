import express from "express";
import { hostParser } from "../../external-lib/multer.js";
import { HostRequestUseCase } from "../../../use-cases/host/HostRequest.js";
import HostController from "../../../interface-adaptors/controllers/HostController.js";
import { HostRepository } from "../../../interface-adaptors/repositories/HostRepository.js";

const router = express.Router();

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
  ]),
  (req, res) => {
    const hostRepository = new HostRepository();
    const hostRequestUseCase = new HostRequestUseCase(hostRepository);
    const hostController = new HostController(hostRequestUseCase);
    hostController.hostRequest(req, res);
  }
);

export default router;

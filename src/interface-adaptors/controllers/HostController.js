import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generatePassword } from "../../utils/helper.js";
import { passwordHashing } from "../../frameworks-and-drivers/external-lib/passwordHashing.js";
import {
  sendHostApprovalMail,
  sendHostRejectionMail,
} from "../../frameworks-and-drivers/external-lib/emailService.js";
import { uploadImages } from "../../frameworks-and-drivers/external-lib/imageUpload.js";

export default class HostController {
  constructor(hostUseCase, vehicleUseCase) {
    this.hostUseCase = hostUseCase;
    this.vehicleUseCase = vehicleUseCase;
  }

  async hostRequest(req, res) {
    const {
      fullname,
      email,
      phone,
      city,
      pincode,
      licenseNumber,
      registrationNumber,
      model,
      brand,
      bodyType,
      transmission,
      fuel,
      mileage,
      seats,
      color,
      rent,
    } = req.body;
    // console.log(req.files);

    const licenseFrontImage = req.files.licenseFrontImage[0].path;
    const licenseBackImage = req.files.licenseBackImage[0].path;
    const registrationCertificateFrontImage =
      req.files.registrationCertificateFrontImage[0].path;
    const registrationCertificateBackImage =
      req.files.registrationCertificateBackImage[0].path;
    const insuranceCertificateImage =
      req.files.insuranceCertificateImage[0].path;
    const pollutionCertificateImage =
      req.files.pollutionCertificateImage[0].path;
    const vehicleImages = await this.uploadFiles(req.files.vehicleImages);

    try {
      const hostRequest = await this.hostUseCase.execute(
        fullname,
        email,
        phone,
        city,
        pincode,
        licenseNumber,
        registrationNumber,
        model,
        brand,
        bodyType,
        transmission,
        fuel,
        mileage,
        seats,
        color,
        rent,
        licenseFrontImage,
        licenseBackImage,
        registrationCertificateFrontImage,
        registrationCertificateBackImage,
        insuranceCertificateImage,
        pollutionCertificateImage,
        vehicleImages
      );
      res.status(200).json(hostRequest);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
  async uploadFiles(files) {
    const urls = await uploadImages(files);
    return urls;
  }
  async getAllHostRequests(req, res) {
    try {
      const allRequests = await this.hostUseCase.getAllHostRequests();
      res.status(200).json(allRequests);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getHostRequestDetails(req, res) {
    const { vehicleRegistrationNumber } = req.params;
    try {
      const hostRequestDetails = await this.hostUseCase.getHostRequestDetails(
        vehicleRegistrationNumber
      );
      res.status(200).json(hostRequestDetails);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async approveHostRequest(req, res) {
    const {
      fullname,
      email,
      phone,
      city,
      pincode,
      licenseNumber,
      vehicleRegistrationNumber,
      model,
      brand,
      bodyType,
      transmission,
      fuel,
      mileage,
      seats,
      color,
      rent,
      licenseFrontImage,
      licenseBackImage,
      registrationCertificateFrontImage,
      registrationCertificateBackImage,
      insuranceCertificateImage,
      pollutionCertificateImage,
      vehicleImages,
    } = req.body;

    const hostPassword = await generatePassword();
    const hashedHostPassword = await passwordHashing(hostPassword);

    try {
      const createHost = await this.hostUseCase.createHost(
        fullname,
        email,
        phone,
        licenseNumber,
        licenseFrontImage,
        licenseBackImage,
        hashedHostPassword
      );

      const hostId = createHost._id;

      const AddVehicle = await this.vehicleUseCase.execute(
        model,
        brand,
        color,
        bodyType,
        fuel,
        transmission,
        seats,
        vehicleRegistrationNumber,
        registrationCertificateFrontImage,
        registrationCertificateBackImage,
        mileage,
        city,
        pincode,
        null,
        hostId,
        vehicleImages,
        insuranceCertificateImage,
        pollutionCertificateImage,
        rent
      );
      await sendHostApprovalMail(email, hostPassword);
      res.status(200).json({ message: "created host and added vehicle" });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async rejectHostRequest(req, res) {
    const { email, vehicleRegistrationNumber } = req.body;
    try {
    const deleteRequest = this.hostUseCase.deleteHostRequest(vehicleRegistrationNumber);
    await sendHostRejectionMail(email);
      console.log(error.message);
      res.status(400).json({ error: error.message });
    } catch (error) {}
  }

  async getAllHosts(req, res) {
    try {
      const hosts = await this.hostUseCase.getAllHosts();
      res.status(200).json(hosts);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async hostLogin(req, res) {
    const { email, password } = req.body;
    let cookieOptions;
    try {
      const host = await this.hostUseCase.findHostByEmail(email);
      // console.log(host);
      const isPasswordValid = await bcrypt.compare(password, host.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid Password" });
        return;
      }

      const token = jwt.sign(
        { id: host._id, email: host.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      if (process.env.NODE_ENV == "development") {
        cookieOptions = {
          httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
          maxAge: 60 * 60 * 1000, // cookie age in seconds
          sameSite: "Lax", // works for local development
        };
      }

      if (process.env.NODE_ENV == "production") {
        cookieOptions = {
          httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
          maxAge: 60 * 60 * 1000, // cookie age in seconds
          sameSite: "None", // works for local development
          secure: true,
        };
      }

      res.cookie("jwt", token, cookieOptions);
      res.status(200).json(host);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getHostVehicles(req, res) {
    // console.log("reached controller");
    const hostId = req?.hostDetails?._id;
    // console.log(req?);
    try {
      const vehicles = await this.hostUseCase.getHostVehicles(hostId);
      res.status(200).json(vehicles);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getHostCarDetails(req, res) {
    // console.log("reached controller");
    const vehicleNumber = req.params.vehicleNumber;
    // console.log(req?);
    try {
      const vehicle = await this.hostUseCase.getHostCarDetails(vehicleNumber);
      res.status(200).json(vehicle);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async hostLogout(req, res) {
    try {
      if (process.env.NODE_ENV == "development") {
        res.cookie("jwt", "", {
          httpOnly: true,
          expires: new Date(0), // Set the expiration date to the past to clear the cookie
          sameSite: "Lax",
        });
      }

      if (process.env.NODE_ENV == "production") {
        res.cookie("jwt", "", {
          httpOnly: true,
          expires: new Date(0), // Set the expiration date to the past to clear the cookie
          sameSite: "None",
          secure: true,
        });
      }
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}

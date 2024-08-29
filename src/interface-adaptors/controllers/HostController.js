import { generatePassword } from "../../utils/helper.js";
import {
  sendHostApprovalMail,
  sendHostRejectionMail,
} from "../../frameworks-and-drivers/external-lib/emailService.js";
import { getReceiverSocketId, io } from "../../socket.js";
import { uploadImages } from "../../frameworks-and-drivers/external-lib/imageUpload.js";
import { passwordHashing } from "../../frameworks-and-drivers/external-lib/passwordHashing.js";

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
        vehicleImages,
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
        vehicleRegistrationNumber,
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
        hashedHostPassword,
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
        rent,
      );
      await sendHostApprovalMail(email, hostPassword);
      const deleteRequest = await this.hostUseCase.deleteHostRequest(
        vehicleRegistrationNumber,
      );
      res.status(200).json({ message: "created host and added vehicle" });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async rejectHostRequest(req, res) {
    const { email, vehicleRegistrationNumber, rejectMsg } = req.body;
    try {
      const deleteRequest = await this.hostUseCase.deleteHostRequest(
        vehicleRegistrationNumber,
      );
      await sendHostRejectionMail(email, rejectMsg);
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
    // console.log(email, password);
    try {
      const { host, accessToken, refreshToken } =
        await this.hostUseCase.execute(email, password);

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

      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      // console.log(accessToken, "\n::::", refreshToken ,"\n::::", host);
      res.status(200).json({ host, accessToken, refreshToken });
    } catch (error) {
      console.log(error);
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
    const incomingRefreshToken = req.cookies?.refreshToken;
    try {
      const loggedOut =
        await this.hostUseCase.logoutWithRefreshToken(incomingRefreshToken);

      if (!loggedOut) {
        return res
          .status(400)
          .json({ error: "Something went wrong while logging out" });
      }

      if (process.env.NODE_ENV == "development") {
        console.log("reached developmet");
        res.cookie("accessToken", "", {
          httpOnly: true,
          expires: new Date(0), // Set the expiration date to the past to clear the cookie
          sameSite: "Lax",
        });
        res.cookie("refreshToken", "", {
          httpOnly: true,
          expires: new Date(0), // Set the expiration date to the past to clear the cookie
          sameSite: "Lax",
        });
      }

      if (process.env.NODE_ENV == "production") {
        res.cookie("accessToken", "", {
          httpOnly: true,
          expires: new Date(0), // Set the expiration date to the past to clear the cookie
          sameSite: "None",
          secure: true,
        });
        res.cookie("refreshToken", "", {
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

  async authenticateHost(req, res) {
    try {
      const hostId = req.hostDetails._id;
      const host = await this.hostUseCase.auth(hostId);
      // console.log(host);
      res.status(200).json({ host });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async hostRefreshToken(req, res) {
    const incomingRefreshToken = req.cookies?.refreshToken;
    // console.log("refreshToken from frontend :", incomingRefreshToken);
    let cookieOptions;
    try {
      const { accessToken, refreshToken } =
        await this.hostUseCase.refreshToken(incomingRefreshToken);
      if (process.env.NODE_ENV == "development") {
        cookieOptions = {
          httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
          sameSite: "Lax", // works for local development
        };
      }

      if (process.env.NODE_ENV == "production") {
        cookieOptions = {
          httpOnly: true, // safety, does not allow cookie to be read in the frontend javascript
          sameSite: "None", // works for local development
          secure: true,
        };
      }
      console.log("host acccess token refreshed");
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getTodayBookings(req, res) {
    const hostId = req.hostDetails._id;
    const hostName = req.hostDetails.fullname;
    const { limit, skip } = req.query;
    try {
      const bookings = await this.hostUseCase.getTodayBookings(
        hostId,
        limit,
        skip,
      );
      // console.log(bookings);
      console.log("fetched all bookings of host:", hostName);
      res.status(200).json(bookings);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllBookings(req, res) {
    const hostId = req.hostDetails._id;
    const hostName = req.hostDetails.fullname;
    const { limit, skip } = req.query;
    try {
      const bookings = await this.hostUseCase.getAllBookings(
        hostId,
        limit,
        skip,
      );
      // console.log(bookings);
      console.log("fetched all bookings of host:", hostName);
      res.status(200).json(bookings);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getBookingDetails(req, res) {
    const { paymentId } = req.params;
    try {
      const bookingDetails =
        await this.hostUseCase.getBookingDetails(paymentId);
      console.log("host fetch booking details of", paymentId);
      // console.log(bookingDetails);
      res.status(200).json(bookingDetails);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async cancelBooking(req, res) {
    const { paymentId, cancelReason } = req.body;
    try {
      const cancelling = await this.hostUseCase.cancelBooking(
        paymentId,
        cancelReason,
      );
      console.log("Booking Cancelled of Payment Id", paymentId, "By Host");
      const receiverId = await getReceiverSocketId(cancelling?.paidBy);

      if (receiverId) {
        io.to(receiverId).emit("notify", cancelReason);
        console.log("booking cancel notification send to user", receiverId);
      }

      res.status(200).json(cancelling);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getWalletInfo(req, res) {
    const hostId = req.hostDetails._id;

    try {
      const wallet = await this.hostUseCase.getWalletInfo(hostId);
      res.status(200).json(wallet);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getWalletHistory(req, res) {
    const hostId = req.hostDetails._id;
    const { limit, skip } = req.query;

    try {
      const history = await this.hostUseCase.getWalletHistory(
        hostId,
        limit,
        skip,
      );
      console.log("fetched host wallet history by", hostId);
      res.status(200).json(history);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async sendMessageToAdmin(req, res) {
    const admin = "admin@gmail.com";
    const hostEmail = req.hostDetails.email;
    const { message } = req.body;

    try {
      const sending = await this.hostUseCase.sendMessageToAdmin(
        hostEmail,
        message,
        admin,
      );
      const receiverId = await getReceiverSocketId(admin);

      if (receiverId) {
        io.to(receiverId).emit("newMessage", sending);
      }

      console.log(hostEmail, "send message to", receiverId);
      res.status(200).json(sending);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getAdminMessages(req, res) {
    const hostEmail = req.hostDetails.email;
    try {
      const messages = await this.hostUseCase.getAdminMessages(hostEmail);
      console.log(hostEmail, "fetched admin messages");
      res.status(200).json(messages);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async updateVehilce(req, res) {
    try {
      const {
        vehicleId,
        color,
        mileage,
        rent,
        city,
        pincode,
        pickUpLocation,
        latitude,
        longitude,
        lastServiceDate,
        locationText,
      } = req.body;

      const update = await this.hostUseCase.updateVehicle(
        vehicleId,
        color,
        mileage,
        rent,
        city,
        pincode,
        pickUpLocation,
        latitude,
        longitude,
        lastServiceDate,
        locationText,
      );
      console.log(update?.model, "vehilce updated");
      res.status(200).json(update);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async listVehicle(req, res) {
    const { vehicleId } = req.params;
    try {
      const list = await this.hostUseCase.listVehicle(vehicleId);
      console.log("vehicle listed", vehicleId);
      res.status(200).json(list);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async unListVehicle(req, res) {
    const { vehicleId } = req.params;
    try {
      const list = await this.hostUseCase.unListVehicle(vehicleId);
      console.log("vehicle unlisted", vehicleId);
      res.status(200).json(list);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getCounts(req, res) {
    const hostId = req.hostDetails._id;
    try {
      const counts = await this.hostUseCase.getCounts(hostId);
      console.log("fetched host dashboard counts");
      res.status(200).json(counts);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getChartData(req, res) {
    const hostId = req.hostDetails._id;
    const { filter } = req.params;
    try {
      const data = await this.hostUseCase.getChartData(filter, hostId);
      // console.log("host chart data");
      res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getProfile(req, res) {
    const hostId = req.hostDetails._id;
    try {
      const data = await this.hostUseCase.getProfile(hostId);
      res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async updateHost(req, res) {
    const hostId = req.hostDetails._id;
    const { fullname, email, phone } = req.body;

    try {
      const data = await this.hostUseCase.updateHost(
        hostId,
        fullname.trim(),
        email.trim(),
        phone,
      );
      res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async updateHostProfileImage(req, res) {
    const hostId = req.hostDetails._id;
    const profileImage = req?.file?.path;

    if (!profileImage)
      return res
        .status(400)
        .json({ error: "problem with getting profile Image url" });

    try {
      const data = await this.hostUseCase.updateHostProfileImage(
        hostId,
        profileImage,
      );
      res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getBrands(req, res) {
    try {
      const brands = await this.hostUseCase.getBrands();
      res.status(200).json(brands);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getBodyTypes(req, res) {
    try {
      const bodyTypes = await this.hostUseCase.getBodyTypes();
      res.status(200).json(bodyTypes);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async addVehicle(req, res) {
    const {
      model,
      brand,
      color,
      bodyType,
      fuel,
      transmission,
      seats,
      vehicleRegistrationNumber,
      mileage,
      city,
      pincode,
      pickUpLocation,
      host,
      rent,
      latitude,
      longitude,
    } = req.body;
    // console.log(req.body);

    const registrationCertificateFrontImage =
      req.files.registrationCertificateFrontImage[0].path;
    const registrationCertificateBackImage =
      req.files.registrationCertificateBackImage[0].path;
    const insuranceCertificateImage =
      req.files.insuranceCertificateImage[0].path;
    const pollutionCertificateImage =
      req.files.pollutionCertificateImage[0].path;
    const vehicleImages = await this.vehicleUseCase.uploadFiles(
      req.files.vehicleImages,
    );

    try {
      const vehicleExists = await this.vehicleUseCase.findByRC(
        vehicleRegistrationNumber,
      );

      if (vehicleExists) {
        res.status(400).json({ error: "Vehicle already exists" });
        return;
      }

      const vehicle = await this.vehicleUseCase.execute(
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
        pickUpLocation,
        host,
        vehicleImages,
        insuranceCertificateImage,
        pollutionCertificateImage,
        rent,
        parseFloat(latitude),
        parseFloat(longitude),
      );

      res.status(201).json(vehicle);
      console.log("vehicle Added");
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}

import HostModel from "../../frameworks-and-drivers/database/mongoose/models/HostModel.js";
import { BodyModel } from "../../frameworks-and-drivers/database/mongoose/models/BodyModel.js";
import { BrandModel } from "../../frameworks-and-drivers/database/mongoose/models/BrandModel.js";
import MessageModel from "../../frameworks-and-drivers/database/mongoose/models/MessageModel.js";
import HostWalletModel from "../../frameworks-and-drivers/database/mongoose/models/HostWallet.js";
import { VehicleModel } from "../../frameworks-and-drivers/database/mongoose/models/VehicleModel.js";
import HostRequestModel from "../../frameworks-and-drivers/database/mongoose/models/HostRequestModel.js";
import UserNotification from "../../frameworks-and-drivers/database/mongoose/models/UserNotificationModel.js";
import HostTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/HostPaymentHistory.js";
import VehicleBookingModel from "../../frameworks-and-drivers/database/mongoose/models/VehicleBookingModel.js";

export class HostRepository {
  async saveHost(host) {
    const hostModel = new HostModel({
      fullname: host.fullname,
      email: host.email,
      phone: host.phone,
      licenseNumber: host.licenseNumber,
      licenseFrontImage: host.licenseFrontImage,
      licenseBackImage: host.licenseBackImage,
      password: host.password,
      blocked: host.blocked,
    });
    await hostModel.save();
    return hostModel;
  }

  async saveHostRequest(host) {
    const hostRequestModel = new HostRequestModel({
      fullname: host.fullname,
      email: host.email,
      phone: host.phone,
      city: host.city,
      pincode: host.pincode,
      brand: host.brand,
      bodyType: host.bodyType,
      transmission: host.transmission,
      fuel: host.fuel,
      mileage: host.mileage,
      seats: host.seats,
      color: host.color,
      rent: host.rent,
      licenseNumber: host.licenseNumber,
      vehicleRegistrationNumber: host.registrationNumber,
      model: host.model,
      licenseFrontImage: host.licenseFrontImage,
      licenseBackImage: host.licenseBackImage,
      registrationCertificateFrontImage: host.registrationCertificateFrontImage,
      registrationCertificateBackImage: host.registrationCertificateBackImage,
      insuranceCertificateImage: host.insuranceCertificateImage,
      pollutionCertificateImage: host.pollutionCertificateImage,
      vehicleImages: host.vehicleImages,
    });

    await hostRequestModel.save();
    return hostRequestModel;
  }

  async getAllHosts() {
    return await HostModel.find({});
  }

  async findBrand(brand) {
    return await BrandModel.findOne({ brandName: brand });
  }

  async findBodyType(bodyType) {
    return await BodyModel.findOne({ bodyType: bodyType });
  }

  async getAllHostRequests() {
    return await HostRequestModel.find({});
  }

  async getHostRequestDetails(vehicleRegistrationNumber) {
    return await HostRequestModel.findOne({ vehicleRegistrationNumber });
  }

  async deleteHostRequest(vehicleRegistrationNumber) {
    return await HostRequestModel.deleteOne({ vehicleRegistrationNumber });
  }

  async findById(hostId) {
    return await HostModel.findById(hostId);
  }

  async findByEmail(email) {
    return await HostModel.findOne({ email });
  }

  async getHostVehicles(hostId) {
    // console.log("reached repository");
    return await VehicleModel.find({ host: hostId }).populate([
      "host",
      "brand",
      "bodyType",
    ]);
  }

  async getCarDetails(vehicleNumber) {
    // console.log("reached repository");
    return await VehicleModel.find({
      vehicleRegistrationNumber: vehicleNumber,
    }).populate("host");
  }

  async addToHostWalletAndHistory(
    hostId,
    paymentId,
    userId,
    vehicleId,
    tripStarts,
    tripEnds,
    totalAmount,
    commissionToAdmin,
    balanceAfterCommission,
    paymentMethod,
  ) {
    try {
      const addToWallet = await HostWalletModel.create({
        balance: balanceAfterCommission,
        hostId: hostId,
      });
      const addToTransactions = await HostTransactionModel.create({
        balanceAfterCommission: balanceAfterCommission,
        commissionToAdmin: commissionToAdmin,
        hostId: hostId,
        paidBy: userId,
        totalAmount: totalAmount,
        paymentId: paymentId,
        vehicleId: vehicleId,
        paymentMethod: paymentMethod,
      });
      const addToBookings = await VehicleBookingModel.create({
        balanceAfterCommission: balanceAfterCommission,
        commissionToAdmin: commissionToAdmin,
        hostId: hostId,
        paidBy: userId,
        totalAmount: totalAmount,
        paymentId: paymentId,
        vehicleId: vehicleId,
        paymentMethod: paymentMethod,
        bookingStarts: tripStarts,
        bookingEnds: tripEnds
      });

      return addToWallet;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAllUserBookings(userId) {
    try {
      return await VehicleBookingModel.find({ paidBy: userId }).sort({ createdAt: -1 }).populate(["hostId", "vehicleId"]);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getBookingDetails(paymentId) {
    try {
      // return await VehicleBookingModel.findOne({ paymentId }).populate(["hostId", "vehicleId"]);
      return await VehicleBookingModel.aggregate([
        { $match: { paymentId } },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehicleDetails"
          }
        },
        {
          $unwind: "$vehicleDetails" // Flatten the array to access nested fields
        },
        {
          $lookup: {
            from: "hosts",
            localField: "hostId",
            foreignField: "_id",
            as: "hostDetails"
          }
        },
        {
          $lookup: {
            from: "brands",
            localField: "vehicleDetails.brand",
            foreignField: "_id",
            as: "brandDetails"
          }
        }
      ]);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAllBookings(hostId) {
    try {
      return await VehicleBookingModel.aggregate([
        { $match: { hostId } },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "paidBy",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehicleDetails"
          }
        }
      ]);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async cancelBookingByHost(paymentId, cancelReason) {
    try {
      const findBooking = await VehicleBookingModel.findOne({ paymentId });
      if (!findBooking) throw new Error("No Booking Found on this Payment Id", paymentId);

      if (findBooking.bookingStatus === false) throw new Error("Booking already cancelled", paymentId);

      findBooking.bookingCancelReason = cancelReason;
      findBooking.bookingStatus = false;
      const booking = await findBooking.save();

      await UserNotification.create({
        context: cancelReason,
        userId: findBooking.paidBy
      });

      return booking;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getWalletInfo(hostId) {
    try {
      return await HostWalletModel.findOne({ hostId });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getWalletHistory(hostId, limit, skip) {
    const limitItems = parseInt(limit);
    const skipItems = parseInt(skip);
    try {
      return await HostTransactionModel
        .find({ hostId })
        .skip(skipItems)
        .limit(limitItems)
        .sort({ createdAt: -1 });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async sendMessageToAdmin(from, msg, to) {
    try {
      return await MessageModel.create({
        msgFrom: from,
        message: msg,
        msgTo: to
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAdminMessages(hostEmail) {
    try {
      return await MessageModel.aggregate([
        {
          $match: {
            $or: [
              { msgFrom: hostEmail },
              { msgTo: hostEmail }
            ]
          }
        }
      ])
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async updateVehicle(
    vehicleId,
    mileage,
    seats,
    color,
    rent,
    city,
    pincode,
    pickUpLocation,
    latitude,
    longitude,
    lastServiceDate,
    locationText) {
    try {
      return await VehicleModel.findByIdAndUpdate({ _id: vehicleId }, {
        mileage,
        seats,
        color,
        rent,
        city,
        pincode,
        pickUpLocation,
        latitude,
        longitude,
        lastServiceDate,
        locationText
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async listVehicle(vehicleId) {
    try {
      const findVehicle = await VehicleModel.findById(vehicleId);
      if(!findVehicle) throw new Error("vehicle not found");

      findVehicle.availabilityStatus = true;
      await findVehicle.save();

      return findVehicle;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async unListVehicle(vehicleId) {
    try {
      const findVehicle = await VehicleModel.findById(vehicleId);
      if(!findVehicle) throw new Error("vehicle not found");

      findVehicle.availabilityStatus = false;
      await findVehicle.save();
      
      return findVehicle;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

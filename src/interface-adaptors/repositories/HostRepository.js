import moment from "moment";
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
import { generatePaymentIdString } from "../../utils/helper.js";
import UserWalletModel from "../../frameworks-and-drivers/database/mongoose/models/UserWallet.js";
import UserTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/UserPaymentHistory.js";
import AdminWalletModel from "../../frameworks-and-drivers/database/mongoose/models/AdminWallet.js";
import AdminTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/AdminPaymentHistory.js";

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
      const addToWallet = await HostWalletModel.findOneAndUpdate(
        { hostId },
        {
          $inc: { balance: balanceAfterCommission },
        },
      );

      const addToTransactions = await HostTransactionModel.create({
        balanceAfterCommission: balanceAfterCommission,
        commissionToAdmin: commissionToAdmin,
        hostId: hostId,
        paidBy: userId,
        totalAmount: totalAmount,
        paymentId: paymentId,
        vehicleId: vehicleId,
        paymentMethod: paymentMethod,
        credited: true,
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
        bookingEnds: tripEnds,
      });

      return addToWallet;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAllUserBookings(userId) {
    try {
      return await VehicleBookingModel.find({ paidBy: userId })
        .sort({ createdAt: -1 })
        .populate(["hostId", "vehicleId"]);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getBookingDetails(paymentId, limit, skip) {
    try {
      // return await VehicleBookingModel.findOne({ paymentId }).populate(["hostId", "vehicleId"]);
      return await VehicleBookingModel.aggregate([
        { $match: { paymentId } },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehicleDetails",
          },
        },
        {
          $unwind: "$vehicleDetails", // Flatten the array to access nested fields
        },
        {
          $lookup: {
            from: "hosts",
            localField: "hostId",
            foreignField: "_id",
            as: "hostDetails",
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "vehicleDetails.brand",
            foreignField: "_id",
            as: "brandDetails",
          },
        },
      ]);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getTodayBookings(hostId, limit, skip) {
    const limitItems = parseInt(limit);
    const skipItems = parseInt(skip);
    const date = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to the start of the day

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day
    try {
      return await VehicleBookingModel.aggregate([
        {
          $match: {
            hostId,
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "paidBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehicleDetails",
          },
        },
        {
          $skip: skipItems,
        },
        { $limit: limitItems },
      ]);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAllBookings(hostId, limit, skip) {
    const limitItems = parseInt(limit);
    const skipItems = parseInt(skip);
    try {
      return await VehicleBookingModel.aggregate([
        { $match: { hostId } },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "paidBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehicleDetails",
          },
        },
        {
          $skip: skipItems,
        },
        { $limit: limitItems },
      ]);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async cancelBookingByHost(paymentId, cancelReason) {
    const adminId = "668b183d01b691981bcaa102";
    try {
      const findBooking = await VehicleBookingModel.findOne({ paymentId });
      if (!findBooking)
        throw new Error("No Booking Found on this Payment Id", paymentId);

      if (findBooking.bookingStatus === false)
        throw new Error("Booking already cancelled", paymentId);

      findBooking.bookingCancelReason = cancelReason;
      findBooking.bookingStatus = false;
      const booking = await findBooking.save();

      await UserWalletModel.findOneAndUpdate(
        { userId: findBooking.paidBy },
        {
          $inc: { balance: findBooking.totalAmount },
        },
      );

      let payId = await generatePaymentIdString("pay_", 8);

      await UserTransactionModel.create({
        paymentId: payId,
        amount: findBooking.totalAmount,
        paymentMessage: "Refund from cancelled booking",
        paymentMethod: "wallet",
        userId: findBooking.paidBy,
        credited: true,
      });

      await AdminWalletModel.findOneAndUpdate(
        { adminId },
        {
          $inc: { balance: -findBooking.commissionToAdmin },
        },
      );

      payId = await generatePaymentIdString("pay_", 8);

      await AdminTransactionModel.create({
        adminId: adminId,
        balanceAfterCommission: findBooking.balanceAfterCommission,
        commissionToAdmin: findBooking.commissionToAdmin,
        hostId: findBooking.hostId,
        paidBy: findBooking.paidBy,
        totalAmount: findBooking.totalAmount,
        paymentId: payId,
        vehicleId: vehicleId,
        paymentMethod: "wallet",
        credited: false,
      });

      await HostWalletModel.findOneAndUpdate(
        { hostId: findBooking.hostId },
        {
          $inc: { balance: -findBooking.balanceAfterCommission },
        },
      );

      payId = await generatePaymentIdString("pay_", 8);

      await HostTransactionModel.create({
        balanceAfterCommission: findBooking.balanceAfterCommission,
        commissionToAdmin: findBooking.commissionToAdmin,
        hostId: findBooking.hostId,
        paidBy: findBooking.paidBy,
        totalAmount: findBooking.totalAmount,
        paymentId: payId,
        vehicleId: findBooking.vehicleId,
        paymentMethod: "wallet",
        credited: false,
      });

      await UserNotification.create({
        context: cancelReason,
        userId: findBooking.paidBy,
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
      return await HostTransactionModel.find({ hostId })
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
        msgTo: to,
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
            $or: [{ msgFrom: hostEmail }, { msgTo: hostEmail }],
          },
        },
      ]);
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
    locationText,
  ) {
    try {
      return await VehicleModel.findByIdAndUpdate(
        { _id: vehicleId },
        {
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
          locationText,
        },
      );
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async listVehicle(vehicleId) {
    try {
      const findVehicle = await VehicleModel.findById(vehicleId);
      if (!findVehicle) throw new Error("vehicle not found");

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
      if (!findVehicle) throw new Error("vehicle not found");

      findVehicle.availabilityStatus = false;
      await findVehicle.save();

      return findVehicle;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getCounts(hostId) {
    const date = new Date();
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0); // Set time to the start of the day

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day

      const vehicleCount = await VehicleModel.countDocuments({ host: hostId });
      const todayBookingsCount = await VehicleBookingModel.countDocuments({
        hostId,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      return { vehicleCount, todayBookingsCount };
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  // Function to get sales data based on the filter (implement as needed)
  async getChartData(filter, hostId) {
    let aggregationPipeline = [];

    if (filter === "monthly") {
      // Aggregate monthly sales
      aggregationPipeline = [
        {
          $match: { bookingStatus: true, hostId }, // Add a match stage to filter by orderStatus
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalSales: { $sum: 1 },
          },
        },
      ];
    } else if (filter === "yearly") {
      // Aggregate yearly sales
      aggregationPipeline = [
        {
          $match: { bookingStatus: true }, // Add a match stage to filter by orderStatus
        },
        {
          $group: {
            _id: { $year: "$createdAt" },
            totalSales: { $sum: 1 },
          },
        },
      ];
    } else {
      // Handle other filters if needed
    }

    const salesData = await VehicleBookingModel.aggregate(aggregationPipeline);

    // Format data for the chart
    const formattedData = {
      labels: salesData.map((entry) =>
        filter === "monthly"
          ? moment(`${entry._id.year}-${entry._id.month}`, "YYYY-MM").format(
              "MMMM YYYY",
            )
          : entry._id.toString(),
      ),
      data: salesData.map((entry) => entry.totalSales),
    };

    return formattedData;
  }
}

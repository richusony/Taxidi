import moment from "moment";
import { AdminModel } from "../../frameworks-and-drivers/database/mongoose/models/AdminModel.js";
import AdminTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/AdminPaymentHistory.js";
import AdminWalletModel from "../../frameworks-and-drivers/database/mongoose/models/AdminWallet.js";
import { BodyModel } from "../../frameworks-and-drivers/database/mongoose/models/BodyModel.js";
import { BrandModel } from "../../frameworks-and-drivers/database/mongoose/models/BrandModel.js";
import HostModel from "../../frameworks-and-drivers/database/mongoose/models/HostModel.js";
import MessageModel from "../../frameworks-and-drivers/database/mongoose/models/MessageModel.js";
import VehicleBookingModel from "../../frameworks-and-drivers/database/mongoose/models/VehicleBookingModel.js";
import { VehicleModel } from "../../frameworks-and-drivers/database/mongoose/models/VehicleModel.js";
import UserNotificationModel from "../../frameworks-and-drivers/database/mongoose/models/UserNotificationModel.js";
import UserWalletModel from "../../frameworks-and-drivers/database/mongoose/models/UserWallet.js";
import UserTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/UserPaymentHistory.js";
import { generatePaymentIdString } from "../../utils/helper.js";
import HostWalletModel from "../../frameworks-and-drivers/database/mongoose/models/HostWallet.js";
import HostTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/HostPaymentHistory.js";

export class AdminRepository {
  async save(admin) {
    const adminModel = new AdminModel({
      email: admin.email,
      password: admin.password,
    });

    await adminModel.save();
    return adminModel;
  }

  async findById(adminId) {
    try {
      return AdminModel.findById(adminId);
    } catch (error) {
      console.log("admin repo", error.message);
      throw error;
    }
  }

  async findByEmail(email) {
    return AdminModel.findOne({ email });
  }

  async addToAdminWalletAndHistory(
    adminId,
    hostId,
    paymentId,
    userId,
    vehicleId,
    totalAmount,
    commissionToAdmin,
    balanceAfterCommission,
    paymentMethod,
  ) {
    try {
      const addToWallet = await AdminWalletModel.findOneAndUpdate(
        { adminId },
        { $inc: { balance: commissionToAdmin } },
      );

      const addToTransactions = await AdminTransactionModel.create({
        adminId: adminId,
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

      return addToWallet;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async sendMessageToHost(to, from, msg) {
    try {
      return await MessageModel.create({
        message: msg,
        msgFrom: from,
        msgTo: to,
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getHostMessages(hostEmail) {
    try {
      return await MessageModel.aggregate([
        {
          $match: {
            $or: [{ msgFrom: hostEmail }, { msgTo: hostEmail }],
          },
        },
      ]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getWalletInfo(adminId) {
    try {
      return await AdminWalletModel.findOne({ adminId });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getWalletHistory(adminId, limit, skip) {
    const limitItems = parseInt(limit);
    const skipItems = parseInt(skip);

    try {
      return await AdminTransactionModel.find({ adminId })
        .skip(skipItems)
        .limit(limitItems)
        .sort({ createdAt: -1 });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCounts() {
    const date = new Date();
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0); // Set time to the start of the day

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day

      const brandCount = await BrandModel.countDocuments();
      const bodyTypeCount = await BodyModel.countDocuments();
      const hostCount = await HostModel.countDocuments();
      const vehicleCount = await VehicleModel.countDocuments();
      const todayBookingsCount = await VehicleBookingModel.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      return {
        brandCount,
        bodyTypeCount,
        hostCount,
        vehicleCount,
        todayBookingsCount,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Function to get sales data based on the filter (implement as needed)
  async getChartData(filter) {
    try {
      let aggregationPipeline = [];

      if (filter === "monthly") {
        // Aggregate monthly sales
        aggregationPipeline = [
          {
            $match: { bookingStatus: true }, // Add a match stage to filter by orderStatus
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

      const salesData =
        await VehicleBookingModel.aggregate(aggregationPipeline);

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
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getBookings(limit, skip) {
    const limitItems = parseInt(limit);
    const skipItems = parseInt(skip);

    const date = new Date();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to the start of the day

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day
    try {
      return await VehicleBookingModel.find({
        hostId: "66a8b7d061ac1b9151567e6c",
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      })
        .populate(["paidBy", "hostId", "vehicleId"])
        .skip(skipItems)
        .limit(limitItems)
        .sort({ createdAt: -1 });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getBookingHistory(limit, skip) {
    const limitItems = parseInt(limit);
    const skipItems = parseInt(skip);
    try {
      return await VehicleBookingModel.find({})
        .populate(["paidBy", "hostId", "vehicleId"])
        .skip(skipItems)
        .limit(limitItems)
        .sort({ createdAt: -1 });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getBookingDetails(paymentId) {
    try {
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
      console.log(error);
      throw error;
    }
  }

  async cancelBooking(paymentId, cancelReason, adminId) {
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
        vehicleId: findBooking.vehicleId,
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

      await UserNotificationModel.create({
        context: cancelReason,
        userId: findBooking.paidBy,
      });

      return booking;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

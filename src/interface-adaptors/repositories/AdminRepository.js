import { AdminModel } from "../../frameworks-and-drivers/database/mongoose/models/AdminModel.js";
import AdminTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/AdminPaymentHistory.js";
import AdminWalletModel from "../../frameworks-and-drivers/database/mongoose/models/AdminWallet.js";
import { BodyModel } from "../../frameworks-and-drivers/database/mongoose/models/BodyModel.js";
import { BrandModel } from "../../frameworks-and-drivers/database/mongoose/models/BrandModel.js";
import HostModel from "../../frameworks-and-drivers/database/mongoose/models/HostModel.js";
import MessageModel from "../../frameworks-and-drivers/database/mongoose/models/MessageModel.js";
import VehicleBookingModel from "../../frameworks-and-drivers/database/mongoose/models/VehicleBookingModel.js";
import { VehicleModel } from "../../frameworks-and-drivers/database/mongoose/models/VehicleModel.js";

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
      const addToWallet = await AdminWalletModel.findOneAndUpdate({ adminId }, { $inc: { balance: commissionToAdmin } });

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
        credited: true
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
        msgTo: to
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
            $or: [
              { msgFrom: hostEmail },
              { msgTo: hostEmail }
            ]
          }
        }
      ])
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
      return await AdminTransactionModel
        .find({ adminId })
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

      return { brandCount, bodyTypeCount, hostCount, vehicleCount, todayBookingsCount };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

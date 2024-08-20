import { AdminModel } from "../../frameworks-and-drivers/database/mongoose/models/AdminModel.js";
import AdminTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/AdminPaymentHistory.js";
import AdminWalletModel from "../../frameworks-and-drivers/database/mongoose/models/AdminWallet.js";
import MessageModel from "../../frameworks-and-drivers/database/mongoose/models/MessageModel.js";

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
      const addToWallet = await AdminWalletModel.create({
        balance: balanceAfterCommission,
        adminId: adminId,
      });
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
      });

      return addToWallet;
    } catch (error) {
      console.log(error.message);
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
    }
  }
}

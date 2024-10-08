import { UserModel } from "../../frameworks-and-drivers/database/mongoose/models/UserModel.js";
import UserWalletModel from "../../frameworks-and-drivers/database/mongoose/models/UserWallet.js";
import UserTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/UserPaymentHistory.js";
import UserNotificationModel from "../../frameworks-and-drivers/database/mongoose/models/UserNotificationModel.js";
import { LicenseVerifyModel } from "../../frameworks-and-drivers/database/mongoose/models/UserLicenseVerifyModel.js";
import { BodyModel } from "../../frameworks-and-drivers/database/mongoose/models/BodyModel.js";
import VehicleBookingModel from "../../frameworks-and-drivers/database/mongoose/models/VehicleBookingModel.js";
import AdminWalletModel from "../../frameworks-and-drivers/database/mongoose/models/AdminWallet.js";
import AdminTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/AdminPaymentHistory.js";
import HostWalletModel from "../../frameworks-and-drivers/database/mongoose/models/HostWallet.js";
import { generatePaymentIdString } from "../../utils/helper.js";
import HostTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/HostPaymentHistory.js";

export class UserRepository {
  async save(user) {
    const userModel = new UserModel({
      firstName: user.firstName,
      secondName: user.secondName,
      email: user.email,
      phone: user.phone,
      city: user.city,
      pincode: user.pincode,
      licenseNumber: user.licenseNumber,
      blocked: user.blocked,
      password: user.password,
    });

    await userModel.save();

    await UserWalletModel.create({
      userId: userModel._id,
      balance: 0
    });

    return userModel;
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async findById(id) {
    return await UserModel.findById(id);
  }

  async update(user) {
    const userExist = await this.findById(user.id);
    if (!userExist) {
      console.log("user not found while updating");
      throw new Error("user not found while updating");
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userExist._id },
      {
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        pincode: user.pincode,
      },
      { new: true },
    );

    return updatedUser;
  }

  async saveLicenseToUserDocument(
    userId,
    licenseNumber,
    licenseFrontImage,
    licenseBackImage,
  ) {
    try {
      const updateUser = await UserModel.findByIdAndUpdate(
        { _id: userId },
        { licenseNumber, licenseFrontImage, licenseBackImage },
        { new: true },
      );

      const removeRequest = await LicenseVerifyModel.findOneAndDelete({
        licenseNumber,
      });

      const addToNotifications = await UserNotificationModel.create({
        context: "Your license has been approved. Enjoy booking",
        userId,
      });

      return updateUser;
    } catch (error) {
      console.error("Error uploading and saving license:", error);
      throw new Error("Error uploading and saving license");
    }
  }

  async saveRequest(request) {
    try {
      const userLicenseModel = new LicenseVerifyModel({
        licenseNumber: request.licenseNumber,
        licenseFrontImage: request.licenseFrontImage,
        licenseBackImage: request.licenseBackImage,
        userId: request.userId,
      });

      await userLicenseModel.save();
      return userLicenseModel;
    } catch (error) {
      console.error("Error uploading and saving license:", error);
      throw new Error("Error uploading and saving license");
    }
  }

  async getAllLicenseVerifyRequest() {
    return await LicenseVerifyModel.find({}).populate("userId");
  }

  async findLicenseVerificationRequestByLicenseNumber(licenseNumber) {
    return await LicenseVerifyModel.find({ licenseNumber }).populate("userId");
  }

  async addMoneyToWallet(
    userId,
    paymentId,
    amount,
    paymentMethod,
    paymentMessage,
  ) {
    try {
      const addToWallet = await UserWalletModel.findOneAndUpdate(
        { userId },
        {
          $inc: { balance: amount },
        },
        { new: true },
      );

      const addtoTransactions = await UserTransactionModel.create({
        userId,
        amount,
        paymentId,
        paymentMethod,
        paymentMessage,
        credited: true,
      });

      return addToWallet;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getWallet(userId) {
    try {
      return await UserWalletModel.findOne({ userId });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAllUserNotifications(userId) {
    try {
      return await UserNotificationModel.find({ userId }).sort({
        createdAt: -1,
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAllBodyTypes() {
    try {
      return await BodyModel.find({});
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getWalletHistory(userId) {
    try {
      return await UserTransactionModel.find({ userId })
        .sort({ createdAt: -1 });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async cancelBooking(paymentId) {
    const date = new Date();
    const adminId = "668b183d01b691981bcaa102";
    try {
      const findBooking = await VehicleBookingModel.findOne({ paymentId });
      if (!findBooking) {
        throw new Error("no booking found for ", paymentId);
      }

      // Parse the booking start date from ISO 8601 format
      const bookingStarts = new Date(findBooking.bookingStarts);
      if (isNaN(bookingStarts.getTime())) {
        throw new Error("Invalid booking start date");
      }

      // Check if the current date and time is past the booking start date
      if (bookingStarts <= date) {
        throw new Error(
          "Can't cancel booking at or after the trip starting date",
        );
      }

      const cancellBooking = await VehicleBookingModel.findOneAndUpdate(
        { paymentId },
        { bookingStatus: false },
      );
      const totalAmount = cancellBooking.totalAmount;
      const commissionToAdmin = cancellBooking.commissionToAdmin;
      const balanceAfterCommission = cancellBooking.balanceAfterCommission;

      // reduce amount from both admin and host wallet
      await AdminWalletModel.findOneAndUpdate(
        { adminId },
        { $inc: { balance: -commissionToAdmin } },
      );
      await HostWalletModel.findOneAndUpdate(
        { hostId: cancellBooking.hostId },
        { $inc: { balance: -balanceAfterCommission } },
      );

      await UserWalletModel.findOneAndUpdate(
        { userId: cancellBooking.paidBy },
        { $inc: { balance: totalAmount } },
      );
      const payId = await generatePaymentIdString("pay_", 8);

      await UserTransactionModel.create({
        paymentId: payId,
        amount: totalAmount,
        paymentMessage: "Refund from cancelled booking",
        paymentMethod: "wallet",
        userId: cancellBooking.paidBy,
        credited: true,
      });

      await AdminTransactionModel.create({
        adminId,
        balanceAfterCommission,
        commissionToAdmin,
        paidBy: cancellBooking.paidBy,
        paymentId: payId,
        totalAmount,
        vehicleId: cancellBooking.vehicleId,
        paymentMethod: "wallet",
        credited: false,
      });

      await HostTransactionModel.create({
        adminId,
        balanceAfterCommission,
        commissionToAdmin,
        paidBy: cancellBooking.paidBy,
        paymentId: payId,
        totalAmount,
        hostId: cancellBooking.hostId,
        vehicleId: cancellBooking.vehicleId,
        paymentMethod: "wallet",
        credited: false,
      });

      await UserNotificationModel.create({
        context: `Booking has been cancelled. ${totalAmount} credited to your wallet`,
        userId: cancellBooking.paidBy,
      });

      return cancellBooking;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

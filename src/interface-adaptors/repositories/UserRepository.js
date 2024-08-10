import { UserModel } from "../../frameworks-and-drivers/database/mongoose/models/UserModel.js";
import UserWalletModel from "../../frameworks-and-drivers/database/mongoose/models/UserWallet.js";
import { LicenseVerifyModel } from "../../frameworks-and-drivers/database/mongoose/models/UserLicenseVerifyModel.js";
import UserTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/UserPaymentHistory.js";

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
    console.log("userRep",userId, paymentId, amount, paymentMethod, paymentMessage);
    try {
      const addToWallet = await UserWalletModel.updateOne(
        { userId },
        {
          $inc: { balance: amount },
        },
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
    }
  }

  async getWallet(userId){
    try {
      return await UserWalletModel.findOne({userId});
    } catch (error) {
      console.log(error.message);
    }
  }
}

import HostModel from "../../frameworks-and-drivers/database/mongoose/models/HostModel.js";
import { BodyModel } from "../../frameworks-and-drivers/database/mongoose/models/BodyModel.js";
import { BrandModel } from "../../frameworks-and-drivers/database/mongoose/models/BrandModel.js";
import { VehicleModel } from "../../frameworks-and-drivers/database/mongoose/models/VehicleModel.js";
import HostRequestModel from "../../frameworks-and-drivers/database/mongoose/models/HostRequestModel.js";
import HostWalletModel from "../../frameworks-and-drivers/database/mongoose/models/HostWallet.js";
import HostTransactionModel from "../../frameworks-and-drivers/database/mongoose/models/hostPaymentHistory.js";
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
      });

      return addToWallet;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getAllBookings(userId) {
    try {
      return await VehicleBookingModel.find({paidBy: userId}).populate(["hostId","vehicleId"]);
    } catch (error) {
      console.log(error.message);
    }
  }
}

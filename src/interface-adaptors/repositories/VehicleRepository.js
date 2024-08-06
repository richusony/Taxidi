import { VehicleModel } from "../../frameworks-and-drivers/database/mongoose/models/VehicleModel.js";

export class VehicleRepository {
  async save(vehicle) {
    // console.log("repository", vehicle);
    const vehicleModel = new VehicleModel({
      model: vehicle.model,
      brand: vehicle.brand,
      color: vehicle.color,
      bodyType: vehicle.bodyType,
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      seats: vehicle.seats,
      rent: vehicle.rent,
      vehicleRegistrationNumber: vehicle.vehicleRegistrationNumber,
      registrationCertificateFrontImage:
        vehicle.registrationCertificateFrontImage,
      registrationCertificateBackImage:
        vehicle.registrationCertificateBackImage,
      mileage: vehicle.mileage,
      pickUpLocation: vehicle.pickUpLocation,
      host: vehicle.host,
      vehicleImages: vehicle.vehicleImages,
      insuranceCertificateImage: vehicle.insuranceCertificateImage,
      pollutionCertificateImage: vehicle.pollutionCertificateImage,
      bookingStarts: null,
      bookingEnds: null,
    });
    console.log(vehicle);
    await vehicleModel.save();
    console.log("vehicle added to database");
    return vehicleModel;
  }

  async findByModel(model) {
    return await VehicleModel.findOne({ model: model });
  }

  async findById(id) {
    try {
      return await VehicleModel.findById(id);
    } catch (error) {
      console.log("vehicle repo", error.message);
    }
  }

  async findVehicleByRC(rc) {
    return VehicleModel.findOne({ vehicleRegistrationNumber: rc }).populate([
      "host",
      "brand",
      "bodyType",
    ]);
  }

  async getVehicles() {
    return await VehicleModel.find({}).populate(["host", "brand", "bodyType"]);
  }

  async getAllAvailableCars(bookingStarts, bookingEnds) {
    return await VehicleModel.find({
      $or: [
        { bookingEnds: { $lt: bookingStarts } }, // Bookings ending before the start date
        { bookingStarts: { $gt: bookingEnds } }, // Bookings starting after the end date
        { bookingStarts: { $eq: null } }, // Vehicles not booked (start date is null)
        { bookingEnds: { $eq: null } }, // Vehicles not booked (end date is null)
      ],
    }).populate(["host", "brand", "bodyType"]);
  }

  async getCarDetails(vehicleRegistrationNumber) {
    return await VehicleModel.findOne({ vehicleRegistrationNumber }).populate([
      "host",
      "brand",
      "bodyType",
    ]);
  }

  async deleteVehicle(vehicleRegistrationNumber) {
    return await VehicleModel.deleteOne({ vehicleRegistrationNumber });
  }

  async bookVehicle(vehicleId, startDate, endDate) {
    try {
      const updateVehilce = await VehicleModel.findByIdAndUpdate(
        { _id: vehicleId },
        {
          booked: true,
          bookingStarts: startDate,
          bookingEnds: endDate,
        },
      );
      
      return updateVehilce;
    } catch (error) {
      console.log(error.message);
    }
  }
}

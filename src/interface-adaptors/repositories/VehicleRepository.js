import VehicleBookingModel from "../../frameworks-and-drivers/database/mongoose/models/VehicleBookingModel.js";
import { VehicleModel } from "../../frameworks-and-drivers/database/mongoose/models/VehicleModel.js";
import VehicleRatingModel from "../../frameworks-and-drivers/database/mongoose/models/vehicleRatingModel.js";
import VehicleReviewModel from "../../frameworks-and-drivers/database/mongoose/models/vehicleReviewModel.js";

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

  async getAllAvailableCars(bookingStartsString, bookingEndsString) {
    const bookingStarts = new Date(`${bookingStartsString}:00Z`); // Appending seconds and time zone
    const bookingEnds = new Date(`${bookingEndsString}:00Z`);
    try {
      // Step 1: Aggregate overlapping bookings to get booked vehicle IDs
      const bookedVehicleIds = await VehicleBookingModel.aggregate([
        {
          $match: {
            bookingStarts: { $lte: bookingEnds },
            bookingEnds: { $gte: bookingStarts }
          }
        },
        {
          $group: {
            _id: null,
            vehicleIds: { $addToSet: "$vehicleId" }
          }
        },
        {
          $project: {
            _id: 0,
            vehicleIds: 1
          }
        }
      ]);
  
      // Extract vehicle IDs from the aggregation result
      const vehicleIds = bookedVehicleIds.length > 0 ? bookedVehicleIds[0].vehicleIds : [];
      console.log(bookedVehicleIds);
      // Step 2: Find vehicles not in the list of booked vehicle IDs
      const availableCars = await VehicleModel.find({
        _id: { $nin: vehicleIds }
      }).populate(["brand"]);
      // console.log(availableCars);
      return availableCars;
    } catch (error) {
      console.error('Error fetching available cars:', error);
      throw error;
    }
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

  async postReviewAndRating(userId, vehicleId, reviewMsg, rating) {
    try {
      await VehicleReviewModel.create({
        reviewMessage: reviewMsg,
        userId,
        vehicleId,
      });

      return await VehicleRatingModel.create({
        vehicleId,
        cleanliness: Number(rating.cleanliness),
        maintenance: Number(rating.maintenance),
        convenience: Number(rating.convenience),
        timing: Number(rating.timing)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async getReviewsAndRating(vehicleRegistrationNumber) {
    try {
      const vehicle = await VehicleModel.findOne({ vehicleRegistrationNumber });
      if (!vehicle) throw new Error("vehicle not found - VehicleRepository");

      const reviews = await VehicleReviewModel.find({ vehicleId: vehicle._id }).populate(["userId", "vehicleId"]);
      const rating = await VehicleRatingModel.aggregate([
        { $match: { vehicleId: vehicle._id } },
        {
          $group: {
            _id: "$vehicleId",
            Cleanliness: { $avg: "$cleanliness" },
            Maintenance: { $avg: "$maintenance" },
            Convenience: { $avg: "$convenience" },
            Timing: { $avg: "$timing" },
            TotalNumberOfRatings: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            Cleanliness: 1,
            Maintenance: 1,
            Convenience: 1,
            Timing: 1,
            TotalAverage: {
              $avg: [
                "$Cleanliness",
                "$Maintenance",
                "$Convenience",
                "$Timing"
              ]
            },
            TotalNumberOfRatings: 1
          }
        }
      ]);

      return { reviews, rating };
    } catch (error) {
      console.log(error.message);
    }
  }
}

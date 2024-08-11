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

  async getAllAvailableCars(bookingStarts, bookingEnds) {
    return await VehicleModel.aggregate([
      {
        $lookup: {
          from: "vehicle_bookings",
          localField: "_id",
          foreignField: "vehicleId",
          as: "bookings"
        }
      },
      {
        $addFields: {
          isBookedDuringPeriod: {
            $anyElementTrue: {
              $map: {
                input: "$bookings",
                as: "booking",
                in: {
                  $and: [
                    { $lte: ["$booking.bookingEnds", bookingEnds] },
                    { $gte: ["$booking.bookingStarts", bookingStarts] }
                  ]
                }
              }
            }
          },
          hasBookings: { $gt: [{ $size: "$bookings" }, 0] }
        }
      },
      {
        $match: {
          $or: [
            { isBookedDuringPeriod: false }, // Vehicles not booked during the specified period
            { hasBookings: false } // Vehicles with no bookings at all
          ]
        }
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brandDetails"
        }
      },
      {
        $unwind: {
          path: "$brandDetails",
          preserveNullAndEmptyArrays: true // Optional: Keep vehicles even if brand details are missing
        }
      },
      {
        $project: {
          _id: 1,
          model: 1,
          color: 1,
          bodyType: 1,
          fuel: 1,
          transmission: 1,
          seats: 1,
          vehicleRegistrationNumber: 1,
          registrationCertificateFrontImage: 1,
          registrationCertificateBackImage: 1,
          mileage: 1,
          city: 1,
          pincode: 1,
          pickUpLocation: 1,
          host: 1,
          vehicleImages: 1,
          insuranceCertificateImage: 1,
          pollutionCertificateImage: 1,
          rent: 1,
          brandDetails: 1 // Include brand details in the output
        }
      }
    ]);
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

  async getReviews(vehicleRegistrationNumber) {
    try {
      const vehicle = await VehicleModel.findOne({ vehicleRegistrationNumber });
      if (!vehicle) throw new Error("vehicle not found - VehicleRepository");

      return await VehicleReviewModel.find({ vehicleId: vehicle._id }).populate(["userId", "vehicleId"])
    } catch (error) {
      console.log(error.message);
    }
  }
}

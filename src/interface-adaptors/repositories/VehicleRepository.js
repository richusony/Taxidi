import mongoose from "mongoose";
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

  async getAllAvailableCars(
    brand,
    bodyType,
    fuel,
    priceRange,
    bookingStartsString,
    bookingEndsString,
    latitude,
    longitude,
    limit,
    skip,
  ) {
    const bookingStarts = new Date(`${bookingStartsString}:00Z`); // Appending seconds and time zone
    const bookingEnds = new Date(`${bookingEndsString}:00Z`);

    try {
      // Step 1: Aggregate overlapping bookings to get booked vehicle IDs
      const bookedVehicleIds = await VehicleBookingModel.aggregate([
        {
          $match: {
            bookingStarts: { $lte: bookingEnds },
            bookingEnds: { $gte: bookingStarts },
            bookingStatus: true,
          },
        },
        {
          $group: {
            _id: null,
            vehicleIds: { $addToSet: "$vehicleId" },
          },
        },
        {
          $project: {
            _id: 0,
            vehicleIds: 1,
          },
        },
      ]);
      // console.log("bookedVehicless ", bookedVehicleIds)
      // Extract vehicle IDs from the aggregation result
      const vehicleIds =
        bookedVehicleIds.length > 0 ? bookedVehicleIds[0].vehicleIds : [];

      // Step 2: Create filter object based on provided parameters
      const filter = {
        _id: { $nin: vehicleIds },
        availabilityStatus: true, // Assuming this field indicates availability
      };
      // console.log("filter", filter)
      if (brand && brand !== "None")
        filter.brand = new mongoose.Types.ObjectId(brand);
      if (bodyType && bodyType !== "None")
        filter.bodyType = new mongoose.Types.ObjectId(bodyType);
      if (fuel && fuel !== "None") filter.fuel = fuel;

      // Handle price range
      if (priceRange && priceRange !== "None") {
        // Convert priceRange string to array
        const [minPrice, maxPrice] = JSON.parse(priceRange);

        // Filter by price range
        filter.rent = {
          $gte: minPrice,
          $lte: maxPrice,
        };
      }

      // Ensure latitude and longitude are numbers
      const parsedLatitude =
        latitude !== undefined ? parseFloat(latitude) : 11.8653;
      const parsedLongitude =
        longitude !== undefined ? parseFloat(longitude) : 75.352;
      // if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
      //   throw new Error('Invalid latitude or longitude');
      // }

      // Step 3: Apply geospatial query and filters
      const availableCars = await VehicleModel.find(filter)
        .where("location")
        .near({
          center: {
            type: "Point",
            coordinates: [parsedLongitude, parsedLatitude],
          },
          maxDistance: 20000, // Set a maximum distance in meters
          spherical: true,
        })
        .populate(["brand", "bodyType"]) // Populate fields as needed
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .exec();
      // console.log("response :", availableCars);
      return availableCars;
    } catch (error) {
      console.error("Error fetching available cars:", error);
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

  async bookVehicle(
    paymentId,
    hostId,
    totalAmount,
    paymentMethod,
    userId,
    vehicleId,
    commissionToAdmin,
    balanceAfterCommission,
    queryStartDate,
    queryEndDate,
  ) {
    try {
      const bookVehicle = await VehicleBookingModel.create({
        paymentId,
        hostId,
        totalAmount,
        paymentMethod,
        paidBy: userId,
        vehicleId,
        commissionToAdmin,
        balanceAfterCommission,
        bookingStarts: queryStartDate,
        bookingEnds: queryEndDate,
      });

      return bookVehicle;
    } catch (error) {
      console.log(error.message);
      throw error;
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
        timing: Number(rating.timing),
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getReviewsAndRating(vehicleRegistrationNumber) {
    try {
      const vehicle = await VehicleModel.findOne({ vehicleRegistrationNumber });
      if (!vehicle) throw new Error("vehicle not found - VehicleRepository");

      const reviews = await VehicleReviewModel.find({
        vehicleId: vehicle._id,
      }).populate(["userId", "vehicleId"]);
      const rating = await VehicleRatingModel.aggregate([
        { $match: { vehicleId: vehicle._id } },
        {
          $group: {
            _id: "$vehicleId",
            Cleanliness: { $avg: "$cleanliness" },
            Maintenance: { $avg: "$maintenance" },
            Convenience: { $avg: "$convenience" },
            Timing: { $avg: "$timing" },
            TotalNumberOfRatings: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            Cleanliness: 1,
            Maintenance: 1,
            Convenience: 1,
            Timing: 1,
            TotalAverage: {
              $avg: ["$Cleanliness", "$Maintenance", "$Convenience", "$Timing"],
            },
            TotalNumberOfRatings: 1,
          },
        },
      ]);

      return { reviews, rating };
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

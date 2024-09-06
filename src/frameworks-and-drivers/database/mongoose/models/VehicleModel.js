import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brands",
    },
    color: {
      type: String,
    },
    bodyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "body-types",
    },
    fuel: {
      type: String,
    },
    transmission: {
      type: String,
    },
    seats: {
      type: String,
    },
    vehicleRegistrationNumber: {
      type: String,
    },
    registrationCertificateFrontImage: {
      type: String,
    },
    registrationCertificateBackImage: {
      type: String,
    },
    mileage: {
      type: String,
    },
    city: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    pickUpLocation: {
      type: String,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "host",
    },
    vehicleImages: {
      type: Array,
    },
    insuranceCertificateImage: {
      type: String,
    },
    pollutionCertificateImage: {
      type: String,
    },
    rent: {
      type: Number,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
        // [longitude, latitude]
      },
    },
    locationText: {
      type: String,
    },
    lastServiceDate: {
      type: String,
    },
    availabilityStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a geospatial index on the location field
vehicleSchema.index({ location: "2dsphere" });

export const VehicleModel = mongoose.model("vehicles", vehicleSchema);

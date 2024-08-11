import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicles",
        required: true
    },
    cleanliness: {
        type: Number
    },
    maintenance: {
        type: Number
    },
    convenience: {
        type: Number
    },
    timing: {
        type: Number
    }
}, { timestamps: true });

const VehicleRatingModel = mongoose.model("vehicle_rating", ratingSchema);

export default VehicleRatingModel;
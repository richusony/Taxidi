import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
        unique: true
    },
    brandImage: {
        type: String,
        required: true,
        unique: true
    }
},{timestamps:true})

export const BrandModel = mongoose.model("Brands", brandSchema);
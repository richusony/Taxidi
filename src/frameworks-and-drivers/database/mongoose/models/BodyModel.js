import mongoose from "mongoose";

const bodySchema = new mongoose.Schema({
    bodyType: {
        type: String,
        required: true,
        unique: true
    }
},{timestamps:true})

export const BodyModel = mongoose.model("body-types", bodySchema);
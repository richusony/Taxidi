import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
    },
    city: {
        type: String,
    },
    pincode: {
        type: Number
    },
    licenseNumber: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    blocked: {
        type: String,
    },
})

export const UserModel = mongoose.model("Users", userSchema);
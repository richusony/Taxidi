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
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
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
        required: true
    },
})

export const UserModel = mongoose.model("Users", userSchema);
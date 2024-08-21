import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    context: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, { timestamps: true });

const UserNotificationModel = mongoose.model("user_notifications", notificationSchema);

export default UserNotificationModel;
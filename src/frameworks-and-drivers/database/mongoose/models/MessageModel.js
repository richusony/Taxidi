import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    msgFrom: {
        type: String,
        required: true
    },
    msgTo: {
        type: String,
        required: true
    },
    message: {
        type: String,
    }
}, { timestamps: true });

const MessageModel = mongoose.model("messages", messageSchema);

export default MessageModel;
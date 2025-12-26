import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema({
    sendBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth",
        required: true,
    },
    receivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    rejectionCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const FriendRequestModel = mongoose.models.FriendRequest || mongoose.model("FriendRequest", FriendRequestSchema);

export default FriendRequestModel;
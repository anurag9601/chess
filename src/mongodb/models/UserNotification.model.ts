import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    model: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "modelType"
    },
    modelType: {
        type: String,
        required: true,
        enum: ["EmailVerification", "UserFriend", "UserAuth", "SignInVerificationSession", "FriendRequest"]
    },
    message: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const UserNotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth",
        required: true,
        index: true,
    },
    notifications: {
        type: [NotificationSchema],
        default: [],
    }
}, { timestamps: true });

const UserNotificationModel = mongoose.models.UserNotification || mongoose.model("UserNotification", UserNotificationSchema);

export default UserNotificationModel;
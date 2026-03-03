import mongoose from "mongoose";

const UserMatchSchema = new mongoose.Schema({
    challengedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth",
        required: true,
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth",
        required: true,
    },
    wonUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth",
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const UserMatchModel = mongoose.models.UserMatch || mongoose.model("UserMatch", UserMatchSchema);

export default UserMatchModel;
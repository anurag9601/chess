import mongoose from "mongoose";

const UserAuthSchema = new mongoose.Schema({
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    fName: {
        type: String,
        required: true,
    },
    lName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    uniqueUserName: {
        type: String,
        required: true,
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

const UserAuthModel = mongoose.models.UserAuth || mongoose.model("UserAuth", UserAuthSchema);

export default UserAuthModel;
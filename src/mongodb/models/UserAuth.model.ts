import mongoose from "mongoose";

const UserAuthSchema = new mongoose.Schema({
    isEmailVerified : {
        type: Boolean,
        required: true,
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
    }
}, { timestamps: true });

const UserAuthModel = mongoose.models.UserAuth || mongoose.model("UserAuth", UserAuthSchema);

export default UserAuthModel;
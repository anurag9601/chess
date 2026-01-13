import mongoose from "mongoose";

const SignInVerificationSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth",
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        required: true,
    },
    expiredOn: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const SignInVerificationSessionModel = mongoose.models.SignInVerificationSession || mongoose.model("SignInVerificationSession", SignInVerificationSessionSchema);

export default SignInVerificationSessionModel;
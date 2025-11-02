import mongoose from "mongoose";

const EmailVerificationSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
},{ timestamps: true });

const EmailVerificationModel = mongoose.models.EmailVerification || mongoose.model("EmailVerification", EmailVerificationSchema);

export default EmailVerificationModel;
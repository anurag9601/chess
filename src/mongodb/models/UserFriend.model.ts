import mongoose from "mongoose";
import { boolean } from "zod";

const UserFriendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth",
    },
    wonMatches: {
        type: Number,
        default: 0,
    },
    looseMatches: {
        type: Number,
        default: 0,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserAuth"
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const UserFriendModel = mongoose.models.UserFriend || mongoose.model("UserFriend", UserFriendSchema);

export default UserFriendModel;
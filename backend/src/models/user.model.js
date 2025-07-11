import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true

        },
        trnsactions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }],
         groups: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group"
        }],
        avatar: {
            type: String,

        }
    }, { timestamps: true }
)
 export const User = mongoose.model("User", userSchema);

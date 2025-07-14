import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {

        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,

        },
        description: {
            type: String,
            required: true,

        },
        amount: {
            type: Number,
            required: true,
            min: 0,

        },

        payer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        splitDetails: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                share: {
                    type: Number,
                    required: true,
                    min: [0, "Share must be non-negative"],
                },
                isPaid: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        currency: {
            type: String,
            required: true,
            default: "INR",
            uppercase: true,
        },
        avatar: {
            type: String,

        }



    }, { timestamps: true }
)
export const Transaction = mongoose.model("Transaction", transactionSchema)

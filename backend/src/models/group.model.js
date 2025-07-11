

import mongoose from "mongoose";
const groupSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        
        users: [
            {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        transactions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }],
        groupAvatar: {
            type: String,

        }

    }, { timestamps: true }
)
 export const Group = mongoose.model("Group", groupSchema)

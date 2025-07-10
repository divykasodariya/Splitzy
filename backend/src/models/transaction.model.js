import mongoose from "mongoose";

const transactionSchema=new mongoose.Schema(
    {
        nature:{
            type:String,
            required:true,

        },
        group:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Group",
            required:true,

        },
        description:{
            type:String,
            required:true,

        },
        amount:{
            type:Number,
            required:true,

        },
        receiver:{

            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,

        },
        payer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        splitBw:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            }
        ],

        isPayed:{
            type:Boolean,
            required:true,
        },
        currency:{
            type:String,
            required:true,
        },
        avatar:{
            type:String,

        }


        
    },{timestamps:true}
)
 export const Transaction = mongoose.model("Transaction",transactionSchema)

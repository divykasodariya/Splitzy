import { Group } from "../models/group.model.js";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const addExpense = async (req, res) => {
    const { groupid, description, amount, payer, splitDetails, currency } = req.body;
    try {
        const grp = await Group.findOne({ _id: groupid })
        if (!grp.users.includes(payer)) throw new ApiError(300, "unauthorised you must be in the group", [])
        const transaction = await Transaction.create({
            group: grp,
            description,
            amount,
            payer,
            splitDetails,
            currency

        })
        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            transaction,
        })
    } catch (error) {
        if (error instanceof (ApiError)) {
            throw error
        }
        console.log(error)
        throw new ApiError(500, "unexpected error occured in settling up ", [])
    }
}
const SettleUp = async (req, res) => {
    const { transid, amount } = req.body
    const userid = req._id;

    if (!transid || !amount) throw new ApiError(404,
        "invalid transaction or amount"
    )
    try {
        const transc = await Transaction.findOne({ _id: transid })
        const user = await User.findOne({ _id: userid })
        if (!user) throw new ApiError(404, "no user found")
        if (!transc) throw new ApiError(404, "no transaction found")
        transc.splitDetails.forEach((split) => {
            if (split.user.toString() === userid) {
                split.isPaid = true;
                split.share -= amount;
            }
        });
        await transc.save();
        return res.status(200).json({ success: true, message: "successfully settled up" })

    } catch (error) {
        if (error instanceof (ApiError)) {
            throw error
        }
        throw new ApiError(500, "unexpected error occured in settling up ", [])
    }
}


const getAllTransactionsGrp = async (req, res) => {
    try {
        // const user = await User.findOne({_id:req._id})
        const grp = await Group.findOne({ _id: req.body.groupid }).populate({
            path: 'transactions',
            populate: [
                { path: 'payer', select: 'name email' },
                { path: 'splitDetails.user', select: 'name email' },

            ]
        });
        if (!grp) throw new ApiError(404, "no grp found", [])
        const transctions = grp.transactions;
        res.status(200).json(transctions);
    } catch (error) {
        if (error instanceof (ApiError)) {
            throw error
        }
        console.log(error)
        throw new ApiError(500, "unexpected error occured in getting all expenses ", [])
    }
}
const getAllTransactionsUsr = async (req, res) => {
    try {
        // const user = await User.findOne({_id:req._id})
        const user = await User.findOne({ _id: req._id }).populate({
            path: "transactions",
            populate: [
                { path: "payer", select: "name email" },
                { path: "splitDetails.user", select: "name email" }
            ]
        })

        if (!user) throw new ApiError(404, "no user found", [])
         const transctions = user.transactions;
        res.status(200).json(transctions);
    } catch (error) {
        if (error instanceof (ApiError)) {
            throw error
        }
        console.log(error)
        throw new ApiError(500, "unexpected error occured in getting all expenses ", [])
    }
}

export { addExpense, getAllTransactionsGrp, SettleUp ,getAllTransactionsUsr}
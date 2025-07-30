import { Group } from "../models/group.model.js";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
const addExpense = async (req, res) => {
    const { groupid, description, amount, payer, splitDetails, currency } = req.body;

    try {
        // 1. Validate group and payer
        const group = await Group.findById(groupid);
        if (!group) throw new ApiError(404, "Group not found", []);
        if (!group.users.includes(payer)) {
            throw new ApiError(403, "Unauthorized - You must be in the group", []);
        }

        // 2. Create transaction
        const transaction = await Transaction.create({
            group: groupid,
            description,
            amount,
            payer,
            splitDetails,
            currency
        });

        // 3. Add transaction to group
        group.transactions.push(transaction._id);
        await group.save();

        // 4. Add transaction to all involved users (payer + split users)
        const userIds = [
            payer,
            ...splitDetails.map(detail => detail.user)
        ];

        await User.updateMany(
            { _id: { $in: userIds } },
            { $addToSet: { transactions: transaction._id } }
        );

        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            transaction,
        });

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error("Error adding expense:", error);
        throw new ApiError(500, "Unexpected error occurred while adding expense", [error]);
    }
};
const SettleUp = async (req, res) => {
    const { transid, splitId } = req.body
    const userid = req._id;

    if (!transid || !splitId) throw new ApiError(404,
        "invalid transaction or splitId"
    )
    try {

        const transc = await Transaction.findOne({ _id: transid }).populate({
            path: "payer",
            select: "_id username"
        }).populate({
            path: "group", select: "groupAvatar name _id"
        }).populate({
            path: "splitDetails.user", select: "username _id"
        })

        // Use the authenticated user's ID, not splitId
        const user = await User.findOne({ _id: userid }).populate({
            path: "transactions.splitDetails.user", select: "username _id "
        })

        if (!user) throw new ApiError(404, "no user found")
        if (!transc) throw new ApiError(404, "no transaction found")

        // Find and update the specific split
        const splitToUpdate = transc.splitDetails.find(split => split._id.toString() === splitId);
        if (!splitToUpdate) {
            throw new ApiError(404, "Split not found");
        }

        splitToUpdate.isPaid = true;

        await transc.save();

        // Find the specific transaction in the user's transactions array
        const userTransaction = user.transactions.find(t => t._id.toString() === transid);
        if (userTransaction) {
            userTransaction.splitDetails = transc.splitDetails;
        }
        await user.save();

        const group = await Group.findOne({ _id: transc.group._id }).populate({
            path: "transactions",
            populate: {
                path: "splitDetails.user",
                select: "username _id"
            }
        })
        const groupTransaction = group.transactions.find(trsn => trsn._id.toString() === transid);
        if (groupTransaction) {
            groupTransaction.splitDetails = transc.splitDetails;
        }
        await group.save();

        return res.status(200).json({ success: true, message: "successfully settled up" })

    } catch (error) {
        if (error instanceof (ApiError)) {
            throw error
        }
        console.error("Error in SettleUp:", error);
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
                { path: "payer", select: "username avatar " },
                { path: "splitDetails.user", select: "username avatar" },
                { path: "group", select: "name groupAvatar" }
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
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params; 
        
       
        const transaction = await Transaction.findOne({ _id: id }).populate({ 
            path: "group", 
            select: "name _id" 
        });
        
        if (!transaction) {
            throw new ApiError(404, "Transaction not found");
        }
        
        const group = await Group.findOne({ _id: transaction.group._id }).populate({ 
            path: "users", 
            select: "_id username" 
        });

        const isUserInGroup = group.users.some(user => user._id.toString() === req._id.toString());
        if (!isUserInGroup) {
            throw new ApiError(403, "You are not authorized to delete this transaction");
        }
        
        await Transaction.deleteOne({ _id: id });
        
        group.transactions = group.transactions.filter(t => t.toString() !== id);
        await group.save();
        
        await User.updateMany(
            { transactions: id },
            { $pull: { transactions: id } }
        );
        
        return res.status(200).json({
            success: true,
            message: "Transaction successfully deleted"
        });
    } catch (error) {
        console.error("Error deleting expense:", error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Unexpected error in deleting expense", [error]);
    }
}
export { addExpense, getAllTransactionsGrp, SettleUp, getAllTransactionsUsr , deleteExpense }
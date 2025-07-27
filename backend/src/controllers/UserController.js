import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { ApiError } from '../utils/ApiError.js'
import { User } from "../models/user.model.js";
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        throw new ApiError(400, "invalid input all fields are necesarry ", [])
    }
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new ApiError(404, "user does not exists ! try registering  ", [])
        }
        const encrypted_pass = user.password;
        const isMatch = await bcrypt.compare(password, encrypted_pass)
        if (!isMatch) {
            throw new ApiError(400, "credentials does not match", []);

        }
        else {
            const jwtPayload = {
                id: user._id,
                email,
            }
            const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, { expiresIn: "730h" })
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 730 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                }
            });


        }

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.log(error)
        throw new ApiError(500, "unexpected error while logging in", [error])
    }
}

const userRegister = async (req, res) => {
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
        throw new ApiError(400, "invalid input all fields are necesarry ", []);
    }
    try {
        const encrypted_pass = await bcrypt.hash(password, 10)
        const avatar = `https://avatar.iran.liara.run/username?username=${username}`;
        const user = await User.create({
            username,
            email,
            password: encrypted_pass,
            trnsactions: [],
            avatar: avatar
        });
        const jwtPayload = {
            id: user._id,
            email,
        }
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, { expiresIn: "730h" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 730 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.log(err);
        throw new ApiError(500, "error registering user ", [err]);
    }

}

const userLogout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,

    });
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    })
}

const balanceSummaryUsr = async (req, res) => {
    //api/v1/users/balance/
    try {
        const user = await User.findOne({ _id: req.id }).populate({
            path: "transactions", populate: [{ path: "groups", select: "name _id" },
            { path: "payer", select: "username _id email" },
            { path: "splitDetails.user", select: "username _id email" }]
        })
        const transactions = user.transactions;
        const balanceSheet = {};
        const userId = req.params.id;
        for (const tx of transactions) {
            const payerId = tx.payer._id.toString();

            for (const detail of tx.splitDetails) {
                const otherId = detail.user._id.toString();
                const share = detail.share;

                if (userId === payerId && otherId !== userId) {
                    // current user paid → others owe them
                    balanceSheet[otherId] = (balanceSheet[otherId] || 0) + share;
                } else if (otherId === userId && payerId !== userId) {
                    // current user owes → they owe payer
                    balanceSheet[payerId] = (balanceSheet[payerId] || 0) - share;
                }
            }
        }

        // Create a readable summary
        const summary = Object.entries(balanceSheet).map(([otherUserId, balance]) => {
            const txWithUser = transactions.find(tx =>
                tx.payer._id.toString() === otherUserId ||
                tx.splitDetails.some(d => d.user._id.toString() === otherUserId)
            );

            const otherUser =
                txWithUser?.payer._id.toString() === otherUserId
                    ? txWithUser.payer
                    : txWithUser?.splitDetails.find(d => d.user._id.toString() === otherUserId)?.user;

            return {
                user: {
                    _id: otherUser._id,
                    username: otherUser.username,
                    email: otherUser.email,
                },
                netBalance: balance.toFixed(2),
                status: balance > 0 ? `They owe you ${balance.toFixed(2)}` : `You owe them ${balance.toFixed(2)}`
            };
        });
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
            balances: summary
        });

    } catch (error) {
        if (error instanceof (ApiError)) throw error
        console.log(error);
        throw new ApiError(500, "internal server error occured in generating summary", [])
    }
}
const shortSummaryUsr = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req._id }).populate({
            path: "transactions",
            select: "payer splitDetails amount currency"
        });

        if (!user) throw new ApiError(404, "User not found", []);

        let totalOwed = 0;  // Amount others owe you (you're owed)
        let totalOwe = 0;   // Amount you owe others

        user.transactions.forEach((transaction) => {
            // If user is the payer, they're owed money by others
            if (transaction.payer.equals(user._id)) {
                transaction.splitDetails.forEach((detail) => {
                    if (!detail.user.equals(user._id)) {
                        totalOwed += detail.share;
                    }
                });
            } 
            // If user is not the payer, they owe money to the payer
            else {
                const userSplit = transaction.splitDetails.find(detail => 
                    detail.user.equals(user._id)
                );
                if (userSplit) {
                    totalOwe += userSplit.share;
                }
            }
        });

        const netBalance = totalOwe - totalOwed;
        const currencySymbol = user.transactions[0]?.currency === "USD" ? "$" : "₹"; // Default to ₹ if no transactions

        res.status(200).json({
            success: true,
            totalOwed: `${currencySymbol}${totalOwed.toFixed(2)}`,
            totalOwe: `${currencySymbol}${totalOwe.toFixed(2)}`,
            netBalance: netBalance === 0 
                ? "You're all settled up!"
                : netBalance > 0
                    ? `You owe ${currencySymbol}${Math.abs(netBalance).toFixed(2)} in total`
                    : `You are owed ${currencySymbol}${Math.abs(netBalance).toFixed(2)} in total`
        });

    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }
        console.log(err);
        throw new ApiError(500, "Error creating user balance summary", [err]);
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req._id }).select('_id username email avatar');
        
        if (!user) throw new ApiError(404, "User not found", []);

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }
        console.log(err);
        throw new ApiError(500, "Error fetching user profile", [err]);
    }
};

export { userLogin, userRegister, userLogout, balanceSummaryUsr, shortSummaryUsr, getCurrentUser };
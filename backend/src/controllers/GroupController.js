import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { Group } from "../models/group.model.js"
const getAllGroups = async (req, res) => {
    const user = await User.findOne({ "_id": req._id })
    if (!user) return res.status(400).json({ message: "user not found" })
    res.status(200).json(user.groups);
}
const joinGroup = async (req, res) => {
    const _id = req._id;
    const groupId = req.body.groupId;
    try {
        const user = await User.findOne({ "_id": _id });
        const group = await Group.findOne({ "_id": groupId })
        if (!user || !group) throw new ApiError(400, "invalid user or group");
        console.log(user.groups);
        if (user.groups.includes(group._id)) throw new ApiError(400, "user already exists in the group")
        user.groups.push(group);
        await user.save();
        group.users.push(user);
        await group.save();
        return res.status(200).json({ success: true, message: "successfully joined group" })
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "unexpected error in joining group", [error])
    }

}
const createGroup = async (req, res) => {
    const _id = req._id;
    const { name } = req.body;

    try {
        const user = await User.findOne({ _id: _id })
        if (!user) throw new ApiError(400, "invalid user")
        const group = await Group.create({
            name: name,
            users: [user],
            transactions: [],
            groupAvatar: `https://avatar.iran.liara.run/username?username=${name}`

        })

        user.groups.push(group);
        await user.save();
        // res.status(200).json({success:true,message:"successfully created group"})
        return res.status(200).json({
            success: true,
            message: "Group created",

        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.log(error)
        throw new ApiError(500, "unexpected error in creating group", [error])

    }

}
const addUser = async (req, res) => {
    const { userId, groupId } = req.body;
    try {
        const user = await User.findOne({ _id: userId });
        const group = await Group.findOne({ _id: groupId })
        if (!user || !group) throw new ApiError(400, "invalid user or group");
        if (user.groups.includes(group._id)) throw new ApiError(400, "user already exists in the group")
        user.groups.push(group);
        await user.save();
        group.users.push(user);
        await group.save();
        return res.status(200).json({ success: true, message: "successfully added to group" })
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, "unexpected error in adding in group", [error])
    }
}
const deleteGroup = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req._id });
        const group = await Group.findOne({ _id: req.params.id })
        if (!user || !group) throw new ApiError(404, "no user or group found ", []);
        if (!user.groups.includes(group._id)) throw new ApiError(404, "unauthorised to delete this group must join first", []);

        user.groups = user.groups.filter((groupp) => {
            return groupp.toString() !== group._id.toString();
        });
        await user.save();
        await group.deleteOne()
        res.status(200).json({ message: "successfully removed group" })

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, "unexpected error in deleting group", [error])

    }


}
const removeUser = async (req, res) => {

    const { userid, groupid } = req.body;
    if (!userid) {
        userid = req._id
    }
    if (!userid || !groupid) throw new ApiError(400, "invalid user or group ", [])
    try {
        const user = await User.findOne({ _id: userid });
        const group = await Group.findOne({ _id: userid });
        if (!user || !group) throw new ApiError(400, " no group or user found ", [])

        //remove group from user.groups
        user.groups = user.groups.filter((groupp) => {
            return groupp !== group._id.toString()
        })
        //remove user from group.users
        group.users = group.users.filter((thisuser) => {
            return thisuser !== user._id.toString()
        })
        await user.save()
        await group.save()
        res.status(200).json({success:true,message:"successfully removed from group "})

    } catch (error) {
        if (error instanceof (ApiError)) {
            throw error
        }
        throw new ApiError(500, "unexpected error occured in removing user ", [])
    }
}
const getAllUsers=async(req,res)=>{
    try {
        const {groupid}=req.body;
        const userid=req._id;
        const group = await Group.findOne({_id:groupid})
        // console.log("this is group.users",group.users);
        const users= group.users.filter((u)=>{
            // console.log("user : ",u._id)
            return u._id.toString()!==userid.toString()
        })
        res.status(200).json(users)


    } catch (error) {
        if(error instanceof(ApiError)){
            throw error
        }
        throw new ApiError(500,"unexpected error occured in getting all users of the group")
    }
}
export { getAllGroups, joinGroup, createGroup, addUser, deleteGroup, removeUser,getAllUsers };
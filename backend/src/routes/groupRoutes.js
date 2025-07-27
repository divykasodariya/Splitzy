import { Router } from "express"
import { addUser, balanceSheetGrp, createGroup, deleteGroup ,getAllUsers, getAllGroups, getGroupInfo, joinGroup, removeUser } from "../controllers/GroupController.js";
import { isAuth } from "../middlewares/auth.js";

const GroupRouter = Router();
GroupRouter.route('/getall').get(isAuth,getAllGroups)
GroupRouter.route('/add').post(isAuth,addUser)
GroupRouter.route('/create').post(isAuth,createGroup)
GroupRouter.route('/join').post(isAuth,joinGroup)
GroupRouter.route('/delete/:id').delete(isAuth,deleteGroup);
GroupRouter.route('/remove').delete(isAuth,removeUser)
GroupRouter.route('/allusers/:id').get(isAuth,getAllUsers);
GroupRouter.route('/balance/:id').get(isAuth,balanceSheetGrp)
GroupRouter.route('/info/:id').get(isAuth,getGroupInfo)
export {GroupRouter};
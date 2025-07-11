import Router from "express"
import { userLogin, userLogout, userRegister } from "../controllers/UserController.js";
import {isAuth} from "../middlewares/auth.js"
const UserRouter = Router();


UserRouter.route('/register').post(userRegister)
UserRouter.route('/login').post(userLogin)
UserRouter.route('/logout').delete(isAuth,userLogout)
export{UserRouter}
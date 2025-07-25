import Router from "express"
import { balanceSummaryUsr, shortSummaryUsr, userLogin, userLogout, userRegister } from "../controllers/UserController.js";
import {isAuth} from "../middlewares/auth.js"
const UserRouter = Router();


UserRouter.route('/register').post(userRegister)
UserRouter.route('/login').post(userLogin)
UserRouter.route('/logout').delete(isAuth,userLogout)
UserRouter.route('/balance/:id').get(isAuth,balanceSummaryUsr)
UserRouter.route('/balance').get(isAuth,shortSummaryUsr);
export{UserRouter}
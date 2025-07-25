import Router from 'express'
import { isAuth } from '../middlewares/auth.js'
import { addExpense, getAllTransactionsGrp, getAllTransactionsUsr, SettleUp } from '../controllers/TransactionController.js'
const TransRouter= Router()
TransRouter.route('/add').post(isAuth,addExpense)
TransRouter.route('/settle').post(isAuth,SettleUp);
TransRouter.route('/getallbyGrp').get(isAuth,getAllTransactionsGrp);
TransRouter.route('/getallbyUsr').get(isAuth,getAllTransactionsUsr);
export{TransRouter}
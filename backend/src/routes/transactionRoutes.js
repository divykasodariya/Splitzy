import Router from 'express'
import { isAuth } from '../middlewares/auth.js'
import { getAllTransactionsGrp, SettleUp } from '../controllers/TransactionController.js'
const TransRouter= Router()
TransRouter.route('/alltransgrp').get(isAuth,getAllTransactionsGrp)
TransRouter.route('/settle').post(isAuth,SettleUp);

export{TransRouter}
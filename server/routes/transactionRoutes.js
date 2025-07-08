import express from "express"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { deleteTransaction, transactionController , transactionListController, minimisedTransactionsController } from "../controllers/transactionController.js";
const router = express.Router();
router.post('/add' , verifyToken , transactionController);
router.get('/list' , verifyToken , transactionListController);
router.delete('/remove/:id', verifyToken, deleteTransaction);
router.get('/settlement' , verifyToken ,minimisedTransactionsController );

export default router;
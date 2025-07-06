import express from "express"
import { verifyToken } from "../middlewares/authMiddleware.js"
const router = express.Router();
router.get('/me' , verifyToken , (req,res)=>{
    res.json({success : true, username : req.user.username , message: `Welcome, user ${req.user.id}` });
})
export default router;
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user" , userRoutes);
app.use("/api/transactions" , transactionRoutes);
app.use("/api/projects" , projectRoutes);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("MONGODB Connected");
})
const PORT = process.env.PORT || 5001;
app.listen(PORT , ()=>{
    console.log(`Server Running on PORT 5001 ${process.env.PORT}`);
})
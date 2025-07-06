import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user" , userRoutes);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("MONGODB Connected");
})
const PORT = process.env.PORT || 5001;
app.listen(PORT , ()=>{
    console.log("Server Running on PORT 5001");
})
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  giverName: { type: String, required: true },
  recieverName: { type: String, required: true },
  amount: { type: String, required: true },
  description: { type: String},
  createdBy: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  projectId : {type : String , required : true}
});

export default mongoose.model("Transaction", transactionSchema);

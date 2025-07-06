import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  giverName: { type: String, required: true },
  recieverName: { type: String, required: true },
  amount: { type: String, required: true },
  description: { type: String},
  createdBy: { type: String }, // can be user ID or guest ID
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", transactionSchema);

import Transaction from "../models/Transaction.js";
import { computeSettlements } from '../utils/computeMinimumSettlements.js';

const getUserId = (req) => {
  if (!req.user) return null;
  return req.user.isGuest ? req.user.guestId : req.user.id;
};


export const transactionController = async (req, res) => {
  try {
    const { giver, reciever, amount, description, projectId } = req.body;
    if(!giver || !reciever){
      return res.status(400).json({
        success :false,
        message : "Giver and Reciever are required"
      })
    }
    if(isNaN(amount) || Number(amount) <= 0){
      return res.status(400).json({
        success :false,
        message : "Provide Positive Amount"
      })
    }
    if(!projectId){
      return res.status(400).json({
        success :false,
        message : "Select a project/Add a Project"
      })
    }

    const transaction = new Transaction({
      giverName: giver,
      recieverName: reciever,
      amount,
      description,
      createdBy: getUserId(req),
      projectId, 
    });

    await transaction.save();

   return res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server error while saving transaction",
    });
  }
};


export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);

  if(!userId){
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }

  try {
    const tr = await Transaction.findByIdAndDelete(id);

    if (!tr) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction successfully deleted",
      deletedTransaction: tr,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const transactionListController = async (req, res) => {
  const userId = getUserId(req);
  if(!userId){
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }
  try {
    const tr = await Transaction.find({ createdBy: userId });

    return res.status(200).json({
      success: true,
      list: tr,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const minimisedTransactionsController = async (req, res) => {
  const userId = getUserId(req);
  const projectId = req.query.projectId; 

  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }

  try {
    const filter = { createdBy: userId };
    if (projectId) {
      filter.projectId = projectId;
    }

    const tr = await Transaction.find(filter); 

    const settlements = computeSettlements(tr);

    return res.status(200).json({
      success: true,
      list: settlements,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

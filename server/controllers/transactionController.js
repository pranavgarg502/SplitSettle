import Transaction from "../models/Transaction.js";
// controllers/transactionsController.js
import { computeSettlements } from '../utils/computeMinimumSettlements.js';


export const transactionController = async (req, res) => {
  try {
    const { giver, reciever, amount, description } = req.body;
    console.log(req.body);
    // Basic validation
    if (!giver || !reciever || !amount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create and save transaction
    const transaction = new Transaction({
      giverName : giver,
      recieverName : reciever,
      amount,
      description,
      createdBy: req.user?.id || "guest", // for guest or JWT user
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Server error while saving transaction",
    });
  }
};
export const deleteTransaction = async (req, res) => {
  const { id } = req.params; // destructure to get the ID string
  try {
    const tr = await Transaction.findByIdAndDelete(id);

    if (!tr) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction successfully deleted",
      deletedTransaction: tr,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const transactionListController = async(req,res) =>{
  try{
    const id = req.user?.id;
    const tr = await Transaction.find({
      createdBy : id
    })
    res.status(200).json({
      success : true,
      list : tr
    })
  }
  catch(e){
    console.log(e);
    res.status(500).json({
      success : false ,
      message : "Server Error"
    })
  }

};




export const minimisedTransactionsController = async (req, res) => {
  try {
    const id = req.user?.id;
    const tr = await Transaction.find({ createdBy: id });

    const settlements = computeSettlements(tr);
    console.log(settlements);
    res.status(200).json({
      success: true,
      list: settlements,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


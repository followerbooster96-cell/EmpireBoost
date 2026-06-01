import express from "express";

import Transaction from "../models/Transaction.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// USER GETS OWN TRANSACTIONS
router.get("/my", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get my transactions error",
      error: error.message,
    });
  }
});

// ADMIN GETS ALL TRANSACTIONS
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("userId", "email balance role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all transactions error",
      error: error.message,
    });
  }
});

export default router;
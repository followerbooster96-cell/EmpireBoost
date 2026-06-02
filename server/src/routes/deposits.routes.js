import express from "express";

import User from "../models/User.js";
import Deposit from "../models/Deposit.js";
import PromoCode from "../models/PromoCode.js";
import Transaction from "../models/Transaction.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const allowedManualMethods = [
  "payeer",
  "crypto",
  "revolut",
  "skrill",
  "bank",
  "paypal",
  "manual",
];

const createPaymentReference = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EB-${random}`;
};

const formatAmount = (value) => {
  return Number(Number(value || 0).toFixed(4));
};

const normalizeMethod = (method) => {
  return method ? String(method).toLowerCase().trim() : "manual";
};

const normalizeText = (value) => {
  return value ? String(value).trim() : "";
};

// COINREMITTER WEBHOOK HEALTH CHECK / VALIDATION
router.get("/coinremitter/webhook", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "CoinRemitter webhook active",
    provider: "coinremitter",
  });
});

// COINREMITTER WEBHOOK RECEIVER
router.post("/coinremitter/webhook", async (req, res) => {
  try {
    console.log("CoinRemitter webhook received:", req.body);

    return res.status(200).json({
      success: true,
      message: "CoinRemitter webhook received",
    });
  } catch (error) {
    console.error("CoinRemitter webhook error:", error.message);

    return res.status(200).json({
      success: false,
      message: "CoinRemitter webhook error",
    });
  }
});

// USER CREATES MANUAL DEPOSIT REQUEST
router.post("/", protect, async (req, res) => {
  try {
    const { amount, promoCode, method, userNote } = req.body;

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Deposit amount must be positive",
      });
    }

    const cleanMethod = normalizeMethod(method);

    if (!allowedManualMethods.includes(cleanMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid manual payment method",
      });
    }

    const cleanPromoCode = promoCode
      ? String(promoCode).trim().toUpperCase()
      : "";
    const cleanUserNote = normalizeText(userNote);

    let paymentReference = createPaymentReference();
    let existingReference = await Deposit.findOne({ paymentReference });

    while (existingReference) {
      paymentReference = createPaymentReference();
      existingReference = await Deposit.findOne({ paymentReference });
    }

    const deposit = await Deposit.create({
      userId: req.user._id,
      amount: formatAmount(numericAmount),
      promoCode: cleanPromoCode,
      bonusAmount: 0,
      finalAmount: formatAmount(numericAmount),
      method: cleanMethod,
      paymentReference,
      userNote: cleanUserNote,
      status: "pending",
      adminNote: "",
    });

    res.status(201).json({
      success: true,
      message: "Deposit request created. Waiting for admin approval.",
      deposit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create deposit error",
      error: error.message,
    });
  }
});

// USER GETS OWN DEPOSITS
router.get("/my", protect, async (req, res) => {
  try {
    const deposits = await Deposit.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get my deposits error",
      error: error.message,
    });
  }
});

// ADMIN GETS ALL DEPOSITS
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const { status, method, search } = req.query;

    const filter = {};

    if (status && status !== "all") {
      filter.status = String(status).toLowerCase().trim();
    }

    if (method && method !== "all") {
      const cleanMethod = normalizeMethod(method);

      if (allowedManualMethods.includes(cleanMethod)) {
        filter.method = cleanMethod;
      }
    }

    if (search && search.trim() !== "") {
      const cleanSearch = search.trim();

      filter.$or = [
        { paymentReference: { $regex: cleanSearch, $options: "i" } },
        { promoCode: { $regex: cleanSearch, $options: "i" } },
        { userNote: { $regex: cleanSearch, $options: "i" } },
        { adminNote: { $regex: cleanSearch, $options: "i" } },
      ];
    }

    const deposits = await Deposit.find(filter)
      .populate("userId", "email balance role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all deposits error",
      error: error.message,
    });
  }
});

// ADMIN APPROVES DEPOSIT
router.put("/admin/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const { adminNote } = req.body;

    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Deposit already processed",
      });
    }

    const user = await User.findById(deposit.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let bonusAmount = 0;
    let finalAmount = formatAmount(deposit.amount);
    let appliedPromoCode = "";

    if (deposit.promoCode && deposit.promoCode.trim() !== "") {
      const promo = await PromoCode.findOne({
        code: deposit.promoCode.trim().toUpperCase(),
        enabled: true,
      });

      if (!promo) {
        return res.status(400).json({
          success: false,
          message: "Invalid or disabled promo code",
        });
      }

      if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) {
        return res.status(400).json({
          success: false,
          message: "Promo code usage limit reached",
        });
      }

      bonusAmount = formatAmount(
        (Number(deposit.amount) * promo.bonusPercent) / 100
      );
      finalAmount = formatAmount(Number(deposit.amount) + bonusAmount);

      promo.usedCount += 1;
      await promo.save();

      appliedPromoCode = promo.code;
    }

    user.balance = formatAmount(Number(user.balance || 0) + finalAmount);
    await user.save();

    deposit.status = "approved";
    deposit.bonusAmount = bonusAmount;
    deposit.finalAmount = finalAmount;
    deposit.adminNote = normalizeText(adminNote) || deposit.adminNote || "";
    await deposit.save();

    await Transaction.create({
      userId: user._id,
      type: "topup",
      amount: finalAmount,
      status: "completed",
      provider: deposit.method,
      reference: deposit.paymentReference,
      description: appliedPromoCode
        ? `Deposit approved. Method ${deposit.method}. Amount €${deposit.amount}, bonus €${bonusAmount}, code ${appliedPromoCode}`
        : `Deposit approved. Method ${deposit.method}. Amount €${deposit.amount}`,
    });

    const populatedDeposit = await Deposit.findById(deposit._id).populate(
      "userId",
      "email balance role"
    );

    res.json({
      success: true,
      message: "Deposit approved successfully",
      deposit: populatedDeposit,
      user: {
        id: user._id,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Approve deposit error",
      error: error.message,
    });
  }
});

// ADMIN REJECTS DEPOSIT
router.put("/admin/:id/reject", protect, adminOnly, async (req, res) => {
  try {
    const { adminNote } = req.body;

    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Deposit already processed",
      });
    }

    deposit.status = "rejected";
    deposit.adminNote = normalizeText(adminNote);
    deposit.finalAmount = formatAmount(deposit.finalAmount || deposit.amount);
    await deposit.save();

    const populatedDeposit = await Deposit.findById(deposit._id).populate(
      "userId",
      "email balance role"
    );

    res.json({
      success: true,
      message: "Deposit rejected",
      deposit: populatedDeposit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Reject deposit error",
      error: error.message,
    });
  }
});

export default router;
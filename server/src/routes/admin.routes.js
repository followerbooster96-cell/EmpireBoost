import express from "express";
import User from "../models/User.js";
import Service from "../models/Service.js";
import Order from "../models/Order.js";
import Transaction from "../models/Transaction.js";
import PromoCode from "../models/PromoCode.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// TEMP: make first user admin
router.post("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User is now admin",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Make admin error",
      error: error.message,
    });
  }
});

// ADMIN TEST
router.get("/test", protect, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: "Admin route is working",
    user: req.user,
  });
});

// ==========================
// ADMIN SERVICES
// ==========================

router.get("/services", protect, adminOnly, async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get admin services error",
      error: error.message,
    });
  }
});

router.post("/services", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      platform,
      category,
      type,
      description,
      pricePer1000,
      min,
      max,
      providerServiceId,
    } = req.body;

    if (
      !name ||
      !platform ||
      !category ||
      !type ||
      pricePer1000 === undefined ||
      min === undefined ||
      max === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (Number(min) > Number(max)) {
      return res.status(400).json({
        success: false,
        message: "Min cannot be bigger than max",
      });
    }

    const service = await Service.create({
      name,
      platform,
      category,
      type,
      description,
      pricePer1000: Number(pricePer1000),
      min: Number(min),
      max: Number(max),
      providerServiceId,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create service error",
      error: error.message,
    });
  }
});

router.put("/services/:id", protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update service error",
      error: error.message,
    });
  }
});

router.patch("/services/:id/toggle", protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.enabled = !service.enabled;
    await service.save();

    res.json({
      success: true,
      message: service.enabled ? "Service enabled" : "Service disabled",
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Toggle service error",
      error: error.message,
    });
  }
});

router.delete("/services/:id", protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete service error",
      error: error.message,
    });
  }
});

// ==========================
// ADMIN ORDERS
// ==========================

router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email balance")
      .populate("serviceId", "name platform type")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get admin orders error",
      error: error.message,
    });
  }
});

router.put("/orders/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "completed",
      "failed",
      "cancelled",
      "refunded",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes: notes || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update order status error",
      error: error.message,
    });
  }
});

// ==========================
// ADMIN USERS
// ==========================

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get users error",
      error: error.message,
    });
  }
});

router.post("/users/add-balance", protect, adminOnly, async (req, res) => {
  try {
    const { email, amount, promoCode } = req.body;

    if (!email || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Email and amount are required",
      });
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let bonusAmount = 0;
    let finalAmount = numericAmount;
    let appliedPromoCode = null;

    if (promoCode && promoCode.trim() !== "") {
      const code = promoCode.trim().toUpperCase();

      const promo = await PromoCode.findOne({
        code,
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

      bonusAmount = Number(((numericAmount * promo.bonusPercent) / 100).toFixed(4));
      finalAmount = Number((numericAmount + bonusAmount).toFixed(4));

      promo.usedCount += 1;
      await promo.save();

      appliedPromoCode = promo.code;
    }

    user.balance = Number((user.balance + finalAmount).toFixed(4));
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: "admin",
      amount: finalAmount,
      status: "completed",
      provider: "admin",
      reference: appliedPromoCode
        ? `manual-balance-add-promo-${appliedPromoCode}`
        : "manual-balance-add",
      description: appliedPromoCode
        ? `Manual balance added by admin. Deposit €${numericAmount}, bonus €${bonusAmount} with code ${appliedPromoCode}`
        : "Manual balance added by admin",
    });

    res.json({
      success: true,
      message: appliedPromoCode
        ? `Balance added with promo code ${appliedPromoCode}`
        : "Balance added successfully",
      depositAmount: numericAmount,
      bonusAmount,
      finalAmount,
      promoCode: appliedPromoCode,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Add balance error",
      error: error.message,
    });
  }
});

// ==========================
// ADMIN PROMO CODES
// ==========================

router.get("/promo-codes", protect, adminOnly, async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: promoCodes.length,
      promoCodes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get promo codes error",
      error: error.message,
    });
  }
});

router.post("/promo-codes", protect, adminOnly, async (req, res) => {
  try {
    const { code, bonusPercent, maxUses } = req.body;

    if (!code || bonusPercent === undefined) {
      return res.status(400).json({
        success: false,
        message: "Code and bonus percent are required",
      });
    }

    const cleanCode = code.trim().toUpperCase();

    const existingCode = await PromoCode.findOne({ code: cleanCode });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: "Promo code already exists",
      });
    }

    const promoCode = await PromoCode.create({
      code: cleanCode,
      bonusPercent: Number(bonusPercent),
      maxUses: Number(maxUses || 0),
    });

    res.status(201).json({
      success: true,
      message: "Promo code created successfully",
      promoCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create promo code error",
      error: error.message,
    });
  }
});

// CREATE DEFAULT CODES: IGOR777 + ALEX999
router.post("/promo-codes/create-defaults", protect, adminOnly, async (req, res) => {
  try {
    const defaultCodes = [
      {
        code: "IGOR777",
        bonusPercent: 10,
        maxUses: 0,
      },
      {
        code: "ALEX999",
        bonusPercent: 10,
        maxUses: 0,
      },
    ];

    const results = [];

    for (const item of defaultCodes) {
      const existing = await PromoCode.findOne({ code: item.code });

      if (existing) {
        results.push({
          code: item.code,
          status: "already exists",
        });
      } else {
        const created = await PromoCode.create(item);

        results.push({
          code: created.code,
          status: "created",
          bonusPercent: created.bonusPercent,
        });
      }
    }

    res.json({
      success: true,
      message: "Default promo codes checked",
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create default promo codes error",
      error: error.message,
    });
  }
});

router.patch("/promo-codes/:id/toggle", protect, adminOnly, async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
    }

    promoCode.enabled = !promoCode.enabled;
    await promoCode.save();

    res.json({
      success: true,
      message: promoCode.enabled ? "Promo code enabled" : "Promo code disabled",
      promoCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Toggle promo code error",
      error: error.message,
    });
  }
});

router.delete("/promo-codes/:id", protect, adminOnly, async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
    }

    res.json({
      success: true,
      message: "Promo code deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete promo code error",
      error: error.message,
    });
  }
});

export default router;
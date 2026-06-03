import express from "express";
import User from "../models/User.js";
import Service from "../models/Service.js";
import Order from "../models/Order.js";
import Transaction from "../models/Transaction.js";
import { protect } from "../middleware/auth.js";
import {
  buildOrderNotification,
  sendTelegramNotification,
} from "../utils/telegram.js";

const router = express.Router();

// CREATE ORDER
router.post("/", protect, async (req, res) => {
  try {
    const { serviceId, link, quantity } = req.body;

    if (!serviceId || !link || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Service, link and quantity are required",
      });
    }

    const service = await Service.findById(serviceId);

    if (!service || !service.enabled) {
      return res.status(404).json({
        success: false,
        message: "Service not found or disabled",
      });
    }

    const qty = Number(quantity);

    if (qty < service.min || qty > service.max) {
      return res.status(400).json({
        success: false,
        message: `Quantity must be between ${service.min} and ${service.max}`,
      });
    }

    const charge = Number(((qty / 1000) * service.pricePer1000).toFixed(4));

    const user = await User.findById(req.user._id);

    if (user.balance < charge) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
        needed: charge,
        balance: user.balance,
      });
    }

    user.balance = Number((user.balance - charge).toFixed(4));
    await user.save();

    const order = await Order.create({
      userId: user._id,
      serviceId: service._id,
      link,
      quantity: qty,
      charge,
      status: "pending",
    });

    await Transaction.create({
      userId: user._id,
      type: "order",
      amount: -charge,
      status: "completed",
      provider: "system",
      reference: order._id.toString(),
      description: `Order created for ${service.name}`,
    });

    sendTelegramNotification(
      buildOrderNotification({
        user,
        service,
        order,
      })
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
      newBalance: user.balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create order error",
      error: error.message,
    });
  }
});

// GET MY ORDERS
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    })
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
      message: "Get my orders error",
      error: error.message,
    });
  }
});

// TEST
router.get("/", protect, async (req, res) => {
  res.json({
    success: true,
    message: "Orders route is working",
  });
});

export default router;
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { createPayPalOrder, capturePayPalOrder } from "../utils/paypal.js";

const getClientUrl = () => {
  return String(process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
};

const getPayPalMode = () => {
  return String(process.env.PAYPAL_MODE || "sandbox").trim().toLowerCase();
};

const safeUserId = (req) => {
  return req?.user?._id ? String(req.user._id) : "missing-user";
};

export const createPaypalPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const cleanAmount = Number(amount);

    console.log("Create PayPal payment request:", {
      userId: safeUserId(req),
      amount,
      cleanAmount,
      paypalMode: getPayPalMode(),
      clientUrl: getClientUrl(),
      hasPayPalClientId: Boolean(process.env.PAYPAL_CLIENT_ID),
      hasPayPalClientSecret: Boolean(process.env.PAYPAL_CLIENT_SECRET),
      hasPayPalWebhookId: Boolean(process.env.PAYPAL_WEBHOOK_ID),
    });

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    if (!Number.isFinite(cleanAmount) || cleanAmount < 1) {
      return res.status(400).json({
        success: false,
        message: "Minimum PayPal top-up amount is €1.00",
      });
    }

    const currency = "EUR";

    const returnUrl = `${getClientUrl()}/wallet?paypal=success`;
    const cancelUrl = `${getClientUrl()}/wallet?paypal=cancelled`;

    const paypalOrder = await createPayPalOrder({
      amount: cleanAmount,
      currency,
      returnUrl,
      cancelUrl,
    });

    const approveUrl = paypalOrder.links?.find((link) => link.rel === "approve")?.href;

    if (!approveUrl) {
      console.error("PayPal approval URL not found:", {
        userId: safeUserId(req),
        paypalMode: getPayPalMode(),
        paypalOrderId: paypalOrder?.id,
        paypalStatus: paypalOrder?.status,
        links: paypalOrder?.links,
      });

      return res.status(500).json({
        success: false,
        message: "PayPal approval URL not found",
      });
    }

    const payment = await Payment.create({
      userId: req.user._id,
      provider: "paypal",
      amount: Number(cleanAmount.toFixed(2)),
      currency,
      status: "created",
      paypalOrderId: paypalOrder.id,
      approveUrl,
      rawCreateResponse: paypalOrder,
    });

    console.log("PayPal payment created in database:", {
      userId: safeUserId(req),
      paymentId: String(payment._id),
      paypalOrderId: payment.paypalOrderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
    });

    res.status(201).json({
      success: true,
      message: "PayPal payment created",
      paymentId: payment._id,
      paypalOrderId: payment.paypalOrderId,
      approveUrl,
    });
  } catch (error) {
    console.error("Create PayPal payment controller error:", {
      userId: safeUserId(req),
      paypalMode: getPayPalMode(),
      clientUrl: getClientUrl(),
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Create PayPal payment error",
      error: error.message,
    });
  }
};

export const capturePaypalPayment = async (req, res) => {
  try {
    const { paypalOrderId } = req.body;

    console.log("Capture PayPal payment request:", {
      userId: safeUserId(req),
      paypalOrderId,
      paypalMode: getPayPalMode(),
    });

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    if (!paypalOrderId) {
      return res.status(400).json({
        success: false,
        message: "PayPal order ID is required",
      });
    }

    const payment = await Payment.findOne({
      paypalOrderId,
      userId: req.user._id,
    });

    if (!payment) {
      console.error("PayPal payment not found before capture:", {
        userId: safeUserId(req),
        paypalOrderId,
      });

      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status === "completed") {
      const user = await User.findById(req.user._id).select("-passwordHash");

      return res.json({
        success: true,
        message: "Payment already completed",
        payment,
        user,
      });
    }

    const captureData = await capturePayPalOrder(payment.paypalOrderId);

    if (captureData.status !== "COMPLETED") {
      payment.status = "failed";
      payment.rawCaptureResponse = captureData;
      await payment.save();

      console.error("PayPal payment capture not completed:", {
        userId: safeUserId(req),
        paymentId: String(payment._id),
        paypalOrderId: payment.paypalOrderId,
        paypalStatus: captureData.status,
      });

      return res.status(400).json({
        success: false,
        message: "PayPal payment was not completed",
        paypalStatus: captureData.status,
      });
    }

    const capture =
      captureData.purchase_units?.[0]?.payments?.captures?.[0] || null;

    payment.status = "completed";
    payment.paypalCaptureId = capture?.id || "";
    payment.rawCaptureResponse = captureData;
    await payment.save();

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found after PayPal capture",
      });
    }

    user.balance = Number((Number(user.balance || 0) + Number(payment.amount)).toFixed(2));
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: "topup",
      amount: payment.amount,
      status: "completed",
      provider: "paypal",
      reference: payment.paypalOrderId,
      description: `PayPal wallet top-up €${payment.amount.toFixed(2)}`,
    });

    const cleanUser = await User.findById(user._id).select("-passwordHash");

    console.log("PayPal payment captured and balance updated:", {
      userId: String(user._id),
      paymentId: String(payment._id),
      paypalOrderId: payment.paypalOrderId,
      paypalCaptureId: payment.paypalCaptureId,
      amount: payment.amount,
      newBalance: cleanUser.balance,
    });

    res.json({
      success: true,
      message: "PayPal payment captured and balance updated",
      payment,
      user: cleanUser,
      newBalance: cleanUser.balance,
    });
  } catch (error) {
    console.error("Capture PayPal payment controller error:", {
      userId: safeUserId(req),
      paypalMode: getPayPalMode(),
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Capture PayPal payment error",
      error: error.message,
    });
  }
};

export const getMyPaypalPayments = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const payments = await Payment.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get PayPal payments controller error:", {
      userId: safeUserId(req),
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Get PayPal payments error",
      error: error.message,
    });
  }
};
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { createPayPalOrder, capturePayPalOrder } from "../utils/paypal.js";

const getClientUrl = () => {
  return process.env.CLIENT_URL || "http://localhost:5173";
};

export const createPaypalPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const cleanAmount = Number(amount);

    if (!cleanAmount || cleanAmount < 1) {
      return res.status(400).json({
        success: false,
        message: "Minimum PayPal top-up amount is €1.00",
      });
    }

    const currency = "EUR";

    const tempReturnUrl = `${getClientUrl()}/wallet?paypal=success`;
    const cancelUrl = `${getClientUrl()}/wallet?paypal=cancelled`;

    const paypalOrder = await createPayPalOrder({
      amount: cleanAmount,
      currency,
      returnUrl: tempReturnUrl,
      cancelUrl,
    });

    const approveUrl = paypalOrder.links?.find((link) => link.rel === "approve")?.href;

    if (!approveUrl) {
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

    const finalApproveUrl = approveUrl;

    res.status(201).json({
      success: true,
      message: "PayPal payment created",
      paymentId: payment._id,
      paypalOrderId: payment.paypalOrderId,
      approveUrl: finalApproveUrl,
    });
  } catch (error) {
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

    res.json({
      success: true,
      message: "PayPal payment captured and balance updated",
      payment,
      user: cleanUser,
      newBalance: cleanUser.balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Capture PayPal payment error",
      error: error.message,
    });
  }
};

export const getMyPaypalPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get PayPal payments error",
      error: error.message,
    });
  }
};